import {
    MdDashboard
  } from 'react-icons/md';
export const SidebarSuperAdmin=[
    { to: '/dashboard', name: 'Catalog', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/stock-keeping', name: 'Stock keeping', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/warehouse/dayoders', name: 'Warehouse', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/crm', name: 'CRM', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/user', name: 'User', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/logistics', name: 'Logistics', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/dunzo_orders', name: 'Dunzo Orders', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/trip_orders', name: 'Trip Orders', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
    { to: '/moveit-list', name: 'Drivers', exact: true, Icon: MdDashboard, submenu: false, submenuItem: null },
];
export const navBarSuperAdminItems=[];