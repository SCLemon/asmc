import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';

import lazy from './directives/lazy'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)

app.use(router)

app.directive('lazy', lazy)

app.mount('#app');

