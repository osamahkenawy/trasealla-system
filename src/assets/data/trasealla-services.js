// Trasealla Travel Agency Services Configuration
// English and Arabic translations for all services

export const TRASEALLA_SERVICES = {
  // Core Services
  flightTickets: {
    id: 'flight-tickets',
    name: {
      en: 'Flight Tickets',
      ar: 'تذاكر الطيران'
    },
    description: {
      en: 'Domestic & International flight booking with flexible fares',
      ar: 'حجز رحلات داخلية ودولية مع أفضل الأسعار'
    },
    icon: 'solar:airplane-outline',
    services: [
      {
        name: { en: 'Domestic Flights', ar: 'رحلات داخلية' },
        description: { en: 'UAE domestic flights', ar: 'رحلات داخل الإمارات' }
      },
      {
        name: { en: 'International Flights', ar: 'رحلات دولية' },
        description: { en: 'Worldwide flight bookings', ar: 'حجز رحلات عالمية' }
      },
      {
        name: { en: 'Flexible Fares', ar: 'أسعار مرنة' },
        description: { en: 'Date changes and modifications', ar: 'تغيير المواعيد والتعديلات' }
      },
      {
        name: { en: 'Add-ons', ar: 'إضافات' },
        description: { en: 'Baggage, seats, meals', ar: 'أمتعة، مقاعد، وجبات' }
      }
    ]
  },

  visaServices: {
    id: 'visa-services',
    name: {
      en: 'Visa Services',
      ar: 'خدمات التأشيرات'
    },
    description: {
      en: 'Complete visa processing for UAE, Schengen, and International destinations',
      ar: 'معالجة التأشيرات الكاملة للإمارات وشنغن والدول الأخرى'
    },
    icon: 'solar:passport-outline',
    services: [
      {
        category: { en: 'UAE Visas', ar: 'تأشيرات الإمارات' },
        items: [
          { name: { en: 'Tourist (30/60/90 days)', ar: 'تأشيرة سياحية (٣٠/٦٠/٩٠ يوم)' } },
          { name: { en: 'Business', ar: 'تأشيرة عمل/أعمال' } },
          { name: { en: 'Transit (48/96 hours)', ar: 'تأشيرة ترانزيت (٤٨/٩٦ ساعة)' } },
          { name: { en: 'Family / Visit', ar: 'تأشيرة زيارة/عائلية' } }
        ]
      },
      {
        category: { en: 'Schengen Visas', ar: 'تأشيرات شنغن' },
        items: [
          { name: { en: 'Tourist', ar: 'تأشيرة سياحية' } },
          { name: { en: 'Business (invitation support)', ar: 'تأشيرة أعمال (مع خطابات الدعوة)' } }
        ]
      },
      {
        category: { en: 'International Visas', ar: 'التأشيرات الدولية' },
        items: [
          { name: { en: 'UK (visitor & study)', ar: 'بريطانيا (زيارة ودراسة)' } },
          { name: { en: 'USA (B1/B2)', ar: 'أمريكا (B1/B2)' } },
          { name: { en: 'Canada (visitor & study)', ar: 'كندا (زيارة ودراسة)' } },
          { name: { en: 'Turkey e-Visa', ar: 'تركيا e-Visa' } },
          { name: { en: 'Georgia e-Visa', ar: 'جورجيا e-Visa' } },
          { name: { en: 'Malaysia (eVISA/eNTRI)', ar: 'ماليزيا (eVISA/eNTRI)' } }
        ]
      }
    ]
  },

  uaeResidency: {
    id: 'uae-residency',
    name: {
      en: 'UAE Residency',
      ar: 'الإقامة في الإمارات'
    },
    description: {
      en: 'Complete UAE residency solutions including Golden Visa',
      ar: 'حلول الإقامة الكاملة في الإمارات بما في ذلك التأشيرة الذهبية'
    },
    icon: 'solar:home-outline',
    services: [
      {
        name: { en: 'Employment Residence', ar: 'إقامة عمل' },
        description: { en: 'Work permit and Emirates ID', ar: 'تصريح عمل وبطاقة هوية إماراتية' }
      },
      {
        name: { en: 'Investor/Partner Residence', ar: 'إقامة مستثمر/شريك' },
        description: { en: 'With company setup support', ar: 'مع دعم تأسيس الشركات' }
      },
      {
        name: { en: 'Family Sponsorship', ar: 'لمّ الشمل العائلي' },
        description: { en: 'Spouse, children, parents', ar: 'زوج/زوجة، أطفال، والدين' }
      },
      {
        name: { en: 'Golden Visa Assistance', ar: 'المساعدة في التأشيرة الذهبية' },
        description: { en: '10-year residence categories', ar: 'فئات الإقامة لمدة ١٠ سنوات' }
      }
    ]
  },

  educationTravel: {
    id: 'education-travel',
    name: {
      en: 'Education Travel',
      ar: 'السفر التعليمي'
    },
    description: {
      en: 'Study abroad programs and visa support',
      ar: 'برامج الدراسة بالخارج ودعم التأشيرات'
    },
    icon: 'solar:graduation-outline',
    services: [
      {
        name: { en: 'UK (London)', ar: 'بريطانيا (لندن)' },
        description: { en: 'University options, CAS/visa file', ar: 'خيارات الجامعات وملفات الفيزا' }
      },
      {
        name: { en: 'Europe', ar: 'أوروبا' },
        description: { en: 'Germany, France, Netherlands pathways', ar: 'مسارات ألمانيا، فرنسا، هولندا' }
      },
      {
        name: { en: 'Australia', ar: 'أستراليا' },
        description: { en: 'Universities & student visas', ar: 'الجامعات وتأشيرات الطلاب' }
      },
      {
        name: { en: 'New Zealand', ar: 'نيوزيلندا' },
        description: { en: 'Universities & student visas', ar: 'الجامعات وتأشيرات الطلاب' }
      },
      {
        name: { en: 'Brazil', ar: 'البرازيل' },
        description: { en: 'Language/exchange programs', ar: 'برامج تبادل لغوي وتعليمي' }
      }
    ]
  },

  immigration: {
    id: 'immigration',
    name: {
      en: 'Immigration Pathways',
      ar: 'الهجرة'
    },
    description: {
      en: 'Permanent residence and immigration solutions',
      ar: 'حلول الإقامة الدائمة والهجرة'
    },
    icon: 'solar:globe-outline',
    services: [
      {
        name: { en: 'Brazil Immigration', ar: 'الهجرة إلى البرازيل' },
        description: { en: 'Work/residency routes', ar: 'مسارات العمل/الإقامة' }
      },
      {
        name: { en: 'Australia Immigration', ar: 'الهجرة إلى أستراليا' },
        description: { en: 'Skilled/PR pathways', ar: 'مسارات الهجرة المهنية/الإقامة الدائمة' }
      },
      {
        name: { en: 'New Zealand Immigration', ar: 'الهجرة إلى نيوزيلندا' },
        description: { en: 'Skilled/PR pathways', ar: 'مسارات الهجرة المهنية/الإقامة الدائمة' }
      }
    ]
  },

  tourPackages: {
    id: 'tour-packages',
    name: {
      en: 'Tour Packages',
      ar: 'الباقات السياحية'
    },
    description: {
      en: 'Curated travel experiences to amazing destinations',
      ar: 'تجارب سفر منظمة إلى وجهات مذهلة'
    },
    icon: 'solar:map-point-outline',
    services: [
      {
        destination: { en: 'Egypt', ar: 'مصر' },
        packages: [
          { name: { en: 'Cairo & Giza', ar: 'القاهرة والجيزة' }, description: { en: 'Pyramids & museums', ar: 'الأهرامات والمتاحف' } },
          { name: { en: 'Sharm El Sheikh', ar: 'شرم الشيخ' }, description: { en: 'Beach & diving', ar: 'الشواطئ والغوص' } },
          { name: { en: 'Nile Cruise', ar: 'رحلة نيلية' }, description: { en: 'Luxor & Aswan', ar: 'الأقصر وأسوان' } }
        ]
      },
      {
        destination: { en: 'Morocco', ar: 'المغرب' },
        packages: [
          { name: { en: 'Casablanca & Rabat', ar: 'الدار البيضاء والرباط' } },
          { name: { en: 'Marrakech', ar: 'مراكش' }, description: { en: 'Souks & culture', ar: 'الأسواق والثقافة' } },
          { name: { en: 'Sahara Desert', ar: 'صحراء المغرب' }, description: { en: 'Merzouga / Erg Chebbi', ar: 'مرزوكة / عرق الشبي' } }
        ]
      },
      {
        destination: { en: 'Black Sea', ar: 'البحر الأسود' },
        packages: [
          { name: { en: 'Turkey', ar: 'تركيا' }, description: { en: 'Trabzon, Rize, Uzungöl', ar: 'طرابزون، ريزه، أوزنجول' } },
          { name: { en: 'Georgia', ar: 'جورجيا' }, description: { en: 'Batumi, Kobuleti', ar: 'باتومي، كوبوليتسي' } },
          { name: { en: 'Bulgaria', ar: 'بلغاريا' }, description: { en: 'Varna, Burgas', ar: 'فارنا، بورغاس' } },
          { name: { en: 'Romania', ar: 'رومانيا' }, description: { en: 'Constanța, Mamaia', ar: 'كونستانتسا، مامايا' } }
        ]
      }
    ]
  },

  addOns: {
    id: 'add-ons',
    name: {
      en: 'Add-ons & Travel Support',
      ar: 'خدمات إضافية ودعم السفر'
    },
    description: {
      en: 'Complete travel support services',
      ar: 'خدمات دعم السفر الكاملة'
    },
    icon: 'solar:settings-outline',
    services: [
      {
        name: { en: 'Hotel Bookings', ar: 'حجز الفنادق' },
        description: { en: 'Worldwide hotel reservations', ar: 'حجز فنادق عالميًا' }
      },
      {
        name: { en: 'Travel Insurance', ar: 'تأمين السفر' },
        description: { en: 'Schengen-compliant insurance', ar: 'تأمين متوافق مع شنغن' }
      },
      {
        name: { en: 'Airport Transfers', ar: 'خدمات النقل' },
        description: { en: 'Private/shared transfers', ar: 'نقل خاص/مشترك' }
      },
      {
        name: { en: 'Custom Itineraries', ar: 'خطط سياحية مخصصة' },
        description: { en: 'Day-by-day planning', ar: 'تخطيط يومي' }
      },
      {
        name: { en: 'Group & Corporate', ar: 'المجموعات والشركات' },
        description: { en: 'MICE travel solutions', ar: 'حلول سفر المؤتمرات' }
      },
      {
        name: { en: 'Honeymoon Packages', ar: 'باقات شهر العسل' },
        description: { en: 'Romantic getaways', ar: 'رحلات رومانسية' }
      },
      {
        name: { en: 'Meet & Greet', ar: 'خدمات الاستقبال' },
        description: { en: 'Airport lounge access', ar: 'وصول لصالات المطار' }
      },
      {
        name: { en: 'SIM/eSIM', ar: 'شرائح الاتصال' },
        description: { en: 'Data packs for travel', ar: 'باقات إنترنت للسفر' }
      },
      {
        name: { en: 'Car Rentals', ar: 'تأجير السيارات' },
        description: { en: 'Self-drive & chauffeured', ar: 'قيادة ذاتية وسائق خاص' }
      }
    ]
  }
};

// Additional Services
export const ADDITIONAL_SERVICES = {
  hajjUmrah: {
    id: 'hajj-umrah',
    name: {
      en: 'Hajj & Umrah Packages',
      ar: 'باقات الحج والعمرة'
    },
    description: {
      en: 'Complete Hajj and Umrah travel solutions',
      ar: 'حلول سفر الحج والعمرة الكاملة'
    },
    icon: 'solar:mosque-outline',
    services: [
      { name: { en: 'Visa Support', ar: 'دعم التأشيرات' } },
      { name: { en: 'Flights', ar: 'الطيران' } },
      { name: { en: 'Hotels in Makkah & Madinah', ar: 'فنادق مكة والمدينة' } },
      { name: { en: 'Transportation', ar: 'المواصلات' } }
    ]
  },

  cruiseHolidays: {
    id: 'cruise-holidays',
    name: {
      en: 'Cruise Holidays',
      ar: 'الرحلات البحرية'
    },
    description: {
      en: 'Luxury cruise experiences',
      ar: 'تجارب كروز فاخرة'
    },
    icon: 'solar:ship-outline',
    services: [
      { name: { en: 'Dubai/Abu Dhabi Cruises', ar: 'كروز دبي/أبوظبي' } },
      { name: { en: 'Mediterranean Cruises', ar: 'كروز البحر المتوسط' } },
      { name: { en: 'Caribbean Cruises', ar: 'كروز الكاريبي' } }
    ]
  },

  adventureTravel: {
    id: 'adventure-travel',
    name: {
      en: 'Adventure & Niche Travel',
      ar: 'السياحة المغامراتية والمتخصصة'
    },
    description: {
      en: 'Specialized travel experiences',
      ar: 'تجارب سفر متخصصة'
    },
    icon: 'solar:mountain-outline',
    services: [
      { name: { en: 'Desert Safaris', ar: 'رحلات السفاري الصحراوية' } },
      { name: { en: 'Ski Trips', ar: 'رحلات التزلج' } },
      { name: { en: 'Halal-friendly Travel', ar: 'السياحة الصديقة للحلال' } }
    ]
  },

  corporateTravel: {
    id: 'corporate-travel',
    name: {
      en: 'Corporate Travel Solutions',
      ar: 'خدمات السفر للشركات'
    },
    description: {
      en: 'Business travel management',
      ar: 'إدارة السفر للشركات'
    },
    icon: 'solar:briefcase-outline',
    services: [
      { name: { en: 'Company Retreats', ar: 'رحلات الشركات' } },
      { name: { en: 'Events & Incentives', ar: 'الفعاليات والحوافز' } },
      { name: { en: 'Travel Management', ar: 'إدارة السفر' } }
    ]
  },

  luxuryServices: {
    id: 'luxury-services',
    name: {
      en: 'Luxury & VIP Services',
      ar: 'السياحة الفاخرة والخدمات الخاصة'
    },
    description: {
      en: 'Premium travel experiences',
      ar: 'تجارب سفر متميزة'
    },
    icon: 'solar:crown-outline',
    services: [
      { name: { en: 'Private Jets', ar: 'الطائرات الخاصة' } },
      { name: { en: 'Yacht Rentals', ar: 'تأجير اليخوت' } },
      { name: { en: 'Luxury Villas', ar: 'الفيلات الفاخرة' } },
      { name: { en: 'Concierge Services', ar: 'خدمات الكونسيرج' } }
    ]
  }
};

// Website Features
export const WEBSITE_FEATURES = {
  visaChecker: {
    name: { en: 'Dynamic Visa Checker', ar: 'أداة فحص التأشيرات' },
    description: { en: 'Select country to see requirements, documents, cost, processing time', ar: 'اختر الدولة لرؤية المتطلبات والمستندات والتكلفة والمدة' }
  },
  packageBuilder: {
    name: { en: 'Package Builder', ar: 'أداة بناء الباقة' },
    description: { en: 'Mix flight + hotel + visa + insurance', ar: 'دمج تذكرة + فندق + تأشيرة + تأمين' }
  },
  multiLanguage: {
    name: { en: 'Multi-language Support', ar: 'دعم لغتين' },
    description: { en: 'English & Arabic (essential for UAE)', ar: 'عربي + إنجليزي (ضروري لسوق الإمارات)' }
  },
  whatsappIntegration: {
    name: { en: 'WhatsApp Integration', ar: 'ربط واتساب' },
    description: { en: 'Direct inquiries via WhatsApp', ar: 'استفسارات مباشرة عبر واتساب' }
  },
  paymentGateway: {
    name: { en: 'Online Payment', ar: 'دفع إلكتروني' },
    description: { en: 'Credit card & Apple Pay for bookings', ar: 'بطاقة ائتمان و Apple Pay للحجوزات' }
  },
  customerDashboard: {
    name: { en: 'Customer Dashboard', ar: 'لوحة تحكم العميل' },
    description: { en: 'Track visa status, bookings, and invoices', ar: 'متابعة حالة التأشيرة والحجوزات والفواتير' }
  }
};

// Content Ideas
export const CONTENT_STRATEGY = {
  testimonials: {
    name: { en: 'Testimonials & Case Studies', ar: 'آراء العملاء وتجاربهم' },
    description: { en: 'Photos of travelers, student success stories', ar: 'صور الرحلات وقصص نجاح الطلاب' }
  },
  travelBlog: {
    name: { en: 'Travel Blog & Guides', ar: 'مدونة سياحية' },
    description: { en: 'Visa updates, study abroad tips, destination guides', ar: 'تحديثات التأشيرات، نصائح الدراسة، دليل الوجهات' }
  },
  faq: {
    name: { en: 'FAQ Section', ar: 'صفحة الأسئلة الشائعة' },
    description: { en: 'Visa timelines, Schengen insurance, refund policy', ar: 'مدة التأشيرة، متطلبات شنغن، سياسة الاسترداد' }
  },
  socialMedia: {
    name: { en: 'Social Media Integration', ar: 'ربط السوشيال ميديا' },
    description: { en: 'Instagram trip highlights, TikTok reels', ar: 'إنستغرام، تيك توك' }
  },
  certifications: {
    name: { en: 'Certifications & Licenses', ar: 'التراخيص والشهادات' },
    description: { en: 'UAE tourism license, IATA partnerships', ar: 'رخصة سياحية، شراكات IATA' }
  }
};

// Business Expansion
export const BUSINESS_EXPANSION = {
  partnerships: {
    name: { en: 'Airline & University Partnerships', ar: 'شراكات شركات الطيران والجامعات' },
    description: { en: 'Discounts & referral income', ar: 'خصومات ودخل الإحالة' }
  },
  franchise: {
    name: { en: 'Franchise/Branch Model', ar: 'نموذج الامتياز/الفروع' },
    description: { en: 'Open in Sharjah, Ajman, or Cairo', ar: 'فتح في الشارقة، عجمان، أو القاهرة' }
  },
  b2b: {
    name: { en: 'B2B Collaborations', ar: 'التعاون B2B' },
    description: { en: 'Sub-agencies or corporate tie-ups', ar: 'وكالات فرعية أو شراكات شركات' }
  },
  technology: {
    name: { en: 'Technology Tools', ar: 'أدوات التكنولوجيا' },
    description: { en: 'Amadeus / Galileo integration for ticketing', ar: 'تكامل Amadeus / Galileo للحجز' }
  }
};

export default TRASEALLA_SERVICES;
