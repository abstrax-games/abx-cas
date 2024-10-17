<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { NH2, NResult, NButton } from 'naive-ui';

const route = useRoute();
const router = useRouter();

function backToLogin() {
    router.push({
        path: '/login',
        query: route.query
    })
}
</script>

<template>
    <div class="ax-card ax-center ax-main">
        <n-h2 class="ax-header">AbstraX</n-h2>
        <div class="append-text">
            忘记密码
        </div>
        <n-result status="500" title="它不会回来了" description="有些东西一旦失去就不会再来了">
            <template #footer>
                <n-button type="info" @click="backToLogin"
                    style="border-radius: 0; padding-left: 40px; padding-right: 40px;">返回登录</n-button>
            </template>
        </n-result>
    </div>
    <div class="ax-light"></div>
</template>