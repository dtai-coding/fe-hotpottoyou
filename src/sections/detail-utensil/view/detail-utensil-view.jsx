/* eslint-disable no-unused-vars */
import { ConfigProvider } from 'antd';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import axiosClient from 'src/api/axiosClient';

import { useAppStore } from '../../../stores';

// ----------------------------------------------------------------------

export default function DetailUtensilView() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [loading, setLoading] = useState(false);
  const [utensilDetail, setUtensilDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/v1/utensil/get-utensil-by-id?id=${id}`);
        setUtensilDetail(response.value);
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

  return (
    <ConfigProvider
      theme={{
        token: {
          zIndexPopupBase: 2000,
        },
      }}
    >
      <Container>
        {utensilDetail ? (
          <div>
            <Typography variant="h4" sx={{ mb: 5 }}>
              {utensilDetail.name}
            </Typography>
            <img src={utensilDetail.imageUrl} alt={utensilDetail.name} style={{ width: '100%', height: 'auto', marginBottom: 20 }} />
            <Typography variant="h6">Size: {utensilDetail.size}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {utensilDetail.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Quantity: {utensilDetail.quantity}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Price: {utensilDetail.price}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              material: {utensilDetail.material}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Type: {utensilDetail.type}
            </Typography>
          </div>
        ) : (
          <div>No details available</div>
        )}
      </Container>
    </ConfigProvider>
  );
}
