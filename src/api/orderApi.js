import axiosClient from './axiosClient';

const orderApi = {
  getOrderCount: async () => {
    try {
      const [waitForPay, pending, inProcess, delivered] = await Promise.all([
        axiosClient.get('/v1/get-wait-for-pay-orders'),
        axiosClient.get('/v1/get-pending-orders'),
        axiosClient.get('/v1/get-in-process-orders'),
        axiosClient.get('/v1/get-delivered-orders')
      ]);

      // Assuming each API returns an array of orders
      const totalOrders = 
        waitForPay.value.length + 
        pending.value.length + 
        inProcess.value.length + 
        delivered.value.length;

      return totalOrders;
    } catch (error) {
      console.error('Error fetching order count:', error);
      throw error;
    }
  },
  getOrderStatistics: async () => {
    try {
      const [waitForPay, pending, inProcess, delivered] = await Promise.all([
        axiosClient.get('/v1/get-wait-for-pay-orders'),
        axiosClient.get('/v1/get-pending-orders'),
        axiosClient.get('/v1/get-in-process-orders'),
        axiosClient.get('/v1/get-delivered-orders')
      ]);
  
      // Kết hợp tất cả các đơn hàng từ các trạng thái khác nhau
      const allOrders = [
        ...(waitForPay.value || []),
        ...(pending.value || []),
        ...(inProcess.value || []),
        ...(delivered.value || [])
      ];
  
      // Nhóm đơn hàng theo ngày và tính toán thống kê
      const statistics = allOrders.reduce((acc, order) => {
        if (order && order.purchaseDate && order.totalPrice) {
          const date = order.purchaseDate.split('T')[0];
          if (!acc[date]) {
            acc[date] = { date, orderCount: 0, revenue: 0 };
          }
          acc[date].orderCount += 1;
          acc[date].revenue += parseFloat(order.totalPrice) || 0;
        }
        return acc;
      }, {});
  
      // Chuyển đổi object thành mảng và sắp xếp theo ngày
      const sortedStatistics = Object.values(statistics).sort((a, b) => new Date(a.date) - new Date(b.date));
  
      return sortedStatistics;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      return []; // Trả về mảng rỗng thay vì ném lỗi
    }
  },
};

export default orderApi;