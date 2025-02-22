<script setup lang="ts">
import { NDataTable, NCard } from 'naive-ui';
import type { DataTableColumns} from 'naive-ui';
import { ref, onMounted } from 'vue';
import { StoreData, SalesMan } from '../../types';
// import dropdownIcon from '../../assets/dropdown.svg';
import { query, collection, limit, getDocs, orderBy, getCountFromServer, startAfter, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import filtersSection from './filtersSection.vue';
import paginationSection from './paginationSection.vue';
const emits = defineEmits(['showModal'])
const selectedKeys = ref<Array<string | number>>([])
// const showDeleteModal = ref<boolean>(false)
const isDataLoading = ref<boolean>(false)
const storeData = ref<StoreData[]>([])
const lastVisible = ref<any>(null)
let queryCursor:any = {}
const currentPage = ref<number>(1)
const salesMen = ref<SalesMan[]>([])
const totalPage = ref<number>(100)
const salesManFilter = ref<string[]>([])
const searchFilter = ref<string>('')
const columns:DataTableColumns<StoreData> = [
    {
        type:'selection',
        fixed: 'left',
    },
    {
        title: 'Alternate Code',
        key: 'alternatecode',
        fixed: 'left',
        width: 100,
    },
    {
        title: 'code',
        key: 'code',
        fixed: 'left',
        width: 100,
    },
    {
        title: 'Name',
        key: 'name',
        fixed: 'left',
        width: 300,
    },
   
    {
        title: 'GSTNo',
        key: 'gstNo',
        width: 300,
    },
    {
        title: 'Email',
        key: 'email',
        width: 300,
    },
    {
        title: 'Mobile',
        key: 'mobile',
        width: 300,
    },
    {
        title: 'Phone 1',
        key: 'phone1',
        width: 300,
    },
    {
        title: 'Phone 2',
        key: 'phone2',
        width: 300,
    },
    {
        title: 'Sales Man',
        key: 'salesMan',
        width: 300,
    },   
    {
        title: 'Area',
        key: 'area',
        width: 300,
    },
    {
        title: 'Area Name',
        key: 'areaName',
        width: 300,
    },
    {
        title: 'Location',
        key: 'location',
        width: 300,
    },
    {
        title: 'Place',
        key: 'place',
        width: 300,
    },
    {
        title: 'Street',
        key: 'street',
        width: 300,
    },
    {
        title: 'State',
        key: 'state',
        width: 300,
    }, 
    {
        title: 'Address',
        key: 'address',
        width: 300,
    },
    {
        title: 'Web Password',
        key:'webPassword',
        width: 300,
    },
    {
        title: 'Allow Bill',
        key: 'allowBill',
        width: 300,
    },
    {
      title: 'Credit Days',  
      key: 'creditDays',
      width: 300,
    },
    {
        title: 'Credit Limit',
        key: 'creditLimit',
        width: 300,
    },
    {
        title: 'Customer Category',
        key: 'custCategory',
        width: 300,
    },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     width: '80px',
    //     fixed: 'right',
    //     render(row) {
    //         return h(NDropdown, {
    //                 trigger: 'click',
    //                 options: [
    //                     { key:ActionTypes.EDIT,label: 'Edit Details' },
    //                     { key:ActionTypes.DELETE , label: 'Delete' },
    //                 ],
    //                 onSelect: (key: string | number) => {
    //                             if(key === ActionTypes.EDIT){
    //                                 emits('showModal',{key: key, data: row})
    //                             }
    //                             else if(key === ActionTypes.DELETE){
    //                                 selectedKeys.value = [row.key as string]
    //                                 showDeleteModal.value = true
    //                             }
    //                         }
    //             }, 
    //             {
    //                 default:() => [
    //                     h(dropdownIcon, { class: 'h-4 cursor-pointer hover:text-blue-500'}),
    //                 ]
    //             }    
    //         )
    //     }
    // }
] 

const handleCheck = (keys:Array<string | number>) => {
    selectedKeys.value = keys
}

const getDataFromDb = async (start:number) => {
    isDataLoading.value = true
    let parcelsQuery
    let filters = [];
    filters.push(orderBy('code','asc'))
    if(searchFilter.value.length > 0){
        console.log(searchFilter.value)
        filters.push(where('name', '>=', searchFilter.value), where('name', '<=', searchFilter.value + '\uFFFF'))
    }
    if(salesManFilter.value.length > 0){
        filters.push(where('salesMan', 'in', salesManFilter.value))
    }
    if(queryCursor[start-1]){
        filters.push(startAfter(queryCursor[start-1]))
    }
    filters.push(limit(30))
    parcelsQuery =  query(
            collection(db, `stores`), 
            ...filters,
            )
    const querySnapshot = await getDocs(parcelsQuery);
    lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
    queryCursor[start] = lastVisible.value
    storeData.value = []
    querySnapshot.forEach((doc) => {
        storeData.value.push({
            key: doc.id,
            ...doc.data()
        } as StoreData)
    });
    currentPage.value = start
    isDataLoading.value = false
}

const getInitialPageCount = async() => {
    const storesCollection = collection(db, `stores`)
    const snapshot  = await getCountFromServer(storesCollection)
    const totalDocuments = snapshot.data().count;
    totalPage.value = Math.ceil(totalDocuments / 30);
    currentPage.value = 1
}

onMounted(async () => {
    getDataFromDb(1)
    getSalesMenData()
    getInitialPageCount()
})

const getSalesMenData = async () => {
    const salesMenQuery = query(collection(db, `salesmen`))
    const querySnapshot = await getDocs(salesMenQuery)
    querySnapshot.forEach((doc) => {
        salesMen.value.push({
            key: doc.id,
            ...doc.data()
        } as SalesMan)
    })
}

const handleSalesManFilter = (selectedValue:string[]) => {
    queryCursor = {}
    salesManFilter.value = salesMen.value.filter((salesMan) => selectedValue.includes(salesMan.key || '')).map((salesMan) => salesMan.name)
    getPageCountForFilters()
}

const getPageCountForFilters = async() =>{
    if(salesManFilter.value.length === 0 && searchFilter.value.length === 0){
        getDataFromDb(1)
        getInitialPageCount()
        return
    }
    const storesCollection = query(
        collection(db, `stores`), 
        orderBy('code','asc'),
        ...(salesManFilter.value.length > 0 ? [where('salesMan', 'in', salesManFilter.value)] : []),
        ...(searchFilter.value.length > 0 ? [where('name', '>=', searchFilter.value), where('name', '<=', searchFilter.value + '\uFFFF')] : [])
    )
    const snapshot  = await getCountFromServer(storesCollection)
    const totalDocuments = snapshot.data().count;
    totalPage.value = Math.ceil(totalDocuments / 30);
    currentPage.value = 1
    getDataFromDb(1)
}

const handleSearch = (searchValue:string) => {
    queryCursor = {}
    searchFilter.value = searchValue
    getPageCountForFilters()
}

</script>

<template>
    <div class="h-full">
        <NCard class="h-full w-full relative overflow-hidden">
            <filtersSection v-if="salesMen.length>0" @update:search="handleSearch" :salesMen="salesMen" @update:salesMan="handleSalesManFilter" />
            <NDataTable
                :columns="columns"
                :data="storeData"
                :bordered="true"
                :pagination="false"
                :style="{height:'calc(100% - 120px)', background:'#fff' }"
                flex-height
                virtual-scroll
                :loading="isDataLoading"
                @update:checked-row-keys="handleCheck"
                :checked-row-keys="selectedKeys"
                :scroll-x="100"
                />
            <paginationSection :currentPage="currentPage" :totalPage="totalPage" @update:currentPage="getDataFromDb" />
        </NCard>
    </div>
</template>