/* eslint-disable no-unused-vars */
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Flex, Form, Input, Modal, Table, Button, Select, ConfigProvider, Typography as TypographyAnt } from 'antd';

import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import useFetchData from 'src/hooks/useFetch';

import axiosClient from 'src/api/axiosClient';

import Iconify from 'src/components/iconify';

import { useAppStore } from '../../../stores';

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
  const { Option } = Select;
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
        `/v1/user?pageIndex=${searchParams.get('page') ? Number(searchParams.get('page')) : 1}&pageSize=${
          searchParams.get('size') ? Number(searchParams.get('size')) : 10
        }${searchParams.get('query') ? `&search=${searchParams.get('query')}` : ''}`
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
      await axiosClient.post(`/v1/user`, values);
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
  const handleDelete = async (id) => {
    try {
      setOpen(null);
      await axiosClient.delete(`/v1/user?id=${id}`);
      refetchApp();
    } catch (e) {
      //   notification.error({ message: 'Sorry! Something went wrong. App server error' })
    }
  };

  const handleUpdate = async (values) => {
    const convertedValues = {
      ...values,
      roleID: mapRoleToId(values.role), // Change role to roleID
    };
    delete convertedValues.role; // Remove the old role field if needed

    console.log(convertedValues);
    try {
      setLoading(true);
      await axiosClient.put(`/v1/user/update`, convertedValues);
      refetchApp();
      setOpenUpdate(null);
    } catch (e) {
      // Handle error appropriately
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
    console.log('Record:', record);
    console.log('Record ID:', id);
    return id;
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const mapRoleToId = (roleName) => {
    switch (roleName) {
      case 'customer':
        return 3;
      case 'staff':
        return 2;
      default:
        return null;
    }
  };

  const columns_courses = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
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
            title="Edit User"
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
              <Form.Item label="Name" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Input />
              </Form.Item>
              <Form.Item label="Role" name="role">
                <Select>
                  <Option value="customer">Customer</Option>
                  <Option value="staff">Staff</Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Edit
                  </Button>
                  <Form.Item name="id" style={{ flex: 1 }} />
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </>
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
          Users
        </Typography>
        <Modal
          title="Add User"
          open={openCreate}
          onOk={() => setOpenCreate(false)}
          onCancel={() => setOpenCreate(false)}
          width={1000}
          style={{ top: 20 }}
          footer={null}
        >
          <Form form={createForm} layout="vertical" onFinish={HandleCreate} onFinishFailed={OnFinishFailed} autoComplete="off" initialValues={null}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input password!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please input gender!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input phone!' }]}>
              <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                Add
              </Button>
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
            <Button type="primary" size="large" onClick={() => setOpenCreate(true)}>
              Add User
            </Button>
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
      </Container>
    </ConfigProvider>
  );
}
