import { Helmet } from 'react-helmet-async';

import { IngredientView } from 'src/sections/iIngredient';

// ----------------------------------------------------------------------

export default function IngredientPage() {
  return (
    <>
      <Helmet>
        <title> Ingredients </title>
      </Helmet>

      <IngredientView />
    </>
  );
}
