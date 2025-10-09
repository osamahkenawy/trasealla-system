/**
 * PersonDetails Component - Usage Examples
 * Copy these examples into your actual components
 */

import PersonDetails from '@/components/PersonDetails';
import { Card, Table, Row, Col } from 'react-bootstrap';

// Example 1: Basic Usage in Table
const UsersTableExample = () => {
  const users = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+971522200730', gender: 'male' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+971555000000', gender: 'female' }
  ];

  return (
    <Table>
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <PersonDetails 
                name={`${user.firstName} ${user.lastName}`}
                email={user.email}
                phone={user.phone}
                gender={user.gender}
              />
            </td>
            <td>Admin</td>
            <td>Active</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Example 2: With Photo
const UserCardExample = () => {
  return (
    <Card>
      <Card.Body>
        <PersonDetails 
          name="Ahmed Hassan"
          photo="/assets/images/users/avatar-1.jpg"
          gender="male"
          email="ahmed@example.com"
          phone="+971522200730"
          address="Dubai, UAE"
          extra="VIP Customer"
          description="Member since 2020"
        />
      </Card.Body>
    </Card>
  );
};

// Example 3: Icon Only Mode
const AvatarListExample = () => {
  const users = [
    { name: 'John Doe', gender: 'male' },
    { name: 'Jane Smith', gender: 'female' },
    { name: 'Bob Johnson', gender: 'male' }
  ];

  return (
    <div className="d-flex gap-2">
      {users.map((user, index) => (
        <PersonDetails 
          key={index}
          name={user.name}
          gender={user.gender}
          iconOnly={true}
        />
      ))}
    </div>
  );
};

// Example 4: Clickable Person Cards
const ContactsListExample = () => {
  const contacts = [
    {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1234567890',
      gender: 'female',
      subject: 'Inquiry about booking'
    },
    {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+0987654321',
      gender: 'male',
      subject: 'Support request'
    }
  ];

  const handleContactClick = (contact) => {
    console.log('Contact clicked:', contact);
  };

  return (
    <div>
      {contacts.map((contact, index) => (
        <div key={index} className="mb-3">
          <PersonDetails 
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            gender={contact.gender}
            description={contact.subject}
            onClick={() => handleContactClick(contact)}
          />
        </div>
      ))}
    </div>
  );
};

// Example 5: Grid Layout
const TeamGridExample = () => {
  const team = [
    { name: 'Dr. Emily Chen', role: 'Medical Director', email: 'emily@hospital.com', gender: 'female' },
    { name: 'Dr. James Wilson', role: 'Surgeon', email: 'james@hospital.com', gender: 'male' },
    { name: 'Dr. Lisa Anderson', role: 'Pediatrician', email: 'lisa@hospital.com', gender: 'female' },
    { name: 'Dr. Robert Taylor', role: 'Cardiologist', email: 'robert@hospital.com', gender: 'male' }
  ];

  return (
    <Row>
      {team.map((member, index) => (
        <Col md={6} lg={3} key={index} className="mb-3">
          <Card>
            <Card.Body>
              <PersonDetails 
                name={member.name}
                email={member.email}
                gender={member.gender}
                extra={member.role}
              />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Example 6: Replace in UsersTable.jsx
// BEFORE:
/*
<td>
  <div>
    <strong>{user.firstName} {user.lastName}</strong>
  </div>
</td>
*/

// AFTER:
/*
import PersonDetails from '@/components/PersonDetails';

<td>
  <PersonDetails 
    name={`${user.firstName} ${user.lastName}`}
    email={user.email}
    phone={user.phone}
    gender={user.gender}
    onClick={() => onUserSelect(user)}
  />
</td>
*/

// Example 7: Replace in ContactsTable.jsx
// BEFORE:
/*
<td>
  <div className="text-body">
    <h6 className="mb-0">{contact.name}</h6>
    <small className="text-muted">{contact.email}</small>
  </div>
</td>
*/

// AFTER:
/*
import PersonDetails from '@/components/PersonDetails';

<td>
  <PersonDetails 
    name={contact.name}
    email={contact.email}
    phone={contact.phone}
    description={contact.subject}
    onClick={() => onContactSelect(contact)}
  />
</td>
*/

export {
  UsersTableExample,
  UserCardExample,
  AvatarListExample,
  ContactsListExample,
  TeamGridExample
};

