<script lang="ts" setup>
import { NConfigProvider, NNotificationProvider } from 'naive-ui'
import { auth } from './config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { onMounted } from 'vue';
import router from './router';
const themeOverrides = {
    common: {
      primaryColor: '#007BFF',
      secondaryColor: '#FFC107',
      primaryColorHover: '#007BFF',
      primaryColorPressed: '#007BFF',
    },
    Input:{
      borderFocus: '1px solid #007BFF',
      borderHover: '1px solid #007BFF',
      borderRadius: '6px'
    },
}
onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
    });
});
</script>
<template>
  <NConfigProvider class="bg-[#F5F5F5] min-h-screen" :theme-overrides="themeOverrides">
    <NNotificationProvider>
      <slot></slot>
      <router-view />
    </NNotificationProvider>
  </NConfigProvider>
</template>