<script setup lang="ts">
import { NCard, NDataTable, NDatePicker, NSelect, NDropdown, NButton } from 'naive-ui';
import type { DataTableColumns} from 'naive-ui';
import { ref, h, onMounted } from 'vue';
import dropdownIcon from '../assets/dropdown.svg'
import { ActionTypes, parcelCompanies, parcelStatus, ParcelData } from '../types'
import { query, collection, startAfter, limit, getDocs, orderBy, getCountFromServer, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
const columns:DataTableColumns<ParcelData> = [
    {
        title: 'Date',
        key: 'date',
        render(row) {
            return new Date(row.date as string | number).toLocaleDateString()
        }
    },
    {
        title: 'Order ID',
        key: 'orderId',
    },
    {
        title: 'Porter Partner',
        key: 'porterPartner',
    },
    {
        title: 'Status',
        key: 'parcelStatus',
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

const getDataFromDb = async (start:number) => {
    isDataLoading.value = true
    let parcelsQuery
    let filters = [];
    filters.push(orderBy('orderId'))
    if (parcelCompanyFilterValue.value.length > 0) {
        filters.push(where('porterPartner', 'in', parcelCompanyFilterValue.value));
    }

    if(parcelCompanyStatusValue.value.length > 0){
        filters.push(where('parcelStatus', 'in', parcelCompanyStatusValue.value))
    }

    if(dateRange.value){
        filters.push(where('date', '>=', dateRange.value[0]))
        filters.push(where('date', '<=', dateRange.value[1]))
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
                ...(parcelCompanyFilterValue.value.length > 0 ? [where('porterPartner', 'in', parcelCompanyFilterValue.value)] : []), 
                ...(parcelCompanyStatusValue.value.length > 0 ? [where('parcelStatus', 'in', parcelCompanyStatusValue.value)] : []),
                ...(dateRange.value ? [where('date', '>=', dateRange.value[0]), where('date', '<=', dateRange.value[1])] : [])
            )
    const snapshot  = await getCountFromServer(parcelsCollection)
    const totalDocuments = snapshot.data().count;
    totalPage.value = Math.ceil(totalDocuments / 30);
    currentPage.value = 1
    getDataFromDb(1)
}
onMounted(async () => {
    getDataFromDb(1)
    getInitialPageCount()
})

</script>
<template>
    <NCard :style="{height: 'calc(100% - 100px)'}" class="overflow-hidden">
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
        />
        <div
            :page-count="totalPage"
            :page-size="30"
            :current-page="currentPage"
            class="mt-4 flex justify-end space-x-4"
            @update:page="getDataFromDb"
        >
            <NButton :disabled="currentPage>1?false:true" @click="getDataFromDb(currentPage-1)" size="medium" type="default" class="rounded-lg">Prev</NButton>
            <NButton :disabled="currentPage < totalPage?false:true" @click="getDataFromDb(currentPage+1)" size="medium" type="default" class="rounded-lg">Next</NButton>
        </div>
    </NCard>
</template>
<style>
.n-data-table__pagination{
    padding: 16px;
}
</style>