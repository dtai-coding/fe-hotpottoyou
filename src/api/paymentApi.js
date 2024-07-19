
import axiosClient from './axiosClient';

const paymentApi = {
    createPayment: (paymentData) => axiosClient.post('/api/Payment', paymentData),
};

export default paymentApi;