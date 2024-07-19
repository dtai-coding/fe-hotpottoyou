import { Helmet } from 'react-helmet-async';

import { DetailPotView } from 'src/sections/detail-pot/view';

// ----------------------------------------------------------------------

export default function DetailPotPage() {
  return (
    <>
      <Helmet>
        <title> Detail Pot </title>
      </Helmet>

      <DetailPotView />
    </>
  );
}
