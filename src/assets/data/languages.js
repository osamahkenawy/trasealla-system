// Language configuration for Trasealla Travel Agency
// Supports English and Arabic

export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇦🇪'
  }
};

export const DEFAULT_LANGUAGE = 'en';

// Common translations
export const TRANSLATIONS = {
  // Navigation
  dashboard: {
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  services: {
    en: 'Services',
    ar: 'الخدمات'
  },
  management: {
    en: 'Management',
    ar: 'الإدارة'
  },
  reports: {
    en: 'Reports',
    ar: 'التقارير'
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  
  // Common actions
  add: {
    en: 'Add',
    ar: 'إضافة'
  },
  edit: {
    en: 'Edit',
    ar: 'تعديل'
  },
  delete: {
    en: 'Delete',
    ar: 'حذف'
  },
  save: {
    en: 'Save',
    ar: 'حفظ'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  search: {
    en: 'Search',
    ar: 'بحث'
  },
  filter: {
    en: 'Filter',
    ar: 'تصفية'
  },
  export: {
    en: 'Export',
    ar: 'تصدير'
  },
  import: {
    en: 'Import',
    ar: 'استيراد'
  },
  
  // Status
  active: {
    en: 'Active',
    ar: 'نشط'
  },
  inactive: {
    en: 'Inactive',
    ar: 'غير نشط'
  },
  pending: {
    en: 'Pending',
    ar: 'في الانتظار'
  },
  approved: {
    en: 'Approved',
    ar: 'موافق عليه'
  },
  rejected: {
    en: 'Rejected',
    ar: 'مرفوض'
  },
  
  // Travel specific
  booking: {
    en: 'Booking',
    ar: 'حجز'
  },
  customer: {
    en: 'Customer',
    ar: 'عميل'
  },
  payment: {
    en: 'Payment',
    ar: 'دفع'
  },
  visa: {
    en: 'Visa',
    ar: 'تأشيرة'
  },
  flight: {
    en: 'Flight',
    ar: 'رحلة'
  },
  hotel: {
    en: 'Hotel',
    ar: 'فندق'
  },
  tour: {
    en: 'Tour',
    ar: 'جولة'
  },
  
  // Time
  today: {
    en: 'Today',
    ar: 'اليوم'
  },
  yesterday: {
    en: 'Yesterday',
    ar: 'أمس'
  },
  tomorrow: {
    en: 'Tomorrow',
    ar: 'غداً'
  },
  thisWeek: {
    en: 'This Week',
    ar: 'هذا الأسبوع'
  },
  thisMonth: {
    en: 'This Month',
    ar: 'هذا الشهر'
  },
  thisYear: {
    en: 'This Year',
    ar: 'هذا العام'
  },
  
  // Messages
  success: {
    en: 'Success',
    ar: 'نجح'
  },
  error: {
    en: 'Error',
    ar: 'خطأ'
  },
  warning: {
    en: 'Warning',
    ar: 'تحذير'
  },
  info: {
    en: 'Information',
    ar: 'معلومات'
  },
  loading: {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  noData: {
    en: 'No data available',
    ar: 'لا توجد بيانات متاحة'
  },
  
  // Form labels
  name: {
    en: 'Name',
    ar: 'الاسم'
  },
  email: {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  phone: {
    en: 'Phone',
    ar: 'الهاتف'
  },
  address: {
    en: 'Address',
    ar: 'العنوان'
  },
  date: {
    en: 'Date',
    ar: 'التاريخ'
  },
  time: {
    en: 'Time',
    ar: 'الوقت'
  },
  price: {
    en: 'Price',
    ar: 'السعر'
  },
  total: {
    en: 'Total',
    ar: 'المجموع'
  },
  status: {
    en: 'Status',
    ar: 'الحالة'
  },
  description: {
    en: 'Description',
    ar: 'الوصف'
  },
  
  // Trasealla specific
  trasealla: {
    en: 'Trasealla',
    ar: 'تراسيلا'
  },
  fullServices: {
    en: 'Full Services',
    ar: 'خدمات كاملة'
  },
  travelAgency: {
    en: 'Travel Agency',
    ar: 'وكالة سفر'
  },
  uae: {
    en: 'UAE',
    ar: 'الإمارات'
  },
  domestic: {
    en: 'Domestic',
    ar: 'داخلي'
  },
  international: {
    en: 'International',
    ar: 'دولي'
  },
  tourist: {
    en: 'Tourist',
    ar: 'سياحي'
  },
  business: {
    en: 'Business',
    ar: 'أعمال'
  },
  transit: {
    en: 'Transit',
    ar: 'ترانزيت'
  },
  family: {
    en: 'Family',
    ar: 'عائلي'
  },
  study: {
    en: 'Study',
    ar: 'دراسة'
  },
  work: {
    en: 'Work',
    ar: 'عمل'
  },
  residence: {
    en: 'Residence',
    ar: 'إقامة'
  },
  goldenVisa: {
    en: 'Golden Visa',
    ar: 'التأشيرة الذهبية'
  }
};

// Helper function to get translation
export const getTranslation = (key, language = DEFAULT_LANGUAGE) => {
  const keys = key.split('.');
  let translation = TRANSLATIONS;
  
  for (const k of keys) {
    translation = translation?.[k];
    if (!translation) return key;
  }
  
  return translation?.[language] || translation?.[DEFAULT_LANGUAGE] || key;
};

// Helper function to get current language direction
export const getLanguageDirection = (language = DEFAULT_LANGUAGE) => {
  return LANGUAGES[language]?.direction || 'ltr';
};

// Helper function to get language flag
export const getLanguageFlag = (language = DEFAULT_LANGUAGE) => {
  return LANGUAGES[language]?.flag || '🇺🇸';
};

export default TRANSLATIONS;
