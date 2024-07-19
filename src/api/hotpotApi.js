import axiosClient from './axiosClient';

const hotpotApi = {
  getHotpotTypes: () => axiosClient.get('/v1/hotpot-type'),

  getHotpots: () => axiosClient.get('/v1/hotpot'),

  getHotpotsById: (idHotPot) => axiosClient.get('/v1/hotpot/get-hotpot-by-id', { params: { id: idHotPot } }),

  getUtensils: () => axiosClient.get('/v1/utensil'),

  getPots: () => axiosClient.get('/v1/pot'),

  getIngredientGroups: () => axiosClient.get('/IngredientGroup/ingredient-group'),

  createOrder: (orderData) => axiosClient.post('/Order', orderData)
};

export default hotpotApi;