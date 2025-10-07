# StatCard Component - Reusable Statistics Card

## 🎯 **Component Overview**

The `StatCard` component is a reusable React component that matches the Vue.js custom card design you provided. It displays statistics with a title, value, and icon in a clean, professional layout.

## 📁 **Files Created**

### **1. Component File**
- `src/components/StatCard.jsx` - Main React component

### **2. Styles File**
- `src/assets/scss/components/_stat-card.scss` - Component styles

### **3. Icon Assets**
- `public/assets/images/icons/inbox-icon.svg`
- `public/assets/images/icons/plus-circle-icon.svg`
- `public/assets/images/icons/clock-icon.svg`
- `public/assets/images/icons/check-circle-icon.svg`
- `public/assets/images/icons/x-circle-icon.svg`

## 🎨 **Design Features**

### **Visual Design**
- **Border Radius**: 12px for modern look
- **Border**: 1px solid #EAECF0
- **Background**: White (#FFF)
- **Shadow**: Subtle 0px 1px 2px rgba(16, 24, 40, 0.05)
- **Padding**: 16px for comfortable spacing

### **Layout Structure**
- **Left Content**: Title and value stacked vertically
- **Right Content**: Circular icon container
- **Flex Layout**: Space-between alignment
- **Responsive**: Adapts to different screen sizes

### **Typography**
- **Title**: 16px, medium weight, #344054 color
- **Value**: 24px, bold weight, customizable color
- **Line Heights**: Optimized for readability

### **Icon Container**
- **Size**: 48px × 48px circular container
- **Background**: Light blue (#F0F9FF)
- **Border**: Light blue border (#D1E9FF)
- **Icon Size**: 24px × 24px centered

## 🔧 **Component Props**

```javascript
<StatCard
  imageUrl={string}        // Required: Path to icon image
  title={string}           // Required: Card title text
  value={string|number}    // Required: Display value
  textColor={string}       // Optional: Value text color (default: #101828)
  className={string}       // Optional: Additional CSS classes
  {...props}               // Optional: Additional props passed to Card
/>
```

## 🎨 **Color Variants**

The component supports different color variants:

```javascript
// Available variants
<StatCard className="primary" />   // Blue theme
<StatCard className="success" />   // Green theme
<StatCard className="warning" />   // Orange theme
<StatCard className="danger" />    // Red theme
<StatCard className="info" />      // Light blue theme
<StatCard className="secondary" /> // Gray theme
```

## 📱 **Responsive Design**

### **Desktop (≥768px)**
- Full horizontal layout
- 48px icon container
- 24px icon size

### **Tablet (576px - 767px)**
- Reduced padding (12px)
- Smaller icon container (40px)
- Smaller icon size (20px)

### **Mobile (<576px)**
- Vertical layout
- Icon positioned at bottom-right
- Optimized spacing

## 🚀 **Usage Examples**

### **Basic Usage**
```javascript
import StatCard from '@/components/StatCard';

<StatCard
  title="Total Contacts"
  value="1,234"
  imageUrl="/assets/images/icons/inbox-icon.svg"
/>
```

### **With Custom Color**
```javascript
<StatCard
  title="Revenue"
  value="$12,345"
  imageUrl="/assets/images/icons/dollar-icon.svg"
  textColor="#198754"
/>
```

### **With Variant**
```javascript
<StatCard
  title="Active Users"
  value="567"
  imageUrl="/assets/images/icons/users-icon.svg"
  className="success"
/>
```

## 🎯 **Integration in Contacts**

The StatCard component is now integrated into the ContactsStats component:

```javascript
// Before (Old Design)
<Card className="border-0 shadow-sm">
  <CardBody className="p-3">
    <div className="d-flex align-items-center">
      <div className="bg-primary rounded-circle p-2 me-3">
        <i className="bi-inbox text-white"></i>
      </div>
      <div>
        <h6 className="mb-0 text-muted small">Total Contacts</h6>
        <h4 className="mb-0 text-primary fw-bold">1,234</h4>
      </div>
    </div>
  </CardBody>
</Card>

// After (New StatCard Design)
<StatCard
  title="Total Contacts"
  value="1,234"
  imageUrl="/assets/images/icons/inbox-icon.svg"
  textColor="#101828"
  className="primary"
/>
```

## 🎨 **Visual Comparison**

### **Old Design**
- Bootstrap Card with custom styling
- Icon with background color
- Basic flex layout
- Limited customization

### **New Design**
- Custom StatCard component
- Circular icon container with border
- Professional spacing and typography
- Multiple color variants
- Responsive design
- Matches Vue.js design exactly

## 🔧 **Customization Options**

### **Colors**
```javascript
// Custom text color
<StatCard textColor="#FF6B6B" />

// Custom variant
<StatCard className="custom-variant" />
```

### **Styling**
```scss
// Custom variant in SCSS
.custom-stat-card.custom-variant {
  .image-wrapper {
    border-color: #FF6B6B;
    background: #FFF5F5;
  }
}
```

### **Additional Props**
```javascript
// Pass additional props to Card
<StatCard
  title="Custom Card"
  value="123"
  imageUrl="/icon.svg"
  onClick={handleClick}
  data-testid="custom-stat"
/>
```

## 📊 **Performance Benefits**

1. **Reusable**: Single component for all stat cards
2. **Consistent**: Uniform design across the application
3. **Maintainable**: Centralized styling and logic
4. **Responsive**: Built-in responsive design
5. **Accessible**: Proper semantic structure
6. **Optimized**: Next.js Image component for icons

## 🎉 **Result**

The StatCard component provides:
- ✅ **Exact match** to your Vue.js design
- ✅ **Reusable** across the entire application
- ✅ **Professional** appearance
- ✅ **Responsive** design
- ✅ **Customizable** colors and variants
- ✅ **Performance** optimized
- ✅ **Accessible** and semantic

The contacts page now uses these beautiful, consistent stat cards that match your design requirements perfectly!

---

**Created**: October 7, 2025  
**Status**: ✅ Complete  
**Integration**: ✅ Contacts page updated
