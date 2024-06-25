/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form, Input, Modal, Button, Select } from 'antd';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useFetchData from 'src/hooks/useFetch';

import { fCurrency } from 'src/utils/format-number';

import { useAppStore } from 'src/stores';
import axiosClient from 'src/api/axiosClient';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function ShopUtensilCard({ product }) {
  console.log(product);
  const refetchApp = useAppStore((state) => state.refetchApp);
  const [loading, setLoading] = useState(false);
  const [loadingType, errorType, responseType] = useFetchData(() => axiosClient.get(`/api/v1/hotpot-type?pageIndex=1&pageSize=100`));
  const types = responseType?.value ? responseType.value : [];
  const [openModal, setOpenModal] = useState(false);

  const [createForm] = Form.useForm();

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
      console.log(values.typeID);
      values.typeID = types.find((t) => t.name === values.typeID).id;

      await axiosClient.put(`/api/v1/hotpot/update`, values);
      refetchApp();
    } catch {
      // notification.error({ message: 'Sorry! Something went wrong. App server error' });
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
      typeID: product.type,
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
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input your price!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="typeID" rules={[{ required: true, message: 'Please input your typeID!' }]}>
            <Select placeholder="Type" allowClear>
              {types?.map((cl) => (
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
              Submit
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
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Xem
        </Button>
        <Button danger type="primary" onClick={() => handleDelete()}>
          Xóa
        </Button>
      </Stack>
    </Card>
  );
}

ShopUtensilCard.propTypes = {
  product: PropTypes.object,
};
