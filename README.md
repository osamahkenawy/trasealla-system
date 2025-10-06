# Trasealla - Travel Agency Admin Dashboard

**Trasealla** is a comprehensive travel agency management system built with Next.js, designed to handle all aspects of travel services including flight bookings, visa services, UAE residency, education travel, immigration, and tour packages.

## 🌟 Features

### Core Services
- **Flight Tickets**: Domestic & International flight booking with flexible fares
- **Visa Services**: UAE, Schengen, and International visa processing
- **UAE Residency**: Employment, investor, family sponsorship, and Golden Visa assistance
- **Education Travel**: Study abroad programs and visa support
- **Immigration Pathways**: Brazil, Australia, and New Zealand immigration
- **Tour Packages**: Egypt, Morocco, Black Sea destinations
- **Add-ons**: Hotels, insurance, transfers, and travel support

### Admin Dashboard Features
- **Multi-language Support**: English and Arabic
- **Responsive Design**: Works on all devices
- **Modern UI**: Built with Bootstrap 5 and custom SCSS
- **Interactive Charts**: ApexCharts integration for analytics
- **Form Management**: Advanced form handling with validation
- **File Upload**: Support for document uploads
- **Maps Integration**: Google Maps and Vector Maps
- **Data Tables**: Advanced table management with GridJS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Taplox-Next_v1.0/JS
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin dashboard pages
│   │   ├── dashboards/    # Dashboard components
│   │   ├── forms/         # Form pages
│   │   ├── tables/        # Data tables
│   │   ├── base-ui/       # UI components
│   │   └── ...
│   └── (other)/           # Other pages (auth, errors)
├── assets/                # Static assets
│   ├── data/             # Configuration data
│   ├── images/           # Images and icons
│   └── scss/             # Stylesheets
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── from/             # Form components
│   └── ...
├── context/              # React contexts
├── hooks/                # Custom hooks
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

## 🛠 Technology Stack

- **Framework**: Next.js 14
- **Language**: JavaScript/TypeScript
- **Styling**: Bootstrap 5 + SCSS
- **Charts**: ApexCharts
- **Maps**: Google Maps, Vector Maps
- **Forms**: React Hook Form + Yup validation
- **Icons**: Iconify
- **State Management**: React Context
- **Build Tool**: Next.js built-in

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🌍 Services Overview

### 1. Flight Tickets
- Domestic & International bookings
- Flexible date changes
- Add-ons (baggage, seats)

### 2. Visa Services
- **UAE Visas**: Tourist, Business, Transit, Family
- **Schengen Visas**: Tourist, Business
- **International**: UK, USA, Canada, Turkey, Georgia, Malaysia

### 3. UAE Residency
- Employment residence
- Investor/Partner residence
- Family sponsorship
- Golden Visa assistance

### 4. Education Travel
- UK (London focus)
- Europe (Germany, France, Netherlands)
- Australia & New Zealand
- Brazil language programs

### 5. Immigration
- Brazil immigration routes
- Australia skilled migration
- New Zealand PR pathways

### 6. Tour Packages
- **Egypt**: Cairo, Giza, Sharm El Sheikh, Nile Cruise
- **Morocco**: Casablanca, Marrakech, Sahara Desert
- **Black Sea**: Turkey, Georgia, Bulgaria, Romania

### 7. Additional Services
- Hotel bookings worldwide
- Travel insurance
- Airport transfers
- Custom itineraries
- Group & corporate travel
- Honeymoon packages
- Meet & Greet services
- SIM/eSIM data packs
- Car rentals

## 🔧 Configuration

### Menu Items
Menu configuration is located in `src/assets/data/menu-items.js`. You can customize the navigation structure by modifying this file.

### Styling
The project uses SCSS for styling. Main styles are in `src/assets/scss/style.scss` with component-specific styles in the `components/` directory.

### Icons
Icons are provided by Iconify. You can browse available icons at [iconify.design](https://iconify.design).

## 🌐 Multi-language Support

The application supports both English and Arabic languages. Language files and translations can be added to the `src/assets/data/` directory.

## 📱 Responsive Design

The admin dashboard is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Authentication

The application includes authentication pages:
- Sign In
- Sign Up
- Reset Password
- Lock Screen

## 📊 Analytics & Reporting

Built-in analytics features include:
- Dashboard with key metrics
- Interactive charts and graphs
- Data visualization
- Export capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS
- DigitalOcean
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries:
- Email: support@trasealla.com
- Website: [www.trasealla.com](https://www.trasealla.com)

## 🔄 Version History

- **v1.0.0** - Initial release with core travel agency features
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced admin dashboard features

---

**Trasealla** - Your trusted partner for all travel needs in the UAE and beyond.