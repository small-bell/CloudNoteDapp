import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.baseURL = "http://121.40.178.96:3000/";
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
