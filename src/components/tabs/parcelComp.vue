<script setup lang="ts">
import { NButton, NH1 } from 'naive-ui';
import logsTable from '../parcel/logsTable.vue';
import { ParcelData, parcelStatusEnum } from '../../types';
// import { parseCSV } from '../../utils';
import { ref } from 'vue';
import detailsModal from '../parcel/detailsModal.vue';
// import previewModal from '../previewModal.vue';
// import { db } from '../../config/firebaseConfig';
// import { collection, addDoc } from 'firebase/firestore';
const showModal = ref<boolean>(false)
const title = ref<string>('Add Entry')
const isTableUpdated = ref<boolean>(false)
const parcelData = ref<ParcelData>({
        storeCode: '',
        invoiceNumber: '',
        invoiceDate: null,
        despatchDate: null,
        cases: null,
        labels:[],
        transporter:'',
        status:parcelStatusEnum.PENDING,
        trackingId: null
})
// const isShowPreviewModal = ref<boolean>(false)
// const parseData = ref<ParcelData[]>([])
// const notification = useNotification()

const showEntryModal = (data?:{key?:string,data?:ParcelData}) => {
    showModal.value = true
    isTableUpdated.value = false
    title.value = data?.key === 'EDIT' ? 'Edit Entry' : 'Add Entry'
    if(data?.data){
        parcelData.value = data.data
    }
    else{
        parcelData.value = {
            storeCode: '',
            invoiceNumber: '',
            invoiceDate: null,
            despatchDate: null,
            cases: null,
            labels:[],
            transporter:'',
            status:parcelStatusEnum.PENDING,
            trackingId: null
        }
    }
}


// const onUploadFile = (options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) => {
//     const reader = new FileReader()
//     reader.onload = async (e) => {
//       const contents = e.target?.result as string
//       const data = await parseCSV(contents)
//       parseData.value = data as unknown as ParcelData[]
//       isShowPreviewModal.value = true
//     }
//     if (options.file.file) {
//         reader.readAsText(options.file.file)
//     }
// }

// const uploadParsedData = () => {
//     parseData.value.forEach((data) => {
//         addDoc(collection(db, `parcels`), {
//             ...data,
//           //  date: timestamp
//         }).then(() => {
//             console.log('data uploaded')
//         })
//     })
//     isShowPreviewModal.value = false
//     notification.success({
//         title: 'Success',
//         content: 'CSV data uploaded successfully',
//         duration: 2500,
//         keepAliveOnHover: true
//     })
// }

const updateParcelData = (data:ParcelData) =>{
    parcelData.value.invoiceNumber = data.invoiceNumber || '';
    parcelData.value.invoiceDate = data.invoiceDate || null;
    parcelData.value.despatchDate = data.despatchDate || null;
    parcelData.value.cases = data.cases || null;
    parcelData.value.labels = data.labels || [];
    parcelData.value.transporter = data.transporter || '';
    parcelData.value.status = data.status || parcelStatusEnum.PENDING;
    parcelData.value.trackingId = data.trackingId || null;
    showModal.value = false
}

const updateLogsTable = () =>{
    isTableUpdated.value = true
}

</script>

<template>
     <div class="p-6 overflow-hidden" style="height: calc(100% - 50px);">
            <div class="flex items-center justify-between space-x-4 mb-4">
                <NH1 class="mb-0">Parcel Details</NH1>
                <div class="flex items-center space-x-4">
                    <!-- <NUpload @change="onUploadFile" :show-file-list="false" :accept="'.csv'">
                        <NButton class="rounded-xl bg-white" size="large" type="default">Upload Sheet</NButton>
                    </NUpload> -->
                    <NButton @click="showEntryModal()" class="rounded-xl" size="large" type="primary">Add Entry</NButton>
                </div>
                
            </div>
            <logsTable :updateTable="isTableUpdated" :formData="parcelData" :showModal="showEntryModal" @show-modal="showEntryModal" />
            <detailsModal @updateTable="updateLogsTable" v-if="showModal" :showModal="showModal" :title="title" :formData="parcelData" @closeModal="updateParcelData"/>
            <!-- <previewModal v-if="isShowPreviewModal" :show-modal="isShowPreviewModal" :parse-data="parseData" @closeModal="isShowPreviewModal=false" @uploadData="uploadParsedData" /> -->
     </div>
</template>