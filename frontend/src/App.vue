<script setup lang="ts">
import { NModalProvider, NNotificationProvider } from 'naive-ui';
</script>
<template>
    <n-modal-provider>
        <n-notification-provider>
            <router-view />
        </n-notification-provider>
    </n-modal-provider>
</template>