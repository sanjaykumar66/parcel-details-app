<script setup lang="ts">
import { NSelect } from 'naive-ui';
import { ref, defineProps, onMounted } from 'vue';
import { SalesMan } from '../../types';
// import { debounce } from '../../utils';
const props = defineProps<{
    salesMen: SalesMan[]
}>()
const salesMen = ref<Array<{label:string,value:string}>>([])

onMounted(() => {
    salesMen.value = props.salesMen.map((salesMan) => ({
        label: salesMan.name,
        value: salesMan.key || ''
    }))
    console.log(salesMen.value)
})

const emit = defineEmits(['update:salesMan','update:search'])

// const handleSearch = debounce((val:string) => {
//     const searchTerm = val.trim();
//     if(searchTerm.length > 0){
//         emit('update:search',searchTerm)
//     }
// }, 1000)
</script>
<template>
     <div class="py-5 grid grid-flow-col grid-cols-3 items-center gap-4">
        <!-- <NInput @update:value="val=>handleSearch(val)" placeholder="Search by Name"></NInput>    -->
        <NSelect @update:value="val=>emit('update:salesMan',val)" max-tag-count="responsive" :options="salesMen" multiple clearable placeholder="Filter by Sales Man" ></NSelect>
    </div>
</template>