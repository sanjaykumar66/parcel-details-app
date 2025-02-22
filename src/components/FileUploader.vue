<template>
  <div>
    <input 
      type="file" 
      accept=".xls,.xlsx" 
      @change="handleFileUpload"
    />
    <button @click="exportData">Export Data</button>
  </div>
</template>

<script>
import { convertXlsToJson, downloadJsonAsCsv } from '@/utils/xlsToJson';
import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
export default {
  data() {
    return {
      jsonData: []
    }
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      try {
        this.jsonData = await convertXlsToJson(file);
        console.log('Converted JSON:', this.jsonData);
      } catch (error) {
        console.error('Conversion error:', error);
      }
    },
    exportData() {
      //downloadJsonAsCsv(this.jsonData, 'exported_data.csv');
      const collectionRef = collection(db, 'stores');
      this.jsonData.forEach(async (item) => {
        await addDoc(collectionRef, item);
      })
      console.log('Data added to Firestore');
    }
  }
}
</script> 