# StatCard Component - Usage Examples

## 🚀 **Quick Start**

```javascript
import StatCard from '@/components/StatCard';

// Basic usage
<StatCard
  title="Total Users"
  value="1,234"
  imageUrl="/assets/images/icons/users-icon.svg"
/>
```

## 📊 **Dashboard Examples**

### **User Statistics**
```javascript
<Row className="g-3">
  <Col md={3}>
    <StatCard
      title="Total Users"
      value="1,234"
      imageUrl="/assets/images/icons/users-icon.svg"
      textColor="#101828"
      className="primary"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="Active Users"
      value="987"
      imageUrl="/assets/images/icons/active-users-icon.svg"
      textColor="#198754"
      className="success"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="New Users"
      value="56"
      imageUrl="/assets/images/icons/new-users-icon.svg"
      textColor="#0D6EFD"
      className="info"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="Banned Users"
      value="12"
      imageUrl="/assets/images/icons/banned-users-icon.svg"
      textColor="#DC3545"
      className="danger"
    />
  </Col>
</Row>
```

### **Sales Statistics**
```javascript
<Row className="g-3">
  <Col md={4}>
    <StatCard
      title="Total Revenue"
      value="$12,345"
      imageUrl="/assets/images/icons/revenue-icon.svg"
      textColor="#198754"
      className="success"
    />
  </Col>
  <Col md={4}>
    <StatCard
      title="Orders"
      value="456"
      imageUrl="/assets/images/icons/orders-icon.svg"
      textColor="#0D6EFD"
      className="primary"
    />
  </Col>
  <Col md={4}>
    <StatCard
      title="Average Order"
      value="$27.08"
      imageUrl="/assets/images/icons/average-order-icon.svg"
      textColor="#FD7E14"
      className="warning"
    />
  </Col>
</Row>
```

### **System Statistics**
```javascript
<Row className="g-3">
  <Col md={2}>
    <StatCard
      title="CPU Usage"
      value="45%"
      imageUrl="/assets/images/icons/cpu-icon.svg"
      textColor="#198754"
      className="success"
    />
  </Col>
  <Col md={2}>
    <StatCard
      title="Memory"
      value="78%"
      imageUrl="/assets/images/icons/memory-icon.svg"
      textColor="#FD7E14"
      className="warning"
    />
  </Col>
  <Col md={2}>
    <StatCard
      title="Disk Space"
      value="23%"
      imageUrl="/assets/images/icons/disk-icon.svg"
      textColor="#198754"
      className="success"
    />
  </Col>
  <Col md={2}>
    <StatCard
      title="Network"
      value="12%"
      imageUrl="/assets/images/icons/network-icon.svg"
      textColor="#0D6EFD"
      className="info"
    />
  </Col>
  <Col md={2}>
    <StatCard
      title="Uptime"
      value="99.9%"
      imageUrl="/assets/images/icons/uptime-icon.svg"
      textColor="#198754"
      className="success"
    />
  </Col>
  <Col md={2}>
    <StatCard
      title="Errors"
      value="3"
      imageUrl="/assets/images/icons/error-icon.svg"
      textColor="#DC3545"
      className="danger"
    />
  </Col>
</Row>
```

## 🎨 **Color Variants**

### **Primary (Blue)**
```javascript
<StatCard
  title="Primary Card"
  value="123"
  imageUrl="/assets/images/icons/icon.svg"
  className="primary"
/>
```

### **Success (Green)**
```javascript
<StatCard
  title="Success Card"
  value="456"
  imageUrl="/assets/images/icons/icon.svg"
  className="success"
/>
```

### **Warning (Orange)**
```javascript
<StatCard
  title="Warning Card"
  value="789"
  imageUrl="/assets/images/icons/icon.svg"
  className="warning"
/>
```

### **Danger (Red)**
```javascript
<StatCard
  title="Danger Card"
  value="012"
  imageUrl="/assets/images/icons/icon.svg"
  className="danger"
/>
```

### **Info (Light Blue)**
```javascript
<StatCard
  title="Info Card"
  value="345"
  imageUrl="/assets/images/icons/icon.svg"
  className="info"
/>
```

### **Secondary (Gray)**
```javascript
<StatCard
  title="Secondary Card"
  value="678"
  imageUrl="/assets/images/icons/icon.svg"
  className="secondary"
/>
```

## 🎯 **Custom Colors**

```javascript
// Custom text color
<StatCard
  title="Custom Color"
  value="999"
  imageUrl="/assets/images/icons/icon.svg"
  textColor="#FF6B6B"
/>

// Custom purple theme
<StatCard
  title="Purple Theme"
  value="888"
  imageUrl="/assets/images/icons/icon.svg"
  textColor="#8B5CF6"
  className="custom-purple"
/>
```

## 📱 **Responsive Layouts**

### **Mobile-First Grid**
```javascript
<Row className="g-3">
  <Col xs={6} md={3}>
    <StatCard title="Mobile 1" value="123" imageUrl="/icon.svg" />
  </Col>
  <Col xs={6} md={3}>
    <StatCard title="Mobile 2" value="456" imageUrl="/icon.svg" />
  </Col>
  <Col xs={6} md={3}>
    <StatCard title="Mobile 3" value="789" imageUrl="/icon.svg" />
  </Col>
  <Col xs={6} md={3}>
    <StatCard title="Mobile 4" value="012" imageUrl="/icon.svg" />
  </Col>
</Row>
```

### **Flexible Columns**
```javascript
<Row className="g-3">
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 1" value="123" imageUrl="/icon.svg" />
  </Col>
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 2" value="456" imageUrl="/icon.svg" />
  </Col>
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 3" value="789" imageUrl="/icon.svg" />
  </Col>
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 4" value="012" imageUrl="/icon.svg" />
  </Col>
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 5" value="345" imageUrl="/icon.svg" />
  </Col>
  <Col lg={2} md={4} sm={6}>
    <StatCard title="Flex 6" value="678" imageUrl="/icon.svg" />
  </Col>
</Row>
```

## 🔧 **Advanced Usage**

### **With Click Handler**
```javascript
<StatCard
  title="Clickable Card"
  value="123"
  imageUrl="/assets/images/icons/icon.svg"
  onClick={() => console.log('Card clicked!')}
  style={{ cursor: 'pointer' }}
/>
```

### **With Custom Styling**
```javascript
<StatCard
  title="Custom Styled"
  value="456"
  imageUrl="/assets/images/icons/icon.svg"
  className="custom-card"
  style={{ 
    border: '2px solid #FF6B6B',
    borderRadius: '16px'
  }}
/>
```

### **With Loading State**
```javascript
const [loading, setLoading] = useState(true);

<StatCard
  title="Loading Card"
  value={loading ? "..." : "789"}
  imageUrl="/assets/images/icons/icon.svg"
  className={loading ? "loading" : ""}
/>
```

## 🎨 **Custom SCSS Variants**

```scss
// Custom purple variant
.custom-stat-card.custom-purple {
  .image-wrapper {
    border-color: #C4B5FD;
    background: #F3F4F6;
  }
}

// Custom gradient variant
.custom-stat-card.gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .title {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .value {
    color: white;
  }
  
  .image-wrapper {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
}
```

## 🎉 **Best Practices**

1. **Consistent Icons**: Use the same icon style across all cards
2. **Meaningful Colors**: Choose colors that represent the data type
3. **Responsive Design**: Always use Bootstrap grid system
4. **Accessibility**: Ensure good contrast ratios
5. **Performance**: Use optimized SVG icons
6. **Consistency**: Use the same spacing and typography

---

**Ready to use**: The StatCard component is now available throughout your application! 🚀
