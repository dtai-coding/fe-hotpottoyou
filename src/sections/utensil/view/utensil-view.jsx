/* eslint-disable no-unused-vars */
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Flex, Form, Input, Modal, Table, Image, Upload, Button, message, ConfigProvider, Typography as TypographyAnt } from 'antd';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import useFetchData from 'src/hooks/useFetch';

import axiosClient from 'src/api/axiosClient';
import { useAppStore, useAuthStore } from 'src/stores';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UtensilView() {
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
        `/v1/utensil?pageIndex=${searchParams.get('page') ? Number(searchParams.get('page')) : 1}&pageSize=${
          searchParams.get('size') ? Number(searchParams.get('size')) : 10
        }${searchParams.get('query') ? `&name=${searchParams.get('query')}` : ''}`
      ),
    searchParams.get('page'),
    searchParams.get('size'),
    searchParams.get('query')
  );
  const list = responseCourses?.value ? responseCourses.value : [];
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl1, setImageUrl1] = useState(null);
  const props = {
    name: 'file',
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return false;
    },
    onChange: (info) => {
      getBase64(info.file.originFileObj ? info.file.originFileObj : info.file, (url) => {
        console.log(url);
        setImageUrl(url);
      });
    },
  };
  const props1 = {
    name: 'file',
    accept: 'image/*',
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return false;
    },
    onChange: (info) => {
      getBase64(info.file.originFileObj ? info.file.originFileObj : info.file, (url) => {
        console.log(url);
        setImageUrl1(url);
      });
    },
  };
  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => message.error(`Error reading file: ${error}`);
  };
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const HandleCreate = async (values) => {
    console.log('Success:', values);
    values.imageUrl = imageUrl;
    try {
      setLoading(true);
      await axiosClient.post(`/v1/utensil`, values);
      refetchApp();
      createForm.resetFields();
      alert('Thêm thành công');
    } catch {
      alert('Thêm thất bại');
      // notification.error({ message: 'Sorry! Something went wrong. App server error' });
    } finally {
      setLoading(false);
    }
  };

  const OnFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleDelete = async (id) => {
    try {
      setOpen(null);
      await axiosClient.delete(`/v1/utensil?id=${id}`);
      refetchApp();
    } catch (e) {
      //   notification.error({ message: 'Sorry! Something went wrong. App server error' })
    }
  };

  const handleUpdate = async (values) => {
    console.log(values);
    values.imageUrl = imageUrl1;
    try {
      setLoading(true);
      await axiosClient.put(`/v1/utensil/update`, values);
      refetchApp();
      setOpenUpdate(null);
      alert('Cập nhật thành công');
    } catch (e) {
      alert('Cập nhật thất bại');
      //   notification.error({ message: 'Sorry! Something went wrong. App server error' })
    } finally {
      setLoading(false);
    }
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
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => <Image src={url} width={200} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    !isStaff
      ? {
          title: '',
          align: 'center',
          width: 80,
          render: (_, record) => (
            <>
              <IconButton onClick={(event) => handleOpenMenu(event, record.id, record)}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>

              <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: { width: 140 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setOpenUpdate(rowId);
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                  Edit
                </MenuItem>

                <MenuItem onClick={() => handleDelete(rowId)} sx={{ color: 'error.main' }}>
                  <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                  Delete
                </MenuItem>
              </Popover>

              <Modal
                title="Edit Utensils"
                open={openUpdate === record.id}
                onOk={() => setOpenUpdate(null)}
                onCancel={() => setOpenUpdate(null)}
                width={1000}
                style={{ top: 20 }}
                footer={null}
              >
                <Form
                  form={updateForm}
                  layout="vertical"
                  onFinish={handleUpdate}
                  onFinishFailed={OnFinishFailed}
                  autoComplete="off"
                  initialValues={{ ...updateRecord, id: rowId }}
                >
                  <Form.Item label="Image" name="imageUrl" rules={[{ required: true, message: 'Please input your imageUrl!' }]}>
                    <Upload {...props1}>
                      <Button>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item label="Name" name="name">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Material" name="material">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Size" name="size">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Quantity" name="quantity">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Price" name="price">
                    <Input />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button loading={loading} type="primary" htmlType="submit">
                        Edit
                      </Button>
                      <Form.Item name="type" style={{ flex: 1 }} />
                      <Form.Item name="id" style={{ flex: 1 }} />
                    </div>
                  </Form.Item>
                </Form>
              </Modal>
            </>
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
          Utensils
        </Typography>
        <Modal
          title="Add Utensils"
          open={openCreate}
          onOk={() => setOpenCreate(false)}
          onCancel={() => setOpenCreate(false)}
          width={1000}
          style={{ top: 20 }}
          footer={null}
        >
          <Form form={createForm} layout="vertical" onFinish={HandleCreate} onFinishFailed={OnFinishFailed} autoComplete="off" initialValues={null}>
            <Form.Item label="Image" name="imageUrl" rules={[{ required: true, message: 'Please input your imageUrl!' }]}>
              <Upload {...props}>
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Material" name="material" rules={[{ required: true, message: 'Please input your material!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input your size!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please input your quantity!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input your price!' }]}>
              <Input />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button loading={loading} type="primary" htmlType="submit">
                  Add
                </Button>
                <Form.Item name="type" initialValue="utensil" style={{ flex: 1 }} />
              </div>
            </Form.Item>
          </Form>
        </Modal>
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
            {!isStaff && (
              <Button type="primary" size="large" onClick={() => setOpenCreate(true)}>
                Add Utensils
              </Button>
            )}
          </Flex>
        </Flex>
        <Table
          pagination={{
            current: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
            position: ['bottomLeft'],
            pageSize: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
            total: 11, // list.length
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
      </Container>
    </ConfigProvider>
  );
}
