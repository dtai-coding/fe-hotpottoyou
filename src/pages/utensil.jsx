import { Helmet } from 'react-helmet-async';

import { UtensilView } from 'src/sections/utensil/view';

// ----------------------------------------------------------------------

export default function UtensilPage() {
  return (
    <>
      <Helmet>
        <title> Utensils </title>
      </Helmet>

      <UtensilView />
    </>
  );
}
