export const MENU_ITEMS = [{
  key: 'menu',
  label: 'MENU',
  isTitle: true
}, {
  key: 'dashboards',
  label: 'Dashboard',
  icon: 'solar:widget-2-outline',
  url: '/dashboards',
  badge: {
    text: 'New',
    variant: 'primary'
  }
},
// ====================Trasealla Services===============
{
  key: 'trasealla-services',
  label: 'Trasealla Services',
  isTitle: true
}, {
  key: 'flight-tickets',
  label: 'Flight Tickets',
  icon: 'solar:airplane-outline',
  url: '/services/flight-tickets',
  parentKey: 'trasealla-services'
}, {
  key: 'visa-services',
  label: 'Visa Services',
  icon: 'solar:passport-outline',
  children: [{
    key: 'uae-visas',
    label: 'UAE Visas',
    url: '/services/visas/uae',
    parentKey: 'visa-services'
  }, {
    key: 'schengen-visas',
    label: 'Schengen Visas',
    url: '/services/visas/schengen',
    parentKey: 'visa-services'
  }, {
    key: 'international-visas',
    label: 'International Visas',
    url: '/services/visas/international',
    parentKey: 'visa-services'
  }]
}, {
  key: 'uae-residency',
  label: 'UAE Residency',
  icon: 'solar:home-outline',
  children: [{
    key: 'employment-residence',
    label: 'Employment Residence',
    url: '/services/residency/employment',
    parentKey: 'uae-residency'
  }, {
    key: 'investor-residence',
    label: 'Investor/Partner Residence',
    url: '/services/residency/investor',
    parentKey: 'uae-residency'
  }, {
    key: 'family-sponsorship',
    label: 'Family Sponsorship',
    url: '/services/residency/family',
    parentKey: 'uae-residency'
  }, {
    key: 'golden-visa',
    label: 'Golden Visa Assistance',
    url: '/services/residency/golden-visa',
    parentKey: 'uae-residency'
  }]
}, {
  key: 'education-travel',
  label: 'Education Travel',
  icon: 'solar:graduation-outline',
  children: [{
    key: 'uk-study',
    label: 'UK (London)',
    url: '/services/education/uk',
    parentKey: 'education-travel'
  }, {
    key: 'europe-study',
    label: 'Europe',
    url: '/services/education/europe',
    parentKey: 'education-travel'
  }, {
    key: 'australia-study',
    label: 'Australia',
    url: '/services/education/australia',
    parentKey: 'education-travel'
  }, {
    key: 'new-zealand-study',
    label: 'New Zealand',
    url: '/services/education/new-zealand',
    parentKey: 'education-travel'
  }, {
    key: 'brazil-study',
    label: 'Brazil',
    url: '/services/education/brazil',
    parentKey: 'education-travel'
  }]
}, {
  key: 'immigration',
  label: 'Immigration Pathways',
  icon: 'solar:globe-outline',
  children: [{
    key: 'brazil-immigration',
    label: 'Brazil Immigration',
    url: '/services/immigration/brazil',
    parentKey: 'immigration'
  }, {
    key: 'australia-immigration',
    label: 'Australia Immigration',
    url: '/services/immigration/australia',
    parentKey: 'immigration'
  }, {
    key: 'new-zealand-immigration',
    label: 'New Zealand Immigration',
    url: '/services/immigration/new-zealand',
    parentKey: 'immigration'
  }]
}, {
  key: 'tour-packages',
  label: 'Tour Packages',
  icon: 'solar:map-point-outline',
  children: [{
    key: 'egypt-tours',
    label: 'Egypt',
    url: '/services/tours/egypt',
    parentKey: 'tour-packages'
  }, {
    key: 'morocco-tours',
    label: 'Morocco',
    url: '/services/tours/morocco',
    parentKey: 'tour-packages'
  }, {
    key: 'black-sea-tours',
    label: 'Black Sea',
    url: '/services/tours/black-sea',
    parentKey: 'tour-packages'
  }]
}, {
  key: 'add-ons',
  label: 'Add-ons & Support',
  icon: 'solar:settings-outline',
  children: [{
    key: 'hotels',
    label: 'Hotel Bookings',
    url: '/services/add-ons/hotels',
    parentKey: 'add-ons'
  }, {
    key: 'insurance',
    label: 'Travel Insurance',
    url: '/services/add-ons/insurance',
    parentKey: 'add-ons'
  }, {
    key: 'transfers',
    label: 'Airport Transfers',
    url: '/services/add-ons/transfers',
    parentKey: 'add-ons'
  }, {
    key: 'itineraries',
    label: 'Custom Itineraries',
    url: '/services/add-ons/itineraries',
    parentKey: 'add-ons'
  }, {
    key: 'corporate',
    label: 'Group & Corporate',
    url: '/services/add-ons/corporate',
    parentKey: 'add-ons'
  }]
}, {
  key: 'additional-services',
  label: 'Additional Services',
  icon: 'solar:star-outline',
  children: [{
    key: 'hajj-umrah',
    label: 'Hajj & Umrah',
    url: '/services/additional/hajj-umrah',
    parentKey: 'additional-services'
  }, {
    key: 'cruise-holidays',
    label: 'Cruise Holidays',
    url: '/services/additional/cruise',
    parentKey: 'additional-services'
  }, {
    key: 'adventure-travel',
    label: 'Adventure Travel',
    url: '/services/additional/adventure',
    parentKey: 'additional-services'
  }, {
    key: 'luxury-services',
    label: 'Luxury & VIP',
    url: '/services/additional/luxury',
    parentKey: 'additional-services'
  }]
},
// ====================Management===============
{
  key: 'management',
  label: 'Management',
  isTitle: true
}, {
  key: 'bookings',
  label: 'Bookings',
  icon: 'solar:calendar-outline',
  url: '/management/bookings'
}, {
  key: 'customers',
  label: 'Customers',
  icon: 'solar:users-group-rounded-outline',
  url: '/management/customers'
}, {
  key: 'payments',
  label: 'Payments',
  icon: 'solar:card-outline',
  url: '/management/payments'
}, {
  key: 'contacts',
  label: 'Contacts',
  icon: 'solar:chat-round-outline',
  url: '/contacts',
  requiredRoles: ['admin', 'superadmin']
}, {
  key: 'reports',
  label: 'Reports & Analytics',
  icon: 'solar:chart-outline',
  url: '/management/reports'
},
// ====================Authentication===============

{
  key: 'auth',
  label: 'Authentication',
  icon: 'solar:user-circle-outline',
  children: [{
    key: 'sign-in',
    label: 'Sign In',
    url: '/auth/sign-in',
    parentKey: 'auth'
  }, {
    key: 'sign-up',
    label: 'Sign Up',
    url: '/auth/sign-up',
    parentKey: 'auth'
  }, {
    key: 'reset-password',
    label: 'Reset Password',
    url: '/auth/reset-password',
    parentKey: 'auth'
  }, {
    key: 'lock-screen',
    label: 'Lock Screen',
    url: '/auth/lock-screen',
    parentKey: 'auth'
  }]
},
// ====================error===============

{
  key: 'error-pages',
  label: 'Error Pages',
  icon: 'solar:danger-outline',
  children: [{
    key: '404-error',
    label: '404 Error',
    url: '/error-pages/pages-404',
    parentKey: 'error'
  }, {
    key: '404-error(alt)',
    label: '404 Error (alt)',
    url: '/pages-404-alt',
    parentKey: 'error'
  }]
},
// ====================base-ui===============
{
  key: 'ui-kit',
  label: 'UI Kit...',
  isTitle: true
}, {
  key: 'base-ui',
  label: 'Base UI',
  icon: 'solar:leaf-outline',
  children: [{
    key: 'accordion',
    label: 'Accordion',
    url: '/base-ui/accordion',
    parentKey: 'base-ui'
  }, {
    key: 'alerts',
    label: 'Alerts',
    url: '/base-ui/alerts',
    parentKey: 'base-ui'
  }, {
    key: 'avatar',
    label: 'Avatar',
    url: '/base-ui/avatar',
    parentKey: 'base-ui'
  }, {
    key: 'badge',
    label: 'Badge',
    url: '/base-ui/badge',
    parentKey: 'base-ui'
  }, {
    key: 'breadcrumb',
    label: 'Breadcrumb',
    url: '/base-ui/breadcrumb',
    parentKey: 'base-ui'
  }, {
    key: 'buttons',
    label: 'Buttons',
    url: '/base-ui/buttons',
    parentKey: 'base-ui'
  }, {
    key: 'cards',
    label: 'Cards',
    url: '/base-ui/cards',
    parentKey: 'base-ui'
  }, {
    key: 'carousel',
    label: 'Carousel',
    url: '/base-ui/carousel',
    parentKey: 'base-ui'
  }, {
    key: 'collapse',
    label: 'Collapse',
    url: '/base-ui/collapse',
    parentKey: 'base-ui'
  }, {
    key: 'dropdown',
    label: 'Dropdown',
    url: '/base-ui/dropdown',
    parentKey: 'base-ui'
  }, {
    key: 'list-group',
    label: 'List Group',
    url: '/base-ui/list-group',
    parentKey: 'base-ui'
  }, {
    key: 'modals',
    label: 'Modals',
    url: '/base-ui/modals',
    parentKey: 'base-ui'
  }, {
    key: 'tabs',
    label: 'Tabs',
    url: '/base-ui/tabs',
    parentKey: 'base-ui'
  }, {
    key: 'offcanvas',
    label: 'Offcanvas',
    url: '/base-ui/offcanvas',
    parentKey: 'base-ui'
  }, {
    key: 'pagination',
    label: 'Pagination',
    url: '/base-ui/pagination',
    parentKey: 'base-ui'
  }, {
    key: 'placeholders',
    label: 'Placeholders',
    url: '/base-ui/placeholders',
    parentKey: 'base-ui'
  }, {
    key: 'popovers',
    label: 'Popovers',
    url: '/base-ui/popovers',
    parentKey: 'base-ui'
  }, {
    key: 'progress',
    label: 'Progress',
    url: '/base-ui/progress',
    parentKey: 'base-ui'
  }, {
    key: 'spinners',
    label: 'spinners',
    url: '/base-ui/spinners',
    parentKey: 'base-ui'
  }, {
    key: 'toasts',
    label: 'Toasts',
    url: '/base-ui/toasts',
    parentKey: 'base-ui'
  }, {
    key: 'tooltips',
    label: 'Tooltips',
    url: '/base-ui/tooltips',
    parentKey: 'base-ui'
  }]
},
// ====================apex===============
{
  key: 'apex',
  label: 'Apex charts',
  icon: 'solar:chart-square-outline',
  url: '/apex-chart'
},
// ====================forms===============
{
  key: 'forms',
  label: 'Forms',
  icon: 'solar:box-outline',
  children: [{
    key: 'basic',
    label: 'Basic Element',
    url: '/forms/basic',
    parentKey: 'forms'
  }, {
    key: 'flat-picker',
    label: 'Flatepicker',
    url: '/forms/flat-picker',
    parentKey: 'forms'
  }, {
    key: 'validation',
    label: 'Validation',
    url: '/forms/validation',
    parentKey: 'forms'
  }, {
    key: 'file-uploads',
    label: 'File Upload',
    url: '/forms/file-uploads',
    parentKey: 'forms'
  }, {
    key: 'editors',
    label: 'Editors',
    url: '/forms/editors',
    parentKey: 'forms'
  }]
},
// ====================tables===============

{
  key: 'tables',
  label: 'Tables',
  icon: 'solar:checklist-outline',
  children: [{
    key: 'basic',
    label: 'Basic Tables',
    url: '/tables/basic',
    parentKey: 'tables'
  }, {
    key: 'gridjs',
    label: 'Grid Js',
    url: '/tables/gridjs',
    parentKey: 'tables'
  }]
},
// ====================icons===============

{
  key: 'icons',
  label: 'Icons',
  icon: 'solar:crown-star-outline',
  children: [{
    key: 'boxicons',
    label: 'Box Icons',
    url: '/icons/boxicons',
    parentKey: 'icons'
  }, {
    key: 'solaricons',
    label: 'Solar Icons',
    url: '/icons/solaricons',
    parentKey: 'icons'
  }]
},
// ====================maps===============
{
  key: 'maps',
  label: 'Maps',
  icon: 'solar:map-outline',
  children: [{
    key: 'google',
    label: 'Google Maps',
    url: '/maps/google',
    parentKey: 'maps'
  }, {
    key: 'vector',
    label: 'Vector Maps',
    url: '/maps/vector',
    parentKey: 'maps'
  }]
}, {
  key: 'other',
  label: 'OTHER',
  isTitle: true
},
// ====================layouts===============

{
  key: 'layouts',
  label: 'layouts',
  icon: 'solar:window-frame-outline',
  children: [{
    key: 'dark-sidenav',
    label: 'dark sidenav',
    url: '/dark-sidenav',
    parentKey: 'layouts'
  }, {
    key: 'dark-topnav',
    label: 'dark topnav',
    url: '/dark-topnav',
    parentKey: 'layouts'
  }, {
    key: 'small-sidenav',
    label: 'small sidenav',
    url: '/small-sidenav',
    parentKey: 'layouts'
  }, {
    key: 'hidden-sidenav',
    label: 'hidden sidenav',
    url: '/hidden-sidenav',
    parentKey: 'layouts'
  }, {
    key: 'dark-mode',
    label: 'darkmode',
    url: '/dark-mode',
    parentKey: 'layouts',
    badge: {
      text: 'Hot',
      variant: 'badge badge-soft-danger '
    }
  }]
},
// ====================menu-items===============

{
  key: 'menu-items',
  label: 'Menu Item',
  icon: 'solar:share-circle-outline',
  children: [{
    key: 'menu-items-1',
    label: 'Menu Items 1',
    parentKey: 'menu-items'
  }, {
    key: 'menu-items-2',
    label: 'Menu Items 2',
    parentKey: 'menu-items',
    children: [{
      key: 'menu sub item',
      label: 'Menu Sub Item',
      parentKey: 'menu-items-2'
    }]
  }]
},
// ====================disable-items===============
{
  key: ' Disable Item',
  label: ' Disable Item',
  icon: 'solar:library-outline',
  isDisabled: true
}];