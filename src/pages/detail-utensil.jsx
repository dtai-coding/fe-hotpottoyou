import { Helmet } from 'react-helmet-async';

import { DetailUtensilView } from 'src/sections/detail-utensil/view';

// ----------------------------------------------------------------------

export default function DetailUtensilPage() {
  return (
    <>
      <Helmet>
        <title> Detail Utensil </title>
      </Helmet>

      <DetailUtensilView />
    </>
  );
}
