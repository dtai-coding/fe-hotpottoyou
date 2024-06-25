import { Helmet } from 'react-helmet-async';

import ProductTypesView from 'src/sections/products/view/productTypes-view';

// ----------------------------------------------------------------------

export default function ProductTypesPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <ProductTypesView />
    </>
  );
}
