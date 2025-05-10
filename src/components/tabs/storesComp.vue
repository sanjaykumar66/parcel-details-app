<script setup lang="ts">
import { StoreData } from '@/types';
import detailsTable from '../stores/detailsTable.vue';
import { ref, onMounted } from 'vue';
import entryModal from '../stores/entryModal.vue';
import { db } from '../../config/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { SalesMan } from '../../types';
import { NH1, NButton } from 'naive-ui';

const title = ref<string>('');
const formData = ref<StoreData>({} as StoreData);
const isShowModal = ref<boolean>(false);
const salesMen = ref<SalesMan[]>([]);
const getSalesMenData = async () => {
    const salesMenQuery = query(collection(db, `salesmen`))
    const querySnapshot = await getDocs(salesMenQuery)
    querySnapshot.forEach((doc) => {
        salesMen.value.push({
            key: doc.id,
            ...doc.data()
        } as SalesMan)
    })
    console.log(salesMen.value)
}

const showModal = ({key, data}: {key: string, data: StoreData}) => {
    title.value = key;
    formData.value = data;
    isShowModal.value = true;
}
const showEntryModal = () => {
    title.value = 'Add Entry';
    formData.value = {} as StoreData;
    isShowModal.value = true;
}
const closeModal = () => {
    isShowModal.value = false;
    resetForm();
}
const resetForm = () => {
    formData.value = {} as StoreData;
    title.value = '';
}

onMounted(async () => {
    await getSalesMenData();
})
</script>
<template>
     <div class="p-6 overflow-hidden" style="height: calc(100% - 50px);">
         <div class="flex items-center justify-between space-x-4 mb-4">
            <NH1 class="mb-0">Store Details</NH1>
            <div class="flex items-center space-x-4">
                    <NButton @click="showEntryModal()" class="rounded-xl" size="large" type="primary">Add Entry</NButton>
            </div>    
         </div>
        <detailsTable @showModal="showModal" :salesMen="salesMen" />
     </div>
     <entryModal v-if="isShowModal" :showModal="isShowModal" :title="title" :formData="formData" @closeModal="closeModal" :salesMen="salesMen" />
</template>