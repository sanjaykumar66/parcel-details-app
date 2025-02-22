import './style.css'

import App from './App.vue'
import { auth } from './config/firebaseConfig';
import { createApp } from 'vue'
import { onAuthStateChanged } from 'firebase/auth';
import router from './router'

let appInitialized:boolean = false

onAuthStateChanged(auth, () => {
    if (!appInitialized) {
        appInitialized = true
        createApp(App).use(router).mount('#app')
      }
})
