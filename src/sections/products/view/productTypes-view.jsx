/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flex, Form, Input, Modal, Table, Button, ConfigProvider, Typography as TypographyAnt } from 'antd';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useFetchData from 'src/hooks/useFetch';

import axiosClient from 'src/api/axiosClient';
import { useAppStore, useAuthStore } from 'src/stores';

// ----------------------------------------------------------------------

export default function ProductTypesView() {
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createForm] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ? searchParams.get('query') : '');
  const { user } = useAuthStore((state) => state.auth);
  const isStaff = user?.role === 'staff';

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
        size: searchParams.get('size') || '5',
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
        `/v1/hotpot-type?pageIndex=${searchParams.get('page') ? Number(searchParams.get('page')) : 1}&pageSize=${
          searchParams.get('size') ? Number(searchParams.get('size')) : 4
        }${searchParams.get('query') ? `&search=${searchParams.get('query')}` : ''}`
      ),
    searchParams.get('page'),
    searchParams.get('size'),
    searchParams.get('query')
  );
  console.log(responseCourses);
  const list = responseCourses?.value ? responseCourses.value : [];
  console.log(list);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      setLoading(true);
      await axiosClient.post(`/v1/hotpot-type`, values);
      refetchApp();
      createForm.resetFields();
    } catch {
      // notification.error({ message: 'Sorry! Something went wrong. App server error' });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleDelete = async (id) => {
    try {
      //   await courseApi.apiV1KhoaHocIdDelete(id)
      await axiosClient.delete('/v1/hotpot-type', { data: id });
      //   notification.info({ message: 'Delete thành công' })
      refetchApp();
    } catch (e) {
      //   notification.error({ message: 'Sorry! Something went wrong. App server error' })
    }
  };
  const columns_courses = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },

    !isStaff
      ? {
          title: '',
          key: 'actions',
          render: (_, record) => (
            <Button danger type="primary" onClick={() => handleDelete(record.id)}>
              Xóa
            </Button>
          ),
        }
      : null,
  ].filter(Boolean);
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
          Product Types
        </Typography>
        <Modal
          title="Thêm loại lẩu"
          open={openModal}
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}
          width={1000}
          style={{ top: 20 }}
          footer={null}
        >
          <Form form={createForm} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* 
      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters openFilter={openFilter} onOpenFilter={handleOpenFilter} onCloseFilter={handleCloseFilter} />

          <ProductSort />
        </Stack>
      </Stack> */}
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
            {/* <Select
            size='large'
            className='!text-left'
            allowClear
            optionLabelProp='label'
            placeholder={
              <Space>
                <svg
                  className='inline'
                  width='18'
                  height='13'
                  viewBox='0 0 18 13'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0 1.54004C0 0.987759 0.44772 0.540039 1 0.540039H17C17.5523 0.540039 18 0.987759 18 1.54004C18 2.09232 17.5523 2.54004 17 2.54004H1C0.44772 2.54004 0 2.09232 0 1.54004ZM3 6.54004C3 5.98774 3.44772 5.54004 4 5.54004H14C14.5523 5.54004 15 5.98774 15 6.54004C15 7.09234 14.5523 7.54004 14 7.54004H4C3.44772 7.54004 3 7.09234 3 6.54004ZM6 11.54C6 10.9877 6.44772 10.54 7 10.54H11C11.5523 10.54 12 10.9877 12 11.54C12 12.0923 11.5523 12.54 11 12.54H7C6.44772 12.54 6 12.0923 6 11.54Z'
                    fill='#A5A9AD'
                  />
                </svg>
                Lọc theo
                <TypographyAnt.Text strong>Đánh giá cao</TypographyAnt.Text>
              </Space>
            }
            style={{ width: 250 }}
          >
            {options.map((data) => (
              <Select.Option
                key={data}
                value={data}
                label={
                  <Space className='text-[#00000040]'>
                    <svg
                      className='inline'
                      width='18'
                      height='13'
                      viewBox='0 0 18 13'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M0 1.54004C0 0.987759 0.44772 0.540039 1 0.540039H17C17.5523 0.540039 18 0.987759 18 1.54004C18 2.09232 17.5523 2.54004 17 2.54004H1C0.44772 2.54004 0 2.09232 0 1.54004ZM3 6.54004C3 5.98774 3.44772 5.54004 4 5.54004H14C14.5523 5.54004 15 5.98774 15 6.54004C15 7.09234 14.5523 7.54004 14 7.54004H4C3.44772 7.54004 3 7.09234 3 6.54004ZM6 11.54C6 10.9877 6.44772 10.54 7 10.54H11C11.5523 10.54 12 10.9877 12 11.54C12 12.0923 11.5523 12.54 11 12.54H7C6.44772 12.54 6 12.0923 6 11.54Z'
                        fill='#A5A9AD'
                      />
                    </svg>
                    Lọc theo
                    <Text strong>{data}</Text>
                  </Space>
                }
              >
                {data}
              </Select.Option>
            ))}
          </Select> */}
            {!isStaff && (
              <Button type="primary" size="large" onClick={() => setOpenModal(true)}>
                Thêm loại lẩu
              </Button>
            )}
          </Flex>
        </Flex>
        <Table
          pagination={{
            current: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            position: ['bottomLeft'],
            pageSize: searchParams.get('size') ? Number(searchParams.get('size')) : 4,
            total: 5,
          }}
          columns={columns_courses}
          dataSource={list}
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
        {/* <List
          loading={loadingCourses}
          pagination={{
            current: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            position: 'bottom',
            align: 'center',
            pageSize: searchParams.get('size') ? Number(searchParams.get('size')) : 4,
            total: 5,
            onChange: (page, pageSize) => {
              const queryParams = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
              });
              if (searchParams.get('query')) {
                queryParams.set('query', searchParams.get('query'));
              }
              setSearchParams(queryParams.toString());
            },
          }}
          grid={{ gutter: 16, column: 4 }}
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <ProductCard product={item} />
            </List.Item>
          )}
        /> */}
        {/* <Grid container spacing={3}>
        {list?.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid> */}
      </Container>
    </ConfigProvider>
  );
}
