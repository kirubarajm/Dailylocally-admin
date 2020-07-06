import {
    MdDashboard
  } from 'react-icons/md';
export const SidebarSuperAdmin=[
    { to: '/dashboard', name: 'Catalog', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/stock-keeping', name: 'Stock keeping', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/warehouse/dayoders', name: 'Warehouse', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/crm', name: 'CRM', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
];
export const navBarSuperAdminItems=[];