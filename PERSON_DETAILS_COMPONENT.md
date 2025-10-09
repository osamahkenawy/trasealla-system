# PersonDetails Component

A reusable React component for displaying person information with avatar, name, and contact details. Based on Vue.js template, fully converted to React with Bootstrap and Iconify icons.

## Features

✨ **Avatar Display**
- Photo URL support
- Automatic initials generation (max 2 letters)
- Gender-based styling with male/female indicators

👤 **Person Information**
- Name with tooltip for long names
- Optional description text
- Optional extra information field

📞 **Contact Icons**
- Email with tooltip
- Phone with tooltip  
- Address with tooltip
- Hover effects and visual feedback

🎨 **Styling**
- Gender-specific border colors and icons
- Male: Blue border with ♂ symbol
- Female: Pink border with ♀ symbol
- Responsive and accessible design

## Installation

The component uses:
- `react-bootstrap` (already in your project)
- `@iconify/react` (already in your project)
- Custom SCSS styles

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | string | ✅ Yes | - | Person's full name |
| `photo` | string | No | `''` | URL to person's photo |
| `description` | string | No | `''` | Description text below name |
| `iconOnly` | boolean | No | `false` | Show only avatar without details |
| `phone` | string | No | `''` | Phone number (shows phone icon) |
| `gender` | string/number | No | `''` | Gender: `1`/`'male'` or `2`/`'female'` |
| `email` | string | No | `''` | Email address (shows email icon) |
| `address` | string | No | `''` | Physical address (shows location icon) |
| `extra` | string | No | `''` | Extra info displayed between name and description |
| `onClick` | function | No | - | Click handler for the component |
| `maxNameLength` | number | No | `20` | Max name length before truncation |
| `className` | string | No | `''` | Additional CSS classes |

## Usage Examples

### Basic Usage (Name Only)

```jsx
import PersonDetails from '@/components/PersonDetails';

<PersonDetails 
  name="John Doe"
/>
```

### With Photo

```jsx
<PersonDetails 
  name="Jane Smith"
  photo="/assets/images/users/avatar-1.jpg"
/>
```

### With Contact Information (Male)

```jsx
<PersonDetails 
  name="Ahmed Hassan"
  gender="male"
  email="ahmed@example.com"
  phone="+971522200730"
  address="Dubai, UAE"
/>
```

### With Contact Information (Female)

```jsx
<PersonDetails 
  name="Sarah Johnson"
  gender="female"
  email="sarah@example.com"
  phone="+1234567890"
  description="Senior Developer"
/>
```

### With All Props

```jsx
<PersonDetails 
  name="Mohammed Al-Farsi"
  photo="/assets/images/users/avatar-2.jpg"
  gender="1"
  email="mohammed@example.com"
  phone="+971522200730"
  address="Abu Dhabi, UAE"
  extra="Customer"
  description="VIP Member since 2020"
  onClick={() => console.log('Person clicked')}
  maxNameLength={15}
/>
```

### Icon Only Mode

```jsx
<PersonDetails 
  name="Emily Chen"
  gender="female"
  iconOnly={true}
/>
```

### In a Table Cell

```jsx
<Table>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>
          <PersonDetails 
            name={`${user.firstName} ${user.lastName}`}
            photo={user.avatar}
            gender={user.gender}
            email={user.email}
            phone={user.phone}
            onClick={() => handleUserClick(user)}
          />
        </td>
        <td>{user.role}</td>
        <td>{user.status}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

### In a Card

```jsx
<Card>
  <Card.Body>
    <PersonDetails 
      name="Dr. Sarah Williams"
      photo="/images/doctor.jpg"
      gender="female"
      email="dr.williams@hospital.com"
      phone="+1-555-0123"
      address="New York Medical Center"
      extra="Cardiologist"
      description="15 years of experience"
    />
  </Card.Body>
</Card>
```

### With Dynamic Data from API

```jsx
const UserCard = ({ user }) => {
  return (
    <PersonDetails 
      name={user.fullName || `${user.firstName} ${user.lastName}`}
      photo={user.profilePicture}
      gender={user.gender}
      email={user.email}
      phone={user.phoneNumber}
      address={user.location}
      extra={user.role}
      description={user.bio}
      onClick={() => navigateToProfile(user.id)}
    />
  );
};
```

### In Users Table (Replacing Plain Text)

**Before:**
```jsx
<td>{user.firstName} {user.lastName}</td>
```

**After:**
```jsx
<td>
  <PersonDetails 
    name={`${user.firstName} ${user.lastName}`}
    email={user.email}
    phone={user.phone}
    gender={user.gender}
  />
</td>
```

### In Contacts Table

```jsx
<td>
  <PersonDetails 
    name={contact.name}
    email={contact.email}
    phone={contact.phone}
    description={contact.subject}
  />
</td>
```

## Styling Customization

You can customize the component by:

1. **Overriding SCSS variables** in your global styles
2. **Adding custom classes** via the `className` prop
3. **Modifying** `PersonDetails.scss` directly

### Custom Styling Example

```jsx
// Add custom class
<PersonDetails 
  name="Custom Styled User"
  className="my-custom-person-details"
/>
```

```scss
// In your CSS/SCSS file
.my-custom-person-details {
  .fleet-profile-name {
    color: #your-color;
    font-size: 16px;
  }
  
  .initial-letter {
    background-color: #your-brand-color;
  }
}
```

## Gender Indicators

The component automatically adds gender indicators:

- **Male (gender: 1 or "male")**: Blue border (#1a73eb) with ♂ symbol
- **Female (gender: 2 or "female")**: Pink border (#ff6a80) with ♀ symbol
- **No gender specified**: Default blue border without symbol

## Contact Icons

When email, phone, or address props are provided, small icon buttons appear:

- 📧 **Email icon** - Shows email on hover
- 📱 **Phone icon** - Shows phone number on hover
- 📍 **Location icon** - Shows address on hover

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper alt text for images
- ✅ Keyboard navigation support
- ✅ Tooltip for accessibility
- ✅ Proper focus states

## Browser Support

Works on all modern browsers:
- ✅ Chrome
- ✅ Firefox  
- ✅ Safari
- ✅ Edge

## Notes

- Component is fully responsive
- Uses existing project dependencies (no additional packages needed)
- SCSS file must be imported in the component
- Iconify icons automatically loaded from CDN

## Integration with Existing Code

### Users Table Example

```jsx
// Before
<td>
  <div>
    <strong>{user.firstName} {user.lastName}</strong>
  </div>
</td>

// After  
<td>
  <PersonDetails 
    name={`${user.firstName} ${user.lastName}`}
    email={user.email}
    phone={user.phone}
    gender={user.gender}
    extra={USER_ROLE_LABELS[user.role]}
  />
</td>
```

This provides a much richer display with minimal code!

