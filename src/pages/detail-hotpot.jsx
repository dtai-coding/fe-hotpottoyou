import { Helmet } from 'react-helmet-async';

import { DetailHotPotView } from 'src/sections/detail-hotpot/view';

// ----------------------------------------------------------------------

export default function DetailHotPotPage() {
  return (
    <>
      <Helmet>
        <title> Detail HotPot </title>
      </Helmet>

      <DetailHotPotView />
    </>
  );
}
