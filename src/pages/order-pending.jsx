import { Helmet } from 'react-helmet-async';

import { OrderPendingView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Orders </title>
      </Helmet>

      <OrderPendingView />
    </>
  );
}
