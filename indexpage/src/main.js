// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import fullPage from 'vue-fullpage.js';
import App from './App';

Vue.config.productionTip = false;

Vue.component('full-page', fullPage.default);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
