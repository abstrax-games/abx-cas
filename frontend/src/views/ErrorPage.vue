<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { NH2, NResult, NButton } from 'naive-ui';

const route = useRoute();
const router = useRouter();

function convertErrorCode(code: any): "403" | "404" | "500" | "error" | "info" | "success" | "warning" | "418" {
    const validCodes = ["403", "404", "500", "error", "info", "success", "warning", "418"];
    if (validCodes.includes(String(code))) {
        return String(code) as "403" | "404" | "500" | "error" | "info" | "success" | "warning" | "418";
    } else {
        return "error";
    }
}

const errorCode = Number(route.query.code) || 1234;
const errorMessage = route.query.mes as string || `${errorCode} 错误`;

const errorExplainDict: { [key: number]: string } = {
    400: "若方法不对，无论多么努力，都无法寻得心中的那个她。",
    403: "被她拒绝时也无需灰心，提升自我，或许下次机会便被受。",
    404: "虽迷失于寻找她的路途，但请相信，总有新方向等你去发现。",
    500: "每个人都有崩溃的瞬间，但只需重整旗鼓，前路依旧光明。",
    502: "暂时的挫折是成功的垫脚石，在追梦的旅程中，永远不要灰心。",
    504: "等待虽苦，但心怀信念，终将跨越时空，追逐梦想。"
}

const errorExplain = route.query.explain as string || errorExplainDict[errorCode] || "未知的错误如同心中的一抹阴霾，虽不明其因，但时光终会带来答案。";

function back() {
    router.back();
}

function backToHome() {
    router.push('/');
}
</script>

<template>
    <div class="ax-card ax-center ax-main">
        <n-h2 class="ax-header">AbstraX</n-h2>
        <div class="append-text">
            发生{{ errorCode }} 错误
        </div>
        <n-result :status="convertErrorCode(errorCode)" :title="errorMessage" :description="errorExplain">
            <template #footer>
                <n-button type="info" secondary @click="back"
                    style="border-radius: 0; padding-left: 40px; padding-right: 40px;">返回</n-button>
                <n-button type="info" @click="backToHome"
                    style="margin-left: 5px; border-radius: 0; padding-left: 40px; padding-right: 40px;">首页</n-button>
            </template>
        </n-result>
    </div>
    <div class="ax-light"></div>
</template>