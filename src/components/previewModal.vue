<script setup lang="ts">
import { NModal, NH2, NButton } from 'naive-ui';
import { ParcelData } from '../types';
import { ref } from 'vue';
defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    parseData: {
        type: Array as () => ParcelData[],
        default: () => ({})
    }
})
const isLoading = ref<boolean>(false)
</script>
<template>
    <NModal
        :show="showModal"
        :mask-closable="false"
        preset="card"
        class="max-w-[600px]"
        @close="() => $emit('closeModal', false)"
    >
        <template #header>
            <NH2 class="mb-0">Preview Modal</NH2>
        </template>
        <template #default>
            <div class="p-4 max-h-[500px] overflow-y-auto">
                <div v-for="data in parseData" :key="data.invoiceNumber" :class="['flex items-center justify-between border-b border-gray-200 py-2']">
                    <div>{{ data.storeCode }}</div>
                    <div>{{ data.invoiceNumber }}</div>
                    <div>{{ data.invoiceDate }}</div>
                    <div>{{ data.despatchDate }}</div>
                    <div>{{ data.cases }}</div>
                    <div>{{ data.labels }}</div>
                    <div>{{ data.transporter }}</div>
                    <div>{{ data.status }}</div>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-red-600 mb-1">Review the data and upload it</p>
                <NButton
                    type="primary"
                    class="w-full"
                    @click="() => {
                        $emit('uploadData', false);
                        isLoading = true;
                    }"
                    :loading="isLoading"
                >Upload
                </NButton>
            </div>
        </template>
    </NModal>
</template>