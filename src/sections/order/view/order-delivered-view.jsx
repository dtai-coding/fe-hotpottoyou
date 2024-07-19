/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flex, Form, Input, Table, Button, ConfigProvider, Typography as TypographyAnt } from 'antd';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useFetchData from 'src/hooks/useFetch';

import axiosClient from 'src/api/axiosClient';

import Iconify from 'src/components/iconify';

import { useAppStore } from '../../../stores';
import ProductCartWidget from '../order-cart-widget';

// ----------------------------------------------------------------------

export default function OrderDelivered() {
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [updateRecord, setUpdateRecord] = useState({});
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ? searchParams.get('query') : '');
  function debounce(func, delay) {
    let timeoutId;

    // eslint-disable-next-line func-names
    return function (...args) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((query) => {
      console.log(query);
      const queryParams = new URLSearchParams({
        page: searchParams.get('page') || '1',
        size: searchParams.get('size') || '10',
      });
      if (query) {
        queryParams.set('query', query);
      }
      setSearchParams(queryParams.toString());
    }, 500),
    [searchParams, setSearchParams]
  );

  const [loadingCourses, errorCourses, responseCourses] = useFetchData(
    () =>
      axiosClient.get(
        `/v1/get-delivered-orders?pageIndex=${searchParams.get('page') ? Number(searchParams.get('page')) : 1}&pageSize=${
          searchParams.get('size') ? Number(searchParams.get('size')) : 10
        }${searchParams.get('query') ? `&name=${searchParams.get('query')}` : ''}`
      ),
    searchParams.get('page'),
    searchParams.get('size'),
    searchParams.get('query')
  );
  const list = responseCourses?.value ? responseCourses.value : [];
  console.log(list);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const HandleCreate = async (values) => {
    console.log('Success:', values);
    try {
      setLoading(true);
      await axiosClient.post(`/v1/utensil`, values);
      refetchApp();
      createForm.resetFields();
    } catch {
      // notification.error({ message: 'Sorry! Something went wrong. App server error' });
    } finally {
      setLoading(false);
    }
  };

  const OnFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleUpdate = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      await axiosClient.put(`/v1/utensil/update`, values);
      refetchApp();
      setOpenUpdate(null);
    } catch (e) {
      //   notification.error({ message: 'Sorry! Something went wrong. App server error' })
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (id) => {
    navigate(`/detail-order?id=${id}`);
  };

  useEffect(() => {
    updateForm.setFieldsValue(updateRecord); // Update form fields when the record changes
  }, [updateRecord, updateForm]);

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event, id, record) => {
    setOpen(event.currentTarget);
    setRowId(id);
    setUpdateRecord(record);
    console.log('Record ID:', id);
    return id;
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const columns_courses = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'adress',
      key: 'adress',
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
    },
    {
      title: 'PurchaseDate',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: '',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <Button variant="contained" onClick={() => handleDetail(record.id)}>
          <Iconify icon="eva:info-outline" sx={{ mr: 2 }} />
          Detail
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          zIndexPopupBase: 2000,
        },
      }}
    >
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Delivered Orders
        </Typography>

        <Flex align="center" justify="space-between" style={{ marginBottom: 15 }} gap={20} wrap>
          <TypographyAnt.Text strong>{list?.length} Founded</TypographyAnt.Text>
          <Flex align="center" gap={20}>
            <Input.Search
              size="large"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </Flex>
        </Flex>
        <Table
          pagination={{
            current: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            position: ['bottomLeft'],
            pageSize: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
            total: 11,
            showSizeChanger: true,
          }}
          columns={columns_courses}
          dataSource={list.map((item) => ({ ...item, key: item.id }))}
          loading={loadingCourses}
          onChange={(pagination) => {
            const queryParams = new URLSearchParams({
              page: pagination.current.toString(),
              size: pagination.pageSize.toString(),
            });
            if (searchParams.get('query')) {
              queryParams.set('query', searchParams.get('query'));
            }
            setSearchParams(queryParams.toString());
          }}
        />
        <ProductCartWidget />
      </Container>
    </ConfigProvider>
  );
}
