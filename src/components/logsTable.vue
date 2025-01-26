<script setup lang="ts">
import { NCard, NDataTable, NDatePicker, NSelect, NDropdown, NButton, NTag, NModal } from 'naive-ui';
import type { DataTableColumns} from 'naive-ui';
import { ref, h, onMounted, watch } from 'vue';
import dropdownIcon from '../assets/dropdown.svg'
import { ActionTypes, parcelCompanies, parcelStatus, ParcelData } from '../types'
import { query, collection, startAfter, limit, getDocs, orderBy, getCountFromServer, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
const columns:DataTableColumns<ParcelData> = [
    {
        type:'selection',
    },
    {
        title: 'Invoice Date',
        key: 'invoiceDate',
        render(row) {
            return new Date(row.invoiceDate as string).toLocaleDateString()
        }
    },
    {
        title: 'Store Code',
        key: 'storeCode',
    },
    {
        title: 'Invoice Number',
        key: 'invoiceNumber',
    },
    {
        title: 'Cases',
        key: 'cases',
    },
    {
        title:'Dispatch Date',
        key: 'despatchDate',
        render(row) {
            return row.despatchDate ? new Date(row.despatchDate as string).toLocaleDateString() : '-'
        }
    },
    {
        title: 'Transporter',
        key: 'transporter',
    },
    {
        title: 'Status',
        key: 'status',
    },
    {
        title: 'Tracking ID',
        key: 'trackingId',
    },
    {
        title: 'Action',
        key: 'action',
        width: '80px',
        render(row) {
            return h(NDropdown, {
                    trigger: 'click',
                    options: [
                        { key:ActionTypes.EDIT,label: 'Edit Details' },
                        { key:ActionTypes.DELETE , label: 'Delete' },
                    ],
                    onSelect: (key: string | number) => {
                                if(key === ActionTypes.EDIT){
                                    emits('showModal',{key: key, data: row})
                                }
                                else if(key === ActionTypes.DELETE){
                                    selectedKeys.value = [row.key as string]
                                    showDeleteModal.value = true
                                }
                            }
                }, 
                {
                    default:() => [
                        h(dropdownIcon, { class: 'h-4 cursor-pointer hover:text-blue-500'}),
                    ]
                }    
            )
        }
    }
] 
const props = defineProps({
    formData: {
        type: Object as () => ParcelData,
        default: () => ({})
    }
})

const parcelData = ref<ParcelData[]>([])
const dateRange = ref<[number, number] | null>(null)
const parcelCompanyFilterValue = ref<string[]>([])
const parcelCompanyStatusValue = ref<string[]>([])
const currentPage = ref<number>(1)
const totalPage = ref<number>(100)
const isDataLoading = ref<boolean>(false)
const emits = defineEmits(['showModal'])
const lastVisible = ref<any>(null)
let queryCursor:any = {}
const showDeleteModal = ref<boolean>(false)
// const buttonOverrideClass = ref<any>({
//     class:'text-white mt-2'
// })
const selectedKeys = ref<Array<string | number>>([])

const getDataFromDb = async (start:number) => {
    isDataLoading.value = true
    let parcelsQuery
    let filters = [];
    filters.push(orderBy('invoiceDate','desc'))
    if (parcelCompanyFilterValue.value.length > 0) {
        filters.push(where('transporter', 'in', parcelCompanyFilterValue.value));
    }

    if(parcelCompanyStatusValue.value.length > 0){
        filters.push(where('status', 'in', parcelCompanyStatusValue.value))
    }

    if(dateRange.value){
        filters.push(where('invoiceDate', '>=', new Date(dateRange.value[0]).toISOString()))
        filters.push(where('invoiceDate', '<=', new Date(dateRange.value[1]).toISOString()))
    }

    if(queryCursor[start-1]){
        filters.push(startAfter(queryCursor[start-1]))
    }

    filters.push(limit(30))
    parcelsQuery =  query(
            collection(db, `users/${auth.currentUser?.uid}/parcels`), 
            ...filters,
            )
    const querySnapshot = await getDocs(parcelsQuery);
    lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
    queryCursor[start] = lastVisible.value
    parcelData.value = []
    querySnapshot.forEach((doc) => {
        parcelData.value.push({
            key: doc.id,
            ...doc.data()
        } as ParcelData)
    });
    currentPage.value = start
    isDataLoading.value = false
}
const companyFilter = async(value:string[]) => {
    queryCursor = {}
    parcelCompanyFilterValue.value = value
    getPageCountForFilters()
}
const statusFilter = async(value:string[]) => {
    queryCursor = {}
    parcelCompanyStatusValue.value = value
    getPageCountForFilters()
}
const dateFilter = async(value: [number, number] | null)=>{
    queryCursor = {}
    dateRange.value = value
    getPageCountForFilters()
}
const getInitialPageCount = async() => {
    const parcelsCollection = collection(db, `users/${auth.currentUser?.uid}/parcels`)
    const snapshot  = await getCountFromServer(parcelsCollection)
    const totalDocuments = snapshot.data().count;
    totalPage.value = Math.ceil(totalDocuments / 30);
    currentPage.value = 1
}
const getPageCountForFilters = async() =>{
    if(parcelCompanyStatusValue.value.length === 0 && parcelCompanyFilterValue.value.length === 0 && dateRange.value === null){
        getDataFromDb(1)
        getInitialPageCount()
        return
    }
    const parcelsCollection = query(
                collection(db, `users/${auth.currentUser?.uid}/parcels`), 
                orderBy('invoiceDate','desc'),
                ...(parcelCompanyFilterValue.value.length > 0 ? [where('transporter', 'in', parcelCompanyFilterValue.value)] : []), 
                ...(parcelCompanyStatusValue.value.length > 0 ? [where('status', 'in', parcelCompanyStatusValue.value)] : []),
                ...(dateRange.value ? [where('invoiceDate', '>=', new Date(dateRange.value[0]).toISOString()), where('invoiceDate', '<=', new Date(dateRange.value[1]).toISOString())] : [])
            )
    const snapshot  = await getCountFromServer(parcelsCollection)
    const totalDocuments = snapshot.data().count;
    totalPage.value = Math.ceil(totalDocuments / 30);
    currentPage.value = 1
    getDataFromDb(1)
}
const handleCheck = (keys: Array<string | number>) => {
    selectedKeys.value = keys
}
const deleteData = async() => {
    showDeleteModal.value = false
    try {
        isDataLoading.value = true
        await Promise.all(
            selectedKeys.value.map(async (key) => {
                await deleteDoc(doc(db, `users/${auth.currentUser?.uid}/parcels/${key}`));
            })
        );
        await getPageCountForFilters();
        isDataLoading.value = false
        selectedKeys.value = []
    } catch (error) {
        console.error("Error deleting documents:", error);
    }
}
const removeSelectedItems = () => {
    selectedKeys.value = []
    showDeleteModal.value = false
}
onMounted(async () => {
    getDataFromDb(1)
    getInitialPageCount()
})

watch( () => props.formData, (newVal:ParcelData) => {
    if(newVal.key){
       parcelData.value = parcelData.value.map((data) => {
            if(data.key === newVal.key){
                return newVal
            }
            return data
        })
    }
}, {deep: true})
</script>
<template>
    <div :style="{height: 'calc(100% - 100px)'}" > 
        <NCard class="h-full relative overflow-hidden">
            <div class="py-5 grid grid-flow-col grid-cols-3 items-center gap-4">
                <NDatePicker @confirm="dateFilter" @clear="dateFilter(null)"  :value="dateRange" type="daterange" clearable></NDatePicker>
                <NSelect max-tag-count="responsive" @update-value="companyFilter" :value="parcelCompanyFilterValue" :options="parcelCompanies" multiple clearable placeholder="Filter by Parcel Company"></NSelect>
                <NSelect max-tag-count="responsive" @update-value="statusFilter" :value="parcelCompanyStatusValue" :options="parcelStatus" multiple clearable placeholder="Filter by Parcel Status"></NSelect>
            </div>
            <NDataTable
                :columns="columns"
                :data="parcelData"
                :bordered="true"
                :pagination="false"
                :style="{height:'calc(100% - 120px)', background:'#fff' }"
                flex-height
                virtual-scroll
                :loading="isDataLoading"
                @update:checked-row-keys="handleCheck"
                :checked-row-keys="selectedKeys"
                />
            <div
                :page-count="totalPage"
                :page-size="30"
                :current-page="currentPage"
                class="mt-4 flex justify-end space-x-4 relative"
                @update:page="getDataFromDb"
            >
                <NButton :disabled="currentPage>1?false:true" @click="getDataFromDb(currentPage-1)" size="medium" type="default" class="rounded-lg">Prev</NButton>
                <NButton :disabled="currentPage < totalPage?false:true" @click="getDataFromDb(currentPage+1)" size="medium" type="default" class="rounded-lg">Next</NButton>
                <div v-if="selectedKeys.length>0" class="px-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  h-12 shadow-xl bg-[#2a2a2a] w-fit rounded-lg flex items-center">
                    <NTag @close="removeSelectedItems" class="rounded-lg bg-transparent text-gray-300 tag-close" closable>{{ selectedKeys.length }} selected</NTag>
                    <div class="flex justify-end items-center ml-2">
                        <!-- <NPopconfirm raw class="bg-[#2a2a2a] p-4 rounded-lg" arrow-class="!bg-[#2a2a2a]" :show-icon="false" content-class="bg-[#2a2a2a]" trigger="click" :negative-button-props="buttonOverrideClass" :positive-button-props="buttonOverrideClass"> 
                                <template #trigger>
                                    <div class="text-gray-200 flex items-center cursor-pointer p-2 gap-1">
                                        <svg fill="#ffffff95" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g data-name="Layer 2">
                                                <g data-name="calendar">
                                                    <rect width="24" height="24" opacity="0"/>
                                                    <path d="M18 4h-1V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM6 6h1v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h1a1 1 0 0 1 1 1v4H5V7a1 1 0 0 1 1-1zm12 14H6a1 1 0 0 1-1-1v-6h14v6a1 1 0 0 1-1 1z"/>
                                                    <circle cx="8" cy="16" r="1"/>
                                                    <path d="M16 15h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z"/>
                                                </g>
                                            </g>
                                        </svg>
                                        Dispatch Date
                                    </div>
                                </template>
                                <template #default>
                                    <div class="flex flex-col gap-2">
                                        <span class="text-white">Select Dispatch Date</span>
                                        <NDatePicker type="date" clearable></NDatePicker>
                                    </div>
                                </template>
                        </NPopconfirm> -->
                        <div @click="showDeleteModal=true" class="rounded-lg border-none cursor-pointer p-2 hover:bg-white">
                            <svg fill="red" class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g data-name="Layer 2">
                                    <g data-name="trash-2">
                                        <rect width="24" height="24" opacity="0"/>
                                        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z"/>
                                        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/>
                                        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </NCard>
        <NModal
            :show="showDeleteModal"
            preset="dialog"
            title="Confirm Delete"
            content="Are you sure to delete?"
            positive-text="Submit"
            negative-text="Cancel"
            @positive-click="deleteData"
            @negative-click="removeSelectedItems"
            @close="removeSelectedItems"
        >
        </NModal>
    </div>
</template>
<style>
.n-data-table__pagination{
    padding: 16px;
}
.tag-close .n-base-icon{
    background-color: transparent;
    color: white
}
</style>