/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Button, ConfigProvider } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import axiosClient from 'src/api/axiosClient';

import { useAppStore } from '../../../stores';

// ----------------------------------------------------------------------

export default function DetailOrderView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/v1/get-order-by-id?id=${id}`);
        console.log(`Response: `, response.value);
        setOrderDetail(response.value);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleItemDetail = (item) => {
    if (item.type === 'Hot Pot') {
      navigate(`/detail-hotpot?id=${item.id}`);
    } else if (item.type === 'Utensil') {
      navigate(`/detail-utensil?id=${item.id}`);
    } else if (item.type === 'Pot') {
      navigate(`/detail-pot?id=${item.id}`);
    } else {
      console.error('Unknown item type:', item.type);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          zIndexPopupBase: 2000,
        },
      }}
    >
      <Container>
        {orderDetail ? (
          <div>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Order ID: {id}
            </Typography>
            <Typography variant="h6">Purchase Date: {new Date(orderDetail.purchaseDate).toLocaleString()}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Email: {orderDetail.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Address: {orderDetail.adress}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Price: {orderDetail.totalPrice}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Payment: {orderDetail.payment}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Status: {orderDetail.orderStatus}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Items:
            </Typography>
            {orderDetail.items.map((item) => (
              <div key={item.id} style={{ marginBottom: '16px' }}>
                <Typography variant="body1">Id: {item.id}</Typography>
                <Typography variant="body1">Type: {item.type}</Typography>
                <Typography variant="body1">Quantity: {item.quantity}</Typography>
                <Typography variant="body1">Total: {item.total}</Typography>
                <Button variant="contained" onClick={() => handleItemDetail(item)}>
                  Detail
                </Button>
              </div>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Activities:
            </Typography>
            {orderDetail.activities.map((activity, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <Typography variant="body1">Action: {activity.action}</Typography>
                <Typography variant="body1">Date: {new Date(activity.dateTime).toLocaleString()}</Typography>
              </div>
            ))}
          </div>
        ) : (
          <div>No details available</div>
        )}
      </Container>
    </ConfigProvider>
  );
}
