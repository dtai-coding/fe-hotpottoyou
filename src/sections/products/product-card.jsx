/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { App, Form, Input, Modal, Button, Select, Upload } from 'antd';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useFetchData from 'src/hooks/useFetch';

import { fCurrency } from 'src/utils/format-number';

import axiosClient from 'src/api/axiosClient';
import { useAppStore, useAuthStore } from 'src/stores';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  console.log(product);
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [loadingType, errorType, responseType] = useFetchData(() => axiosClient.get(`/v1/hotpot-type?pageIndex=1&pageSize=100`));
  const [loadingFlavor, errorFlavor, responseFlavor] = useFetchData(() => axiosClient.get(`/v1/hotpot-flavor?pageIndex=1&pageSize=100`));
  const types = responseType?.value ? responseType.value : [];
  const flavors = responseFlavor?.value ? responseFlavor.value : [];
  const [openModal, setOpenModal] = useState(false);

  const [createForm] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
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
      console.log(info);
      getBase64(info.file.originFileObj ? info.file.originFileObj : info.file, (url) => {
        console.log(url);
        setImageUrl(url);
      });
    },
  };
  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => message.error(`Error reading file: ${error}`);
  };
  const { user } = useAuthStore((state) => state.auth);
  const isStaff = user?.role === 'staff';

  const handleDelete = async () => {
    try {
      console.log('Deleteing...');
      await axiosClient.delete(`/api/v1/hotpot?id=${product.id}`);
      // notification.info({ message: 'Delete thành công' })
      refetchApp();
    } catch (e) {
      // notification.error({ message: 'Sorry! Something went wrong. App server error' })
    }
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      setLoading(true);
      console.log(types);
      console.log(flavors);
      console.log(values.typeID);
      values.typeID = types.find((t) => t.name === values.type).id;
      values.flavorID = flavors.find((t) => t.name === values.flavor).id;
      console.log(imageUrl);
      if (imageUrl) values.imageUrl = imageUrl;
      await axiosClient.put(`/v1/hotpot/update`, values);
      alert('Cập nhật thành công');
      refetchApp();
    } catch (err) {
      console.log(err);
      message.error('Sorry! Something went wrong. App server error');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const renderStatus = (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.imageUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {/* <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.price && fCurrency(product.price)}
      </Typography>
      &nbsp; */}
      {fCurrency(product.price)}
    </Typography>
  );

  useEffect(() => {
    createForm.setFieldsValue({
      id: product.id,
      name: product.name,
      size: product.size,
      imageUrl: product.imageUrl,
      description: product.description,
      price: product.price,
      type: product.type,
      flavor: product.flavor,
    });
  }, [product, createForm]);
  return (
    <Card>
      <Modal
        title="Thêm lẩu"
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        width={1000}
        centered
        footer={null}
      >
        <Form
          form={createForm}
          name={`update_${product.id}`}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input your size!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="imageUrl" rules={[{ required: true, message: 'Please input your imageUrl!' }]}>
            <Upload {...props}>
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input your price!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please input your typeID!' }]}>
            <Select placeholder="Type" allowClear>
              {types?.map((cl) => (
                <Select.Option key={cl?.id} value={cl?.name}>
                  {cl?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Flavor" name="flavor" rules={[{ required: true, message: 'Please input your flavor!' }]}>
            <Select placeholder="Flavor" allowClear>
              {flavors?.map((cl) => (
                <Select.Option key={cl?.id} value={cl?.name}>
                  {cl?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {product.status && renderStatus} */}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>

        <Typography variant="subtitle1">{product.description}</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={product.colors} /> */}
          <Typography variant="subtitle1">{product.size}</Typography>
          {renderPrice}
        </Stack>
        {!isStaff && (
          <>
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Xem
            </Button>
            <Button danger type="primary" onClick={() => handleDelete()}>
              Xóa
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
