<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton } from "naive-ui";
import type { FormInst } from 'naive-ui'
import { ref } from "vue";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import router from "../router";
import Logo from '../assets/logo.webp'
const formRef = ref<FormInst | null>(null);
const formValue = ref({
  email: "",
  password: "",
});
const rules = {
  email: {
    required: true,
    message: "Please input your email address",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "Please input your password",
    trigger: "blur",
  },
};
const loginError = ref<string>('');
const isLoading = ref<boolean>(false);

const handleValidateClick = async (e: MouseEvent) => {
  e.preventDefault();
  isLoading.value = true;
  formRef.value?.validate((errors) => {
    if (!errors) {
      signInWithEmailAndPassword(auth, formValue.value.email, formValue.value.password)
        .then(() => {
          isLoading.value = false;
          router.push('/dashboard');
        })
        .catch((error) => {
          const errorMessage = error.message;
          loginError.value = errorMessage as string;
          isLoading.value = false;
        });
    } else {
      console.log(errors);
      loginError.value = '';
      isLoading.value = false;
    }
  });
};
</script>
<template>
    <div class="flex items-center justify-center h-screen">
        <NCard
            class="sm:mx-auto sm:w-full sm:max-w-xl flex justify-center px-6 py-12 lg:px-8 rounded-lg shadow-lg"
        >
            <div class="w-full">
            <img
                class="mx-auto h-10 w-auto"
                :src="Logo"
                alt="Your Company"
            />
            <h2
                class="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            >
                Login
            </h2>
            </div>

            <div class="mt-10 w-full">
            <NForm showRequireMark size="large" ref="formRef" :rules="rules" :model="formValue" class="space-y-4">
                <NFormItem
                label="Email address"
                path="email"
                class="block text-sm/6 font-medium text-gray-900"
                >
                <NInput
                    v-model:value="formValue.email"
                    placeholder="Email"
                    :input-props="{ type: 'email' }"
                    size="large"
                />
                </NFormItem>
                <NFormItem
                label="Password"
                path="password"
                class="block text-sm/6 font-medium text-gray-900"
                >
                <NInput
                    placeholder="Password"
                    v-model:value="formValue.password"
                    type="password"
                    :input-props="{ autocomplete: 'true' }"
                    size="large"
                />
                </NFormItem>
                <NFormItem class="!grid-rows-[minmax(0,auto)_1fr]" :feedback="loginError" validation-status="error">
                    <NButton
                        @click="handleValidateClick"
                        type="primary"
                        size="large"
                        class="rounded-md flex-1"
                        :loading="isLoading"
                        >Login
                    </NButton>
                </NFormItem>
            </NForm>
            </div>
        </NCard>
    </div>
</template>
