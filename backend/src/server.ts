import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import routes from "./routes";
import fastifySecureSession from "@fastify/secure-session";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

import svgCaptcha from "svg-captcha";

import "reflect-metadata";
import typeorm from "./plugins/typeorm";
import { User, Service, Ticket, Captcha } from "./models";
import { db, server, mail } from "../config.json";
import { DataSource, MoreThan, Not } from "typeorm";

// node mailer
import nodemailer from "nodemailer";

import bcrypt from "bcrypt";
import crypto from "crypto";

import { readFileSync } from "fs";
import path from "path";
import { CAPTCHA_TYPE } from "./constants";

const appInfo = {
    name: "Abstrax Authentication Platform",
    version: "1.0.0",
};

// --------------------------
// Stage 1: Setup plugins
// --------------------------

const app = Fastify({
    logger: true,
});

app.register(fastifyStatic, {
    root: path.join(__dirname, "pages"),
});

app.register(cors, {
    credentials: true,
    origin: (origin, cb) => {
        if (!origin) {
            cb(null, true);
            return;
        }
        const hostname = new URL(origin).hostname;
        console.log(hostname);
        console.log(hostname)
        if (server.allowedOrigins.includes(hostname)) {
            //  Request from localhost will pass
            cb(null, true);
            return;
        }
        // Generate an error on other origins, disabling access
        cb(new Error("Not allowed"), false);
    },
});

// Register the typeorm plugin with the database configuration
app.register(typeorm, {
    ...db,
    entities: [User, Service, Ticket, Captcha],
    synchronize: true,
});

app.register(fastifySecureSession, {
    sessionName: "axSession",
    cookieName: "ax-session-cookie",
    key: readFileSync(path.join(__dirname, "../secret-key")),
    expiry: 60 * 60,
    cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
    },
});

declare module "fastify" {
    interface FastifyInstance {
        dataSource: DataSource;
    }
    interface FastifyRequest {
        setCookie(name: string, value: string, options: any): void;
        axSession: {
            set(key: string, value: any): void;
            get(key: string): any;
        };
    }
}

app.register(routes);

// Mailer
const transporter = nodemailer.createTransport(mail);

app.get("/info", async (request, reply) => {
    return { ...appInfo };
});

// Define the body for the login route
type AuthBody = Partial<{
    serviceId: string;
    username: string;
    password: string;
    email: string;
    emailCaptcha: string;
    phone: string;
    phoneCaptcha: string;
}>;

type RegisterBody = Partial<{
    serviceId: string;
    username: string;
    password: string;
    email: string;
    emailCaptcha: string;
    phone: string;
    phoneCaptcha: string;
}>;

function handleError(
    reply: FastifyReply,
    code: number,
    message: string,
    data?: any
) {
    return reply.status(code).send({ success: false, message, ...data });
}

/**
 * Libs
 */

/**
 * 检查Session中是否有有效的TGT
 * @param request Request
 * @returns { tgt: Ticket, user: User }
 */
async function checkTGTFromSession(request: FastifyRequest) {
    let tgt, user;

    const ticketRepository = app.dataSource.getRepository(Ticket);
    const userRepository = app.dataSource.getRepository(User);

    // 首先观察Session中是否已经有有效的TGT了
    const sessionTGT = request.axSession.get("tgt");
    if (sessionTGT) {
        console.log(`Session TGT: ${sessionTGT}`);
        // 判定是否有效
        try {
            tgt = await ticketRepository.findOne({
                where: {
                    ticket: sessionTGT,
                    ticketGrantingTicket: null,
                    expired: MoreThan(new Date(Date.now())),
                },
            });
        } catch (err) {
            // 删除无效的TGT
            request.axSession.set("tgt", null);
            tgt = null;
        }
        // 从tgt获取用户信息
        if (tgt) {
            try {
                user = await userRepository.findOne({
                    where: { id: tgt.userid },
                });
            } catch (err) {
                // 删除无效的TGT
                request.axSession.set("tgt", null);
                tgt = null;
            }
        } else {
            // 删除无效的TGT
            request.axSession.set("tgt", null);
        }
    }
    return { tgt, user };
}

async function genTGTByUser(user: User, ip: string, ua: string) {
    const ticketRepository = app.dataSource.getRepository(Ticket);

    let tgt;
    // 先查询是否已经存在有效的TGT
    try {
        tgt = await ticketRepository.findOne({
            where: {
                userid: user.id,
                ticketGrantingTicket: null,
                expired: MoreThan(new Date(Date.now())),
            },
        });
    } catch (err) {
        console.error(`Error finding TGT: ${err}\nUser: ${user.id}`);
        throw err;
    }
    // 如果已经存在有效的TGT，直接返回，否则创建新的
    if (!tgt) {
        try {
            tgt = ticketRepository.create({
                ticket: crypto.randomBytes(32).toString("hex"),
                userid: user.id,
                consumed: null,
                created: new Date(),
                expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天有效期
                ticketGrantingTicket: null, // 标记为 TGT
                ip,
                ua,
            });
            await ticketRepository.save(tgt);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return tgt;
}

async function genSTByTGT(user: User, tgt: Ticket, ip: string, ua: string, serviceId?: string) {
    let st;
    const ticketRepository = app.dataSource.getRepository(Ticket);
    if (serviceId) {
        const serviceRepository = app.dataSource.getRepository(Service);
        const service = await serviceRepository.findOne({
            where: { serviceId },
        });
        //console.log(serviceId, service);
        if (service) {
            // 生成新的 Service Ticket
            try {
                st = ticketRepository.create({
                    ticket: crypto.randomBytes(32).toString("hex"),
                    userid: user.id,
                    serviceId,
                    consumed: null,
                    created: new Date(),
                    expired: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1天有效期
                    ticketGrantingTicket: tgt.ticket, // 关联 TGT
                    ip,
                    ua,
                });

                await ticketRepository.save(st);
            } catch (err) {
                console.error(`Error creating service ticket: ${err}\nUser: ${user.id}\nService: ${serviceId}`);
                throw err;
            }
        }
    }
    return st;
}

async function genJumpLink(st?: string, serviceId?: string) {
    if (st && serviceId) {
        const serviceRepository = app.dataSource.getRepository(Service);
        const service = await serviceRepository.findOne({
            where: { serviceId },
        });
        if (service) {
            const callback = new URL(service.callbackPath);
            callback.searchParams.append("ticket", st);
            return callback.toString();
        }
        else {
            return `/user`;
        }
    }
    else {
        return `/user`;
    }
}

// static pages
app.get<{ Querystring: { service?: string } }>("/", async (request, reply) => {
    let { tgt, user } = await checkTGTFromSession(request);

    if (tgt) {
        const serviceId = request.query.service;
        if (serviceId) {
            let st;
            try {
                st = await genSTByTGT(user, tgt, request.ip, request.headers["user-agent"] as string, serviceId);
            }
            catch (err) {
                return reply.redirect(`/error?code=500&mes=Error creating service ticket`);
            }
            return reply.redirect(await genJumpLink(st.ticket, serviceId));
        }
        else {
            return reply.redirect(`/user`);
        }
    }
    else {
        return reply.sendFile("index.html");
    }
});

app.get("/register", async (request, reply) => {
    return reply.sendFile("index.html");
});

app.get("/error", async (request, reply) => {
    return reply.sendFile("index.html");
});

app.get('/user', async (request, reply) => {
    return reply.sendFile("index.html");
});

app.get("/assets/*", async (request, reply) => {
    return reply.sendFile(request.url);
});

// 获取服务信息
app.get<{ Params: { id: string } }>("/service/:id", async (request, reply) => {
    const { id } = request.params;

    const serviceRepository = app.dataSource.getRepository(Service);
    const service = await serviceRepository.findOne({
        where: { serviceId: id },
    });

    if (!service) {
        return handleError(reply, 404, "Service not found");
    }

    return { success: true, data: service };
});

// 图片验证码
app.get<{ Params: { id: number } }>("/captcha", async (request, reply) => {
    const captcha = svgCaptcha.create({
        ignoreChars: "0oO1ilI",
        color: true,
        noise: 8,
    });
    request.axSession.set("captcha", captcha.text);
    reply.type("image/svg+xml");
    return reply.send(captcha.data);
});

// 发送验证码
app.post<{ Body: { target: string; type: number, imgCaptcha: string } }>(
    "/captcha",
    {
        schema: {
            body: {
                type: "object",
                required: ["target", "type", "imgCaptcha"],
                properties: {
                    target: { type: "string" },
                    type: { type: "number" },
                    imgCaptcha: { type: "string" },
                },
            },
        },
    },
    async (request, reply) => {
        const { target, type, imgCaptcha } = request.body;

        if (!target) {
            return handleError(reply, 400, "Missing target");
        }

        const ip = (request.headers["x-real-ip"] as string) || request.ip;
        const ua = request.headers["user-agent"] as string;

        const sessionCaptcha = request.axSession.get("captcha");
        if (!sessionCaptcha || sessionCaptcha !== imgCaptcha) {
            console.error(`Invalid image captcha\nClient: ${ip} ${ua}\nRight Captcha: ${sessionCaptcha}\nReceived: ${imgCaptcha}`);
            return handleError(reply, 400, "Invalid image captcha");
        }

        const captchaRepository = app.dataSource.getRepository(Captcha);
        // 查找60秒内是否已经发送过验证码

        const captcha = await captchaRepository.findOne({
            where: {
                ip,
                type,
                createDate: MoreThan(new Date(Date.now() - 60 * 1000)),
            },
        });

        if (captcha) {
            // 60秒只能发1次，计算还剩多少秒才能发
            const lastingSeconds = Math.floor(
                (captcha.createDate.getTime() + 60 * 1000 - Date.now()) / 1000
            );
            return handleError(reply, 429, "Captcha already sent", {
                lastingSeconds,
            });
        }

        // 生成验证码
        // 生成一个6位的随机数字
        const captchaString = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");

        try {
            const newCaptcha = captchaRepository.create({
                captcha: captchaString,
                type,
                target,
                expired: new Date(Date.now() + 5 * 60 * 1000),
                ip,
                ua,
            });

            await captchaRepository.save(newCaptcha);
        } catch (err) {
            return handleError(reply, 500, "Error saving captcha");
        }

        try {
            // 发送验证码
            if (type === CAPTCHA_TYPE.PHONE) {
                // 发送短信
                throw new Error("SMS not implemented");
            } else if (type === CAPTCHA_TYPE.EMAIL) {
                // 发送邮件
                try {
                    const info = await transporter.sendMail({
                        from: '"no-reply" <no-reply@abstrax.cn>',
                        to: target,
                        subject: "验证邮件 - Abstrax Authentication",
                        text: `您的验证码是 ${captchaString}`,
                        html: `<style>.abx-container{width:100%;padding: 30px 0;box-sizing:border-box;background-color:#eceff1;line-height:1.5}
.abx-captcha{max-width:600px;padding: 48px;margin:30px auto;background-color:#fff;}.abx-captcha-number{margin:15px 0;font-size:32px;font-weight:bold}.abx-divider{margin:45px 0 20px 0;height:1px;width:100%;background-color:#ddd}.abx-captcha-text-append{color:#787a7b;}</style><div class="abx-container"><div class="abx-captcha"><div class="abx-captcha-text">您好，您正在进行 Abstrax 邮箱验证，您的验证码是：</div><div class="abx-captcha-number">${captchaString}</div><div class="abx-captcha-text">验证码 5 分钟有效，如果不是你发起的邮箱绑定验证请求，请忽略此邮件。 </div><div class="abx-divider"></div><div class="abx-captcha-text-append">Abstrax Games @ ${new Date().toLocaleString()}.</div></div></div>`,
                    });
                } catch (err) {
                    console.log(err);
                    return handleError(reply, 500, "Error sending email");
                }
            }
        } catch (e) {
            return handleError(reply, 500, "Error sending captcha");
        }

        return { success: true };
    }
);

async function checkCaptcha(target: string, type: number, captcha: string) {
    const captchaRepository = app.dataSource.getRepository(Captcha);
    const captchaData = await captchaRepository.findOne({
        where: {
            target,
            type,
            consumed: false,
            expired: MoreThan(new Date(Date.now())),
        },
    });

    if (!captchaData) {
        return false;
    }

    if (captchaData.captcha !== captcha) {
        captchaData.tryTimes += 1;
        await captchaRepository.save(captchaData);

        if (captchaData.tryTimes >= 3) {
            captchaData.consumed = true;
            await captchaRepository.save(captchaData);
        }

        return false;
    }

    captchaData.consumed = true;
    await captchaRepository.save(captchaData);

    return true;
}

// Login route, check username and password. If correct, create a session and set a ticket
app.post<{ Body: AuthBody }>(
    "/auth/login",
    {
        schema: {
            body: {
                type: "object",
                required: [],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    email: { type: "string" },
                    emailCaptcha: { type: "string" },
                    phone: { type: "string" },
                    phoneCaptcha: { type: "string" },
                    serviceId: { type: "string" },
                },
            },
        },
    },
    async (request, reply) => {
        let { tgt, user } = await checkTGTFromSession(request);

        const userRepository = app.dataSource.getRepository(User);
        const ticketRepository = app.dataSource.getRepository(Ticket);

        const ip = (request.headers["x-real-ip"] as string) || request.ip;
        const ua = request.headers["user-agent"] as string;

        // 没有有效的TGT，就继续登录
        if (!tgt) {
            /**
             * 以下是判断登录的逻辑
             */
            const {
                username,
                password,
                email,
                emailCaptcha,
                phone,
                phoneCaptcha,
            } = request.body;

            // 用户名，邮箱，手机号至少提供一个
            if (!username && !phone && !email) {
                return handleError(reply, 400, "Missing login data");
            }

            // 提供了用户名，就看密码正不正确。
            if (username) {
                // 没有提供密码
                if (!password) {
                    return handleError(reply, 400, "Missing password");
                }

                try {
                    user = await userRepository.findOne({
                        where: { username },
                    });
                } catch (err) {
                    return handleError(reply, 500, "Error finding user");
                }

                // 账号不存在
                if (!user) {
                    return handleError(
                        reply,
                        401,
                        "Invalid username or password"
                    );
                }

                // Check the password
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return handleError(
                        reply,
                        401,
                        "Invalid username or password"
                    );
                }
            } else if (email) {
                // 首先判断这个邮箱是否注册
                try {
                    user = await userRepository.findOne({
                        where: { email },
                    });
                } catch (err) {
                    return handleError(reply, 500, "Error finding user");
                }

                if (!user) {
                    return handleError(reply, 404, "Email not found");
                }

                if (!emailCaptcha) {
                    return handleError(reply, 400, "Missing email captcha");
                }

                // 验证邮箱验证码
                if (
                    !(await checkCaptcha(
                        email,
                        CAPTCHA_TYPE.EMAIL,
                        emailCaptcha
                    ))
                ) {
                    return handleError(reply, 400, "Invalid email captcha");
                }
            } else if (phone) {
                // 首先判断这个手机号是否注册
                try {
                    user = await userRepository.findOne({
                        where: { phone },
                    });
                } catch (err) {
                    return handleError(reply, 500, "Error finding user");
                }

                if (!user) {
                    return handleError(reply, 404, "Phone not found");
                }

                if (!phoneCaptcha) {
                    return handleError(reply, 400, "Missing phone captcha");
                }

                if (
                    !(await checkCaptcha(
                        phone,
                        CAPTCHA_TYPE.PHONE,
                        phoneCaptcha
                    ))
                ) {
                    return handleError(reply, 400, "Invalid phone captcha");
                }
            }

            // 登录成功，创建票据
            try {
                tgt = await genTGTByUser(user, ip, ua);
            }
            catch (err) {
                return handleError(reply, 500, "Error creating ticket");
            }
        }

        // 保存 TGT 到 Session
        request.axSession.set("tgt", tgt.ticket);

        // 生成 Service Ticket (ST)
        const { serviceId } = request.body;
        let st;
        try {
            st = genSTByTGT(user, tgt, ip, ua, serviceId);
        }
        catch (err) {
            return handleError(reply, 500, "Error creating service ticket");
        }

        const callback = await genJumpLink(st?.ticket, serviceId);

        return { success: true, callback };
    }
);

// 注册接口
app.post<{ Body: RegisterBody }>(
    "/auth/register",
    {
        schema: {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    email: { type: "string" },
                    emailCaptcha: { type: "string" },
                    phone: { type: "string" },
                    phoneCaptcha: { type: "string" },
                    serviceId: { type: "string" },
                },
            },
        },
    },
    async (request, reply) => {
        const {
            username,
            password,
            email,
            emailCaptcha,
            phone,
            phoneCaptcha
        } = request.body;

        // 手机和邮箱至少提供一个
        if (!phone && !email) {
            return handleError(reply, 400, "Missing phone or email");
        }

        const ip = (request.headers["x-real-ip"] as string) || request.ip;
        const ua = request.headers["user-agent"] as string;

        // 提供了手机，就看手机验证码是否正确
        if (phone) {
            // 没提供验证码
            if (!phoneCaptcha) {
                return handleError(reply, 400, "Missing phone captcha");
            }

            // 验证手机验证码
            if (
                !(await checkCaptcha(phone, CAPTCHA_TYPE.PHONE, phoneCaptcha))
            ) {
                return handleError(reply, 400, "Invalid phone captcha");
            }
        } else if (email) {
            // 没提供验证码
            if (!emailCaptcha) {
                return handleError(reply, 400, "Missing email captcha");
            }

            if (
                !(await checkCaptcha(email, CAPTCHA_TYPE.EMAIL, emailCaptcha))
            ) {
                return handleError(reply, 400, "Invalid email captcha");
            }
        }

        const userRepository = app.dataSource.getRepository(User);

        // 检查用户名，邮箱，手机号是否已经被注册
        let user;
        try {
            user = await userRepository.findOne({
                where: [{ username }, { email }, { phone }],
            });
        } catch (err) {
            return handleError(reply, 500, "Error finding user");
        }
        if (user) {
            return handleError(
                reply,
                400,
                "Username, email or phone already taken"
            );
        }

        const salt = await bcrypt.genSalt(14);
        const hash = await bcrypt.hash(password, salt);

        let newUser: User;
        try {
            // 创建新的用户
            newUser = userRepository.create({
                username,
                password: hash,
                email,
                phone,
                lastLoginDate: new Date(),
            });

            await userRepository.save(newUser);
        } catch (err) {
            return reply.status(500).send({ message: "Error creating user" });
        }

        // 生成 Ticket Granting Ticket (TGT)
        let tgt: Ticket;
        try {
            tgt = await genTGTByUser(newUser, ip, ua);
        } catch (err) {
            return handleError(reply, 500, "Error creating ticket");
        }

        request.axSession.set("tgt", tgt.ticket);

        const { serviceId } = request.body;
        let st;
        try {
            st = genSTByTGT(user, tgt, ip, ua, serviceId);
        }
        catch (err) {
            return handleError(reply, 500, "Error creating service ticket");
        }

        const callback = await genJumpLink(st?.ticket, serviceId);

        return { success: true, callback };
    }
);

// 验证票据接口，验证 Service Ticket (ST) 或 Ticket Granting Ticket (TGT)
app.post<{ Body: { ticket: string; serviceId: string } }>(
    "/auth/check",
    {
        schema: {
            body: {
                type: "object",
                required: ["ticket", "serviceId"],
                properties: {
                    ticket: { type: "string" }, // 必须提供 Service Ticket
                    serviceId: { type: "string" },
                },
            },
        },
    },
    async (request, reply) => {
        const { ticket, serviceId } = request.body;

        const serviceRepository = app.dataSource.getRepository(Service);
        const service = await serviceRepository.findOne({
            where: { serviceId },
        });

        const ip = (request.headers["x-real-ip"] as string) || request.ip;
        const ua = request.headers["user-agent"] as string;

        if (!service) {
            return handleError(reply, 404, "Service not found");
        }

        const ticketRepository = app.dataSource.getRepository(Ticket);

        // 检查 Service Ticket (ST) 是否有效
        let serviceTicket;
        try {
            serviceTicket = await ticketRepository.findOne({
                where: {
                    ticket,
                    consumed: null,
                    expired: MoreThan(new Date()), // 确保票据未过期
                },
            });
        } catch (err) {
            return handleError(reply, 500, "Error finding Service Ticket");
        }

        if (!serviceTicket) {
            return handleError(reply, 401, "Invalid Service Ticket");
        }

        // 标记 ST 为已消费
        serviceTicket.consumed = new Date();
        try {
            await ticketRepository.save(serviceTicket);
        } catch (err) {
            return handleError(reply, 500, "Error consuming Service Ticket");
        }

        // 获取用户信息
        const userRepository = app.dataSource.getRepository(User);
        let user;
        try {
            user = await userRepository.findOne({
                where: { id: serviceTicket.userid },
            });
        } catch (err) {
            return handleError(reply, 500, "Error finding user");
        }

        return { success: true, user };
    }
);

// 查询用户的全部TGT信息
app.get("/auth/tickets", async (request, reply) => {
    let { tgt, user } = await checkTGTFromSession(request);

    if (tgt) {
        // 查询该TGT下的所有ST，每个应用只返回一个
        const ticketRepository = app.dataSource.getRepository(Ticket);
        const serviceTickets = await ticketRepository.find({
            where: {
                userid: tgt.userid,
                ticketGrantingTicket: tgt.ticket,
                consumed: Not(null),
            },
        });
        return {
            login: true,
            auth: { ip: tgt.ip, ua: tgt.ua },
            user: user.username,
            st: serviceTickets.map((st) => ({ ticket: st.ticket, serviceId: st.serviceId })),
        }
    }
    else {
        return {
            login: false
        }
    }
});

// Run the server!
app.listen(server, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }

    console.log("Abstrax Authentication Server Running Successfully");
    console.log(`Server listening at ${address}`);
});
