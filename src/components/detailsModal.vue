<script setup lang="ts">
import { NModal, NH2, NForm, NFormItem, NDatePicker, NInput, NSelect, NButton, useNotification } from 'naive-ui';
import { onMounted, ref } from 'vue';
import type { FormInst } from 'naive-ui'
import {parcelCompanies, parcelStatus, parcelStatusEnum, ParcelData, ActionTypes} from '../types'
import { db, auth } from '../config/firebaseConfig';
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
    date: new Date().getTime(),
    orderId:'',
    porterPartner: '',
    parcelStatus: parcelStatusEnum.PENDING
})
const formError = ref<string>('');
const isLoading = ref<boolean>(false);
const notification = useNotification();
const rules = {
    orderId: {
        required: true,
        message: "Please enter the order id",
        trigger: "blur",
    },
    porterPartner: {
        required: true,
        message: "Please select the porter partner",
        trigger: "blur",
    },
    parcelStatusValue: {
        required: true,
        message: "Please select the parcel status",
        trigger: "blur",
    },
};
const emit = defineEmits(['closeModal'])
const handleValidateClick = async (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            isLoading.value = true;
            const type = props.title === 'Add Entry' ? ActionTypes.ADD : ActionTypes.EDIT;
            if(type === ActionTypes.ADD){
                addDoc(collection(db, `users/${auth.currentUser?.uid}/parcels`), formValue.value).then(() => {
                    emit('closeModal', false)
                    notification.success({
                        title: 'Success',
                        content: 'Parcel details added successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                });
            }
            else{
                updateDoc(doc(db, `users/${auth.currentUser?.uid}/parcels/${formValue.value.key}`), formValue.value).then(() => {
                    emit('closeModal', false)
                    notification.success({
                        title: 'Success',
                        content: 'Parcel details updated successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
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
                <NFormItem label="Order ID" path="orderId">
                    <NInput v-model:value="formValue.orderId" placeholder="Enter OrderId"/>
                </NFormItem>
                <NFormItem label="Porter Partner" path="porterPartner">
                    <NSelect v-model:value="formValue.porterPartner" :options="parcelCompanies" placeholder="Select Porter Partner"/>
                </NFormItem>
                
                <NFormItem label="Dispatch Date" path="date">
                    <NDatePicker 
                        v-model:value="formValue.date" 
                        type="date"
                        placeholder="Select Date"
                        class="w-full"
                    />
                </NFormItem>
                <NFormItem label="Parcel Status" path="parcelStatus">
                    <NSelect v-model:value="formValue.parcelStatus" :options="parcelStatus" placeholder="Select parcel Status"/>
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