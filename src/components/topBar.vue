<script setup lang="ts">
import { NCard, NPopover, NAvatar, NButton } from 'naive-ui';
import { auth } from '../config/firebaseConfig'

const kickOut = () => {
    auth.signOut()
}
</script>
<template>  
    <NCard class="shadow-lg" content-class="!py-3 flex justify-between items-center">
            <img
                class="h-6 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
            />
            
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