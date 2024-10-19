<script setup lang="js">
import { ref } from 'vue';
import { NH2, NSkeleton, NButton } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(true);
const res = ref({
    login: false
});

const login = () => {
    router.push('/');
};

const register = () => {
    router.push('/register');
};
</script>

<template>
    <div class="ax-card ax-center ax-main">
        <n-h2 class="ax-header">AbstraX</n-h2>
        <div class="append-text">
            Abx CAS Authentication
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
            <p>看起来您还没有登录</p>
            <n-button type="info" strong secondary @click="login">登录</n-button>
            <n-button type="info" strong secondary @click="register">注册</n-button>
        </template>
    </div>
</template>