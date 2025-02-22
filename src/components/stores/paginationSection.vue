<script setup lang="ts">
import { NButton } from 'naive-ui';
import { defineProps } from 'vue';
defineProps<{
    currentPage: number
    totalPage: number
}>()
const emit = defineEmits(['update:currentPage'])
</script>
<template>
    <div class="mt-4 flex justify-end space-x-4 relative">
        <NButton :disabled="currentPage>1?false:true" @click="emit('update:currentPage', currentPage-1)" size="medium" type="default" class="rounded-lg">Prev</NButton>
        <NButton :disabled="currentPage < totalPage?false:true" @click="emit('update:currentPage', currentPage+1)" size="medium" type="default" class="rounded-lg">Next</NButton>
    </div>
</template>