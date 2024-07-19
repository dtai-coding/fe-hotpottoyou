/* eslint-disable arrow-body-style */
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import userApi from '../../../api/userApi';
import orderApi from '../../../api/orderApi';
import hotpotApi from '../../../api/hotpotApi';
import utensilApi from '../../../api/utensilAPI';
import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';

export default function AppView() {
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [hotpotCount, setHotpotCount] = useState(0);
  const [utensilCount, setUtensilCount] = useState(0);
  const [orderStatistics, setOrderStatistics] = useState([]);
  const [hotpotTypes, setHotpotTypes] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(hotpotCount);
  console.log(utensilCount);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const fetchHotpotTypes = async () => {
      try {
        const response = await hotpotApi.getHotpotTypes();
        setHotpotCount(response.value.length);
        setHotpotTypes(response.value);
      } catch (error) {
        console.error('Error fetching hotpot types:', error);
      }
    };

    const fetchUtensils = async () => {
      try {
        const response = await utensilApi.getAll();
        setUtensilCount(response.value.length);
      } catch (error) {
        console.error('Error fetching utensils:', error);
      }
    };

    const fetchOrderCount = async () => {
      try {
        const response = await orderApi.getOrderCount();
        setOrderCount(response);
      } catch (error) {
        console.error('Error fetching order count:', error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await userApi.getUserCount();
        setUserCount(response);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setUserCount(0);
      }
    };

    const fetchOrderStatistics = async () => {
      try {
        const response = await orderApi.getOrderStatistics();
        setOrderStatistics(response);
      } catch (error) {
        console.error('Error fetching order statistics:', error);
      }
    };

    const fetchUserStatistics = async () => {
      try {
        const response = await userApi.getUserStatistics();
        console.log(response);
        setUserStatistics(response.value);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    await Promise.all([fetchHotpotTypes(), fetchUtensils(), fetchOrderCount(), fetchUserCount(), fetchOrderStatistics(), fetchUserStatistics()]);

    setLoading(false);
  };

  const prepareOrderStatisticsData = () => {
    const labels = orderStatistics.map((stat) => stat.date);
    const orderData = orderStatistics.map((stat) => stat.orderCount);
    const revenueData = orderStatistics.map((stat) => stat.revenue);

    return {
      labels,
      series: [
        {
          name: 'Orders',
          type: 'column',
          fill: 'solid',
          data: orderData,
        },
        {
          name: 'Revenue',
          type: 'area',
          fill: 'gradient',
          data: revenueData,
        },
      ],
    };
  };

  const prepareHotpotTypesData = () => {
    return hotpotTypes.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  };
  console.log(prepareHotpotTypesData);
  const prepareUserStatisticsData = () => {
    const roles = ['admin', 'staff', 'customer'];

    const data = roles.map((role) => {
      return {
        label: role,
        value: userStatistics.filter((user) => user.role === role).length,
      };
    });
    return data;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Orders"
            total={orderCount}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Users"
            total={userCount}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Hotpots"
            total={hotpotCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Utensils"
            total={utensilCount}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits title="Order Statistics" subheader="Orders and Revenue over time" chart={prepareOrderStatisticsData()} />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Hotpot Types"
            chart={{
              series: prepareHotpotTypesData(),
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="User Statistics"
            chart={{
              series: prepareUserStatisticsData(),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
