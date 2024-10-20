<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { NH2, NSkeleton, NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { BaseServices } from '../services/BaseServices';

const router = useRouter();

const loading = ref(true);

type AuthTicketsNotLoginType = {
    login: false;
}
type AuthTicketType = {
    ticket: string;
    ip: string;
    ua: string;
}
type AuthTicketsLoginType = {
    login: true;
    user: string;
    tgt: AuthTicketType;
    st: AuthTicketType[];
}
type AuthTicketsType = AuthTicketsNotLoginType | AuthTicketsLoginType;
const res = ref<AuthTicketsType>({
    login: false
});

const login = () => {
    router.push('/');
};

const register = () => {
    router.push('/register');
};

onBeforeMount(async () => {
    try {
        res.value = await BaseServices.getAuthTickets();
    }
    catch (e) {
        router.push({
            path: '/error',
            query: {
                code: 500,
                mes: `查询票据信息时出错`,
            }
        });
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
                <n-skeleton style="width: 60%" />
            </template>
            <template v-else-if="!res.login">
                看起来您还没有登录
            </template>
            <template v-else>
                欢迎您，{{ res.user }}
            </template>
        </div>
        <template v-if="loading">
            <div style="display: flex; flex-direction: column; gap: 10px">
                <n-skeleton style="width: 60%" />
                <n-skeleton style="width: 40%" />
                <n-skeleton style="width: 20%" />
                <n-skeleton style="width: 80%" />
            </div>
        </template>
        <template v-else-if="!res.login">
            <n-button type="info" @click="login"
                style="border-radius: 0; padding-left: 40px; padding-right: 40px;">登录</n-button>
            <n-button type="info" secondary @click="register"
                style="margin-left: 5px; border-radius: 0; padding-left: 40px; padding-right: 40px;">注册</n-button>
        </template>
        <template v-else>
        </template>
    </div>
</template>