import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// Navigation configuration for staff/admin
export const navConfigStaffAdmin = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Utensil',
    path: '/utensil',
    icon: icon('ic_cart'),
  },
  {
    title: 'Pot',
    path: '/pot',
    icon: icon('ic_cart'),
  },
  {
    title: 'product type',
    path: '/product-types',
    icon: icon('ic_cart'),
  },
  {
    title: 'ingredient',
    path: '/ingredient',
    icon: icon('ic_cart'),
  },
];

// Navigation configuration for customers
export const navConfigCustomer = [
  {
    title: 'blog',
    path: '/',
    icon: icon('ic_blog'),
  },
];
