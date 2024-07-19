import { Helmet } from 'react-helmet-async';

import OrderProgress from 'src/sections/order/view/order-in-progress-view';

// ----------------------------------------------------------------------

export default function ProductTypesPage() {
  return (
    <>
      <Helmet>
        <title> ProductTypes </title>
      </Helmet>

      <OrderProgress />
    </>
  );
}
