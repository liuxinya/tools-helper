import Vue from 'vue';
import Pay from './Pay.vue';

export default {
    create(config) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const payContainerInstance = new Vue({
            render: h => h(Pay, {
                props: {
                    orderId: config.orderId,
                },
            }),
        }).$mount(el);
        return payContainerInstance.$children && payContainerInstance.$children[0];
    },
 };