import { Helmet } from 'react-helmet-async';

import { DetailOrderView } from 'src/sections/detail-order/view';

// ----------------------------------------------------------------------

export default function DetailOrderPage() {
  return (
    <>
      <Helmet>
        <title> Detail HotPot </title>
      </Helmet>

      <DetailOrderView />
    </>
  );
}
