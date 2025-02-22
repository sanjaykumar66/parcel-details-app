<script setup lang="ts">
import { NCard, NPopover, NAvatar, NButton } from 'naive-ui';
import { auth } from '../config/firebaseConfig'
import Logo from '../assets/logo.webp'
import { ref } from 'vue';
import { topBarTabs } from '../types';
const kickOut = () => {
    auth.signOut()
}
const selectedTab = ref<topBarTabs>(topBarTabs.STORE)
const emit = defineEmits(['tabSwitch'])
const tabSwitch = (tab:topBarTabs) => {
    selectedTab.value = tab
    emit('tabSwitch', tab)
}
</script>
<template>  
    <NCard class="shadow-lg" content-class="!py-3 flex justify-between items-center">
            <img
                class="h-8 w-auto"
                :src="Logo"
                alt="Your Company"
            />
            <div class="flex items-center gap-4">
                <div :class="selectedTab === topBarTabs.PARCEL ? 'border-solid border-b-2 border-sky-900' : ''">
                        <NButton @click="tabSwitch(topBarTabs.PARCEL)" quaternary>
                            <span class="font-bold">PARCEL</span>
                        </NButton>
                </div>
                <div :class="selectedTab === topBarTabs.STORE ? 'border-solid border-b-2 border-sky-900' : ''">
                    <NButton @click="tabSwitch(topBarTabs.STORE)" quaternary>
                        <span class="font-bold">STORES</span>
                    </NButton>
                </div>
            </div>
            <NPopover>
                <template #trigger>
                    <div class="flex items-center cursor-pointer">
                        <NAvatar round  size="medium">{{ auth?.currentUser?.email?.slice(0,2).toUpperCase() }}</NAvatar>
                    </div>
                </template>
                <div>
                    <NButton @click="kickOut" quaternary type="default">Logout</NButton>
                </div>
            </NPopover>
    </NCard>
</template>