import { FastifyInstance } from "fastify";

import { readdirSync } from "fs";
import { join } from "path";

export default async function routes(fastify: FastifyInstance, options: any) {
    const routeFiles = readdirSync(__dirname).filter(file => file !== 'index.ts');

    for (const file of routeFiles) {
        const route = await import(join(__dirname, file));
        const routeName = file.replace('.ts', '');
        fastify.register(route.default, { prefix: `/${routeName}` });
    }
}