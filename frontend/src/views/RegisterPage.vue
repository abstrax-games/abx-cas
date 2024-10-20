<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NH2, NButton, NSkeleton, NModal, useNotification } from 'naive-ui';

import Service from '../models/Service';
import { returnRoute } from '../libs/apath';

import { Backend } from '../libs/settings';
import { BaseServices } from '../services/BaseServices';
import { UserServices } from '../services/UserServices';

const route = useRoute();
const router = useRouter();

const notify = useNotification();

const service = ref(route.query.service as string || "default");

const loading = ref(true);
const serviceInfo = ref(new Service());
let servicePath = route.query.path as string;

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const emailCaptcha = ref('');

const showCaptchaModal = ref(false);
const imgCaptcha = ref('');
const imgCaptchaUrl = ref(`${Backend.url}/captcha`);

const emailCaptchaLastSecond = ref(0);
const emailCountTimer = ref<any>(null);

async function showImgCaptchaModal() {
    imgCaptcha.value = '';
    showCaptchaModal.value = true;
}

async function changeImgCaptchaUrl() {
    imgCaptcha.value = '';
    imgCaptchaUrl.value = `${Backend.url}/captcha?${new Date().getTime()}`;
}

async function sendEmailCaptcha() {
    if (loading.value || emailCaptchaLastSecond.value > 0) {
        return;
    }
    loading.value = true;
    const res = await BaseServices.sendEmailCaptcha(email.value, imgCaptcha.value);
    loading.value = false;
    if (res.success) {
        emailCaptchaLastSecond.value = 60;
        showCaptchaModal.value = false;
        notify.success({
            title: '发送验证码成功',
            duration: 3000
        });
    }
    else {
        notify.error({
            title: '发送验证码失败',
            content: res.message,
            duration: 3000
        });
        if (res.lastingSeconds) {
            emailCaptchaLastSecond.value = res.lastingSeconds;
        }
        if (res.message === 'Invalid image captcha') {
            changeImgCaptchaUrl();
        }
        else {
            showCaptchaModal.value = false;
        }
    }
    if (emailCountTimer.value) {
        clearInterval(emailCountTimer.value);
        emailCountTimer.value = null;
    }
    if (emailCaptchaLastSecond.value > 0) {
        emailCountTimer.value = setInterval(() => {
            if (emailCaptchaLastSecond.value <= 0) {
                clearInterval(emailCountTimer.value);
                emailCountTimer.value = null;
                return;
            }
            emailCaptchaLastSecond.value--;
        }, 1000);
    }
}

async function register() {
    if (loading.value) {
        return;
    }
    if (password.value !== confirmPassword.value) {
        notify.error({
            title: '两次密码不一致',
            content: '请确认两次输入的密码一致',
            duration: 3000
        });
        return;
    }
    loading.value = true;
    const res = await UserServices.register(username.value, email.value, password.value, emailCaptcha.value, service.value);
    loading.value = false;
    if (res.success) {
        notify.success({
            title: '注册成功',
            duration: 3000
        });
        router.push(res.callback ?? '/user');
    }
    else {
        notify.error({
            title: '注册失败',
            content: res.message,
            duration: 3000
        });
    }
}

onBeforeMount(async () => {
    try {
        await serviceInfo.value.fetch(service.value);
        if (!servicePath) {
            servicePath = serviceInfo.value.servicePath ?? `https://go.abstrax.cn/?service=${service.value}`;
        }
    }
    catch (e: any) {
        if (e.response && e.response.status === 404) {
            console.warn(`Service ${service.value} not found`);
            service.value = "default";
        }
        else {
            router.push({
                path: '/error',
                query: {
                    code: 500,
                    mes: `查询服务${service}信息时出错`,
                }
            })
        }
    }
    finally {
        loading.value = false;
    }
})
</script>

<template>
    <div class="ax-card ax-center ax-main">
        <n-h2 class="ax-header">AbstraX</n-h2>
        <div class="append-text">
            <template v-if="loading">
                <n-skeleton text style="width: 60%" />
            </template>
            <template v-else>
                注册新的 Abstrax 通行证
            </template>
        </div>
        <div class="ax-register-container">
            <div class="ax-input-box">
                <input class="ax-input" type="text" v-model="username" placeholder="用户名" :disabled="loading" />
                <div class="ax-input-bar"></div>
            </div>
            <div class="ax-input-box">
                <input class="ax-input" type="password" v-model="password" placeholder="密码" :disabled="loading" />
                <div class="ax-input-bar"></div>
            </div>
            <div class="ax-input-box">
                <input class="ax-input" type="password" v-model="confirmPassword" placeholder="确认密码"
                    :disabled="loading" />
                <div class="ax-input-bar"></div>
            </div>
            <div class="ax-input-box">
                <div class="ax-input-box-group">
                    <input class="ax-input" type="email" v-model="email" placeholder="邮箱" :disabled="loading" />
                    <n-button type="info" strong secondary style="border-radius: 0;"
                        :disabled="loading || emailCaptchaLastSecond > 0" @click="showImgCaptchaModal">获取验证码<template
                            v-if="emailCaptchaLastSecond > 0">({{ emailCaptchaLastSecond }}) </template></n-button>
                </div>
            </div>
            <div class="ax-input-box">
                <input class="ax-input" type="text" v-model="emailCaptcha" placeholder="邮箱验证码" :disabled="loading" />
                <div class="ax-input-bar"></div>
            </div>
            <div class="ax-button-box">
                <div>
                    已有账号，立刻<router-link to="/">登录</router-link>
                </div>
                <n-button type="info" style="border-radius: 0; padding-left: 40px; padding-right: 40px;"
                    :disabled="loading" @click="register">注册</n-button>
            </div>
        </div>
    </div>
    <n-modal v-model:show="showCaptchaModal" preset="dialog" title="Dialog">
        <template #header>
            <div>图片验证码</div>
        </template>
        <div>
            <div class="ax-input-box ax-input-captcha">
                <div class="ax-input-box-group">
                    <input class="ax-input" type="text" v-model="imgCaptcha" placeholder="图片验证码" maxlength="4"
                        :disabled="loading" />
                    <img :src="imgCaptchaUrl" @click="changeImgCaptchaUrl">
                </div>
            </div>
        </div>
        <template #action>
            <n-button strong secondary @click="showCaptchaModal = false">取消</n-button>
            <n-button type="primary" @click="sendEmailCaptcha" :disabled="loading">确定</n-button>
        </template>
    </n-modal>
    <div class="ax-light"></div>
</template>

<style>
.ax-register-container {
    height: 399px;
    max-height: calc(100vh - 182.4px);
    overflow-y: auto;
    margin: 0 -48px;
    padding: 0 48px;
}
</style>