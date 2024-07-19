import axiosClient from './axiosClient';

const APIs_URL = {
  LOGIN: '/v1/user/login',
  REGISTER: '/v1/customer/register',
  GET_CUSTOMER_BY_EMAIL: '/v1/user/get-user-by-email',
};

export const loginAPI = async (data) => {
  console.log('Sending login request with payload:', data);
  const response = await axiosClient.post(APIs_URL.LOGIN, data);
  console.log('Login response:', response);
  return response; // Return the data from the response
};

export const registerAPI = async (data) => {
  const response = await axiosClient.post(APIs_URL.REGISTER, data);
  return response.data; // Return response data instead of full response
};

export const getUserByEmailAPI = async (email) => {
  try {
    console.log('Fetching customer details for email:', email);
    const encodedEmail = encodeURIComponent(email); // Encode email parameter
    const response = await axiosClient.get(`${APIs_URL.GET_CUSTOMER_BY_EMAIL}?email=${encodedEmail}`);
    console.log('Customer details response:', response);
    return response; // Return response data instead of full response
  } catch (error) {
    console.error('Get customer by email API error:', error.response || error.message);
    throw error;
  }
};

export const convertToFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      value.forEach((file) => {
        formData.append(key, file);
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, `${value}`);
    }
  });
  return formData;
};

export default axiosClient;
