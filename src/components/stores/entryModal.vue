<script setup lang="ts">
import { NModal, NH2, NForm, NFormItem, NInput, NButton, FormRules, NInputNumber, NSwitch,useNotification, NSelect } from 'naive-ui';
import type { FormInst } from 'naive-ui'
import { StoreData, SalesMan } from '../../types';
import { ActionTypes } from '../../types';
import { ref } from 'vue';
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
        type: Object as () => StoreData,
        default: () => ({})
    },
    salesMen: {
        type: Array as () => SalesMan[],
        required: true
    }
})
const rules:FormRules = {
    address: {
        type: 'string',
        message: "Please enter the address",
        trigger: "blur",
    },
    allowBill: {
        type: 'boolean',
        message: "Please enter the allow bill",
        trigger: "blur",
    },
    alternatecode: {
        type: 'number',
        message: "Please enter the alternate code",
        trigger: "blur",
    },
    area: {
        type: 'number',
        message: "Please enter the area",
        trigger: "blur",
    },
    areaName: {
        type: 'string',
        message: "Please enter the area name",
        trigger: "blur",
    },
    code: {
        type: 'number',
        required: true,
        message: "Please enter the code",
        trigger: "blur",
    },
    creditDays: {
        type: 'string',
        message: "Please enter the credit days",
        trigger: "blur",
    },
    creditLimit: {
        type: 'string',
        message: "Please enter the credit limit",
        trigger: "blur",
    },
    custCategory: {
        type: 'number',
        message: "Please enter the customer category",
        trigger: "blur",
    },
    email: {
        type: 'email',
        message: "Please enter the email",
        trigger: "blur",
    },
    gstNo: {
        type: 'string',
        message: "Please enter the gst no",
        trigger: "blur",
    },
    location: {
        type: 'string',
        message: "Please enter the location",
        trigger: "blur",
    },
    mobile: {
        type: 'number',
        message: "Please enter the mobile",
        trigger: "blur",
    },
    name: {
        type: 'string',
        message: "Please enter the name",
        trigger: "blur",
    },
    phone1: {
        type: 'number',
        message: "Please enter the phone 1",
        trigger: "blur",
    },
    phone2: {
        type: 'number',
        message: "Please enter the phone 2",
        trigger: "blur",
    },
    place: {
        type: 'string',
        message: "Please enter the place",
        trigger: "blur",
    },
    salesMan: {
        type: 'string',
        required: true,
        message: "Please enter the sales man",
        trigger: "blur",
    },
    state: {
        type: 'string',
        message: "Please enter the state",
        trigger: "blur",
    },
    street: {
        type: 'string',
        message: "Please enter the street",
        trigger: "blur",
    },
    webPassword: {
        type: 'string',
        message: "Please enter the web password",
        trigger: "blur",
    }
};
const formRef = ref<FormInst | null>(null);
const formValue = ref<StoreData>(props.formData);
const modelTitle = ref<string>(props.title === 'Add Entry' ? 'Add Store' : 'Edit Store');
const isLoading = ref<boolean>(false);
const formError = ref<string>('');
const notification = useNotification();
const emit = defineEmits(['closeModal'])
const handleValidateClick = async (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            isLoading.value = true;
            const type = props.title === 'Add Entry' ? ActionTypes.ADD : ActionTypes.EDIT;
            if(type === ActionTypes.ADD){
                addDoc(collection(db, `stores`), formValue.value).then(() => {
                    notification.success({
                        title: 'Success',
                        content: 'Store details added successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                    emit('closeModal', false)
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                });
            }
            else{
                updateDoc(doc(db, `stores/${formValue.value.key}`), formValue.value).then(() => {
                    notification.success({
                        title: 'Success',
                        content: 'Store details updated successfully',
                        duration: 2500,
                        keepAliveOnHover: true
                    })
                    emit('closeModal', false)
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
</script>
<template>
   <NModal 
    :show="showModal"
    :mask-closable="false"
    preset="card"
    class="max-w-[90%] h-[80vh] store-modal"
    @close="() => $emit('closeModal', false)"
   >
        <template #header>
            <NH2 class="mb-0">{{ modelTitle }}</NH2>
        </template>
        <template #default>
            <div class="flex flex-col h-full">
                <NForm
                    showRequireMark
                    size="large"
                    ref="formRef"
                    :rules="rules"
                    :model="formValue"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1"
                >
                    <NFormItem path="address" label="Address" class="col-span-1">
                        <NInput v-model:value="formValue.address" />
                    </NFormItem>
                    <NFormItem path="allowBill" label="Allow Bill" class="col-span-1">
                        <NSwitch v-model:value="formValue.allowBill" />
                    </NFormItem>
                    <NFormItem path="alternatecode" label="Alternate Code" class="col-span-1">
                        <NInputNumber v-model:value="formValue.alternatecode" />
                    </NFormItem>
                    <NFormItem path="area" label="Area" class="col-span-1">
                        <NInputNumber v-model:value="formValue.area" />
                    </NFormItem>
                    <NFormItem path="areaName" label="Area Name" class="col-span-1">
                        <NInput v-model:value="formValue.areaName" />
                    </NFormItem>
                    <NFormItem path="code" label="Code" class="col-span-1">
                        <NInputNumber v-model:value="formValue.code" />
                    </NFormItem>
                    <NFormItem path="creditDays" label="Credit Days" class="col-span-1">
                        <NInput v-model:value="formValue.creditDays" />
                    </NFormItem>
                    <NFormItem path="creditLimit" label="Credit Limit" class="col-span-1">
                        <NInput v-model:value="formValue.creditLimit" />
                    </NFormItem>
                    <NFormItem path="custCategory" label="Customer Category" class="col-span-1">
                        <NInputNumber v-model:value="formValue.custCategory" />
                    </NFormItem>
                    <NFormItem path="email" label="Email" class="col-span-1">
                        <NInput v-model:value="formValue.email" />
                    </NFormItem>
                    <NFormItem path="gstNo" label="GST No" class="col-span-1">
                        <NInput v-model:value="formValue.gstNo" />
                    </NFormItem>
                    <NFormItem path="location" label="Location" class="col-span-1">
                        <NInput v-model:value="formValue.location" />
                    </NFormItem>
                    <NFormItem path="mobile" label="Mobile" class="col-span-1">
                        <NInputNumber v-model:value="formValue.mobile" />
                    </NFormItem>
                    <NFormItem path="name" label="Name" class="col-span-1">
                        <NInput v-model:value="formValue.name" />
                    </NFormItem>
                    <NFormItem path="phone1" label="Phone 1" class="col-span-1">
                        <NInputNumber v-model:value="formValue.phone1" />
                    </NFormItem>
                    <NFormItem path="phone2" label="Phone 2" class="col-span-1">
                        <NInputNumber v-model:value="formValue.phone2" />
                    </NFormItem>
                    <NFormItem path="place" label="Place" class="col-span-1">
                        <NInput v-model:value="formValue.place" />
                    </NFormItem>
                    <NFormItem path="salesMan" label="Sales Man" class="col-span-1">
                        <NSelect v-model:value="formValue.salesMan" :options="salesMen.map((salesMan:SalesMan) => ({label: salesMan.name, value: salesMan.name}))" />
                    </NFormItem>
                    <NFormItem path="state" label="State" class="col-span-1">
                        <NInput v-model:value="formValue.state" />
                    </NFormItem>
                    <NFormItem path="street" label="Street" class="col-span-1">
                        <NInput v-model:value="formValue.street" />
                    </NFormItem>
                    <NFormItem path="webPassword" label="Web Password" class="col-span-1">
                        <NInput v-model:value="formValue.webPassword" />
                    </NFormItem>
                </NForm>
                <div class="mt-4 border-t pt-4">
                    <NFormItem class="flex justify-end" :feedback="formError" validation-status="error">
                        <NButton
                            @click="handleValidateClick"
                            type="primary"
                            size="large"
                            class="rounded-md"
                            :loading="isLoading"
                            >Submit
                        </NButton>
                    </NFormItem>
                </div>
            </div>
        </template>
   </NModal>
</template>
<style>
.store-modal.n-card > .n-card__content {
    height: 100%;
    overflow: auto;
}
</style>