import { Helmet } from 'react-helmet-async';

import OrderDelivered from 'src/sections/order/view/order-delivered-view';

// ----------------------------------------------------------------------

export default function ProductTypesPage() {
  return (
    <>
      <Helmet>
        <title> ProductTypes </title>
      </Helmet>

      <OrderDelivered />
    </>
  );
}
