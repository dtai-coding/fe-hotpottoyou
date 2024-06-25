/* eslint-disable no-restricted-syntax */
import axiosClient from './axiosClient';

const APIs_URL = {
  LOGIN: '/v1/user/login',
  REGISTER: '/v1/customer/register',
};

export const loginAPI = async (data) => {
  try {
    console.log('Sending login request with payload:', data); // Debug: Log the payload
    const response = await axiosClient.post(APIs_URL.LOGIN, data);
    console.log('Login response:', response); // Debug: Log the response
    return response;
  } catch (error) {
    console.error('Login API error:', error.response || error.message); // Debug: Log the error
    throw error;
  }
};

export const registerAPI = async (data) => axiosClient.post(APIs_URL.REGISTER, data);

export const convertToFormData = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      value.forEach((file) => {
        formData.append(`${key}`, file);
      });
    } else if (value instanceof File) {
      formData.append(`${key}`, value);
    } else {
      formData.append(`${key}`, `${value}`);
    }
  }
  return formData;
};
