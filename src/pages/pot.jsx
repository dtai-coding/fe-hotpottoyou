import { Helmet } from 'react-helmet-async';

import { PotView } from 'src/sections/pot/view';

// ----------------------------------------------------------------------

export default function PotPage() {
  return (
    <>
      <Helmet>
        <title> Pots </title>
      </Helmet>

      <PotView />
    </>
  );
}
