<script setup lang="ts">
import { NModal, NH2, NForm, NFormItem, NDatePicker, NInput, NSelect, NButton, useNotification, NInputNumber, FormRules } from 'naive-ui';
import { onMounted, ref } from 'vue';
import type { FormInst } from 'naive-ui'
import {parcelCompanies, parcelStatus, parcelStatusEnum, ParcelData, ActionTypes} from '../../types'
import { db } from '../../config/firebaseConfig';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    formData: {
        type: Object as () => ParcelData,
        default: () => ({})
    }
})
const formRef = ref<FormInst | null>(null);
const formValue = ref<ParcelData>({
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
const formError = ref<string>('');
const isLoading = ref<boolean>(false);
const notification = useNotification();
const rules:FormRules = {
    storeCode: {
        required: true,
        message: "Please enter the store code",
        trigger: "blur",
    },
    invoiceNumber: {
        required: true,
        message: "Please enter the invoice number",
        trigger: "blur",
    },
    invoiceDate: {
        required: true,
        message: "Please select the invoice date",
        trigger: ['blur', 'change'],
    },
    despatchDate: {
        message: "Please select the despatch date",
        trigger: "blur",
        required: false
    },
    cases: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: "Please enter total number of cases",
    },
    transporter:{
        required: true,
        message: "Please select the transporter",
        trigger: "blur",
    },
    status:{
        required: true,
        message: "Please select the status",
        trigger: "blur",
    }
};
const emit = defineEmits(['closeModal', 'updateTable'])
const handleValidateClick = async (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            isLoading.value = true;
            const type = props.title === 'Add Entry' ? ActionTypes.ADD : ActionTypes.EDIT;
            if(type === ActionTypes.ADD){
                addDoc(collection(db, `parcels`), formValue.value).then(() => {
                    emit('closeModal', false)
                    notification.success({
                        title: 'Success',
                        content: 'Parcel details added successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                    emit('updateTable')
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                });
                
            }
            else{
                updateDoc(doc(db, `parcels/${formValue.value.key}`), formValue.value).then(() => {
                    emit('closeModal', formValue.value)
                    notification.success({
                        title: 'Success',
                        content: 'Parcel details updated successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                    emit('updateTable')
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        } 
        else {
            console.log(errors);
            formError.value = '';
        }
    });
};
onMounted(() => {
   if(props.formData){
       formValue.value = props.formData
       formValue.value = {
        ...formValue.value,
        cases: formValue.value.cases ? parseInt(formValue.value.cases as unknown as string) : null,
       }
   }
})
</script>
<template>
    <NModal
        :show="showModal"
        :mask-closable="false"
         preset="card"
         class="max-w-[500px]"
        @close="() => $emit('closeModal', false)"
    >
        <template #header>
            <NH2 class="mb-0">{{ title }}</NH2>
        </template>
        <template #default>
            <NForm
                showRequireMark
                size="large"
                ref="formRef"
                :rules="rules"
                :model="formValue"
            >
                <NFormItem label="Store Code" path="storeCode">
                    <NInput v-model:value="formValue.storeCode" placeholder="Enter Store Coder"/>
                </NFormItem>
                <NFormItem label="Invoice Number" path="invoiceNumber">
                    <NInput v-model:value="formValue.invoiceNumber" placeholder="Enter Invoice Number"/>
                </NFormItem>
                <NFormItem label="Transporter" path="transporter">
                    <NSelect v-model:value="formValue.transporter" :options="parcelCompanies" placeholder="Select transporter"/>
                </NFormItem>
                
                <NFormItem label="Invoice Date" path="invoiceDate">
                    <NDatePicker 
                        :value="formValue.invoiceDate ? new Date(formValue.invoiceDate as string) : formData.invoiceDate" 
                        type="date"
                        placeholder="Select Date"
                        class="w-full"
                        @update:value="val => formValue.invoiceDate = val ? new Date(val).toISOString(): null"
                        clearable
                    />
                </NFormItem>
                <NFormItem label="Dispatch Date" path="despatchDate">
                    <NDatePicker 
                        :value="formValue.despatchDate? new Date(formValue.despatchDate as string) : formData.despatchDate" 
                        type="date"
                        placeholder="Select Date"
                        class="w-full"
                        @update:value="val => formValue.despatchDate = val? new Date(val).toISOString(): null"
                        clearable
                    />
                </NFormItem>
                <NFormItem label="Cases" path="cases">
                    <NInputNumber :value="formValue.cases as number" @update:value="val => formValue.cases = val" placeholder="Enter Cases" class="w-full"/>
                </NFormItem>
                <NFormItem label="Parcel Status" path="status">
                    <NSelect v-model:value="formValue.status" :options="parcelStatus" placeholder="Select Status"/>
                </NFormItem>
                <NFormItem label="Tracking ID" path="trackingId">
                    <NInput v-model:value="formValue.trackingId" placeholder="Enter tracking Id"/>
                </NFormItem>
                <NFormItem class="!grid-rows-[minmax(0,auto)_1fr]" :feedback="formError" validation-status="error">
                    <NButton
                        @click="handleValidateClick"
                        type="primary"
                        size="large"
                        class="rounded-md flex-1"
                        :loading="isLoading"
                        >Submit
                    </NButton>
                </NFormItem>
            </NForm>
        </template>
    </NModal>
</template>