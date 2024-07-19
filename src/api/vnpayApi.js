

import axiosClient from './axiosClient';

const paymentApi = {
    initiatePayment: (paymentData) => axiosClient.post('/api/VNPay/Payment', paymentData)
};

export default paymentApi;