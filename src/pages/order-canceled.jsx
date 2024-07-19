import { Helmet } from 'react-helmet-async';

import OrderCanceled from 'src/sections/order/view/order-canceled-view';

// ----------------------------------------------------------------------

export default function ProductTypesPage() {
  return (
    <>
      <Helmet>
        <title> ProductTypes </title>
      </Helmet>

      <OrderCanceled />
    </>
  );
}
