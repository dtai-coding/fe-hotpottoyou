import { Helmet } from 'react-helmet-async';

import { IngredientView } from 'src/sections/iIngredient';

// ----------------------------------------------------------------------

export default function IngredientPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <IngredientView />
    </>
  );
}
