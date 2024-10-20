<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NH2, NButton, NSkeleton, useNotification } from 'naive-ui';

import Service from '../models/Service';
import { UserServices } from '../services/UserServices';
import { returnRoute } from '../libs/apath';

const route = useRoute();
const router = useRouter();

const notify = useNotification();

const service = ref(route.query.service as string || "default");

const loading = ref(true);
const serviceInfo = ref(new Service());
let servicePath = route.query.path as string;

const username = ref('');
const password = ref('');

async function login() {
    if (loading.value) {
        return;
    }
    loading.value = true;
    const res = await UserServices.login(username.value, password.value, service.value);
    loading.value = false;
    if (res.success) {
        notify.success({
            title: '登录成功',
            duration: 3000
        });
        router.push(res.callback ?? '/user');
    }
    else {
        notify.error({
            title: '登录失败',
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
});
</script>

<template>
    <div class="ax-card ax-center ax-main">
        <n-h2 class="ax-header">AbstraX</n-h2>
        <div class="append-text">
            <template v-if="loading">
                <n-skeleton text style="width: 60%" />
            </template>
            <template v-else>
                登录至<template v-if="service !== 'default'"><a :href="servicePath">{{ serviceInfo.serviceName }}</a></template><template v-else>Abstrax CAS</template>
            </template>
        </div>
        <div class="ax-input-box">
            <input class="ax-input" type="text" v-model="username" placeholder="用户名, 邮箱, 或者手机号" :disabled="loading" />
            <div class="ax-input-bar"></div>
        </div>
        <div class="ax-input-box">
            <input class="ax-input" type="password" v-model="password" placeholder="密码" :disabled="loading" />
            <div class="ax-input-bar"></div>
        </div>
        <div class="ax-button-box">
            <div>
                还没账号，立刻<router-link to="/register">注册</router-link>
            </div>
            <n-button type="info" style="border-radius: 0; padding-left: 40px; padding-right: 40px;"
                :disabled="loading" @click="login">登录</n-button>
        </div>
    </div>
    <div class="ax-light"></div>
</template>