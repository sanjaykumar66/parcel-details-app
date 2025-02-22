<script setup lang="ts">
import topBar from '../components/topBar.vue';
import { ref } from 'vue';
import { topBarTabs } from '../types';
import parcelComp from '../components/tabs/parcelComp.vue';
import storesComp from '../components/tabs/storesComp.vue';
const selectedTab = ref<topBarTabs>(topBarTabs.STORE)

const tabSwitch = (tab:topBarTabs) => {
    selectedTab.value = tab
}
</script>
<template>
    <div class="h-screen overflow-hidden">
        <topBar @tabSwitch="tabSwitch" />
        <parcelComp v-if="selectedTab === topBarTabs.PARCEL" />
        <storesComp v-if="selectedTab === topBarTabs.STORE" />
    </div>
</template>