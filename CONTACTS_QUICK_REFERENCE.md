# Contacts Management - Quick Reference

## 🚀 Quick Start

### **Access Contacts**
1. **Login** to admin panel
2. **Navigate** to Management > Contacts
3. **URL**: `http://localhost:3000/contacts`

### **Main Features**
- 📊 **Statistics Dashboard** - Overview of contact counts
- 🔍 **Advanced Filtering** - Filter by status, type, priority, assignment
- 📋 **Contacts Table** - Paginated list with actions
- 👁️ **View Details** - Full contact information and response
- ✏️ **Update Status** - Change status, priority, assignment
- 💬 **Send Response** - Reply to customer inquiries

## 🎯 Contact Status Workflow

```
New → In Progress → Resolved → Closed
```

### **Status Meanings**
- **New** 🔵 - Just received, needs attention
- **In Progress** 🟡 - Being handled by admin
- **Resolved** 🟢 - Issue resolved, response sent
- **Closed** ⚫ - Contact closed, no further action

## 🏷️ Priority Levels

- **Low** 🟢 - Standard handling
- **Medium** 🔵 - Normal priority
- **High** 🟡 - Elevated priority
- **Urgent** 🔴 - Immediate attention required

## 🔍 Filtering Options

### **Search**
- **Global search** across name, email, subject, message
- **Real-time** as you type

### **Filters**
- **Status**: New, In Progress, Resolved, Closed
- **Inquiry Type**: Booking, General, Support, Complaint, Feedback
- **Priority**: Low, Medium, High, Urgent
- **Assigned To**: All Users, Unassigned, Specific User

## ⚡ Quick Actions

### **View Contact Details**
1. Click **👁️ View** button on any contact
2. See full information and message
3. Send response if needed

### **Update Status**
1. Click **✏️ Update** button
2. Select new status (required)
3. Set priority and assign user
4. Add admin notes
5. Save changes

### **Send Response**
1. Open contact details
2. Type response in text area
3. Click **Send Response**
4. Customer receives email

## 📊 Statistics Cards

- **Total Contacts** - Overall count
- **New Contacts** - Unhandled inquiries
- **In Progress** - Currently being processed
- **Resolved** - Successfully handled
- **Closed** - Completed contacts

## 🎨 Color Coding

### **Status Colors**
- **New**: Blue (Primary)
- **In Progress**: Orange (Warning)
- **Resolved**: Green (Success)
- **Closed**: Gray (Secondary)

### **Priority Colors**
- **Low**: Green (Success)
- **Medium**: Blue (Info)
- **High**: Orange (Warning)
- **Urgent**: Red (Danger)

## 📱 Mobile Features

- **Responsive table** with horizontal scroll
- **Touch-friendly** buttons and controls
- **Optimized modals** for mobile screens
- **Stacked filters** for better usability

## 🔧 API Endpoints

```javascript
// Get contacts with filters
GET /contact?status=new&page=1&limit=10

// Update contact status
PUT /contact/{id}/status
{
  "status": "in_progress",
  "priority": "high",
  "assignedTo": 5,
  "notes": "Customer needs urgent response"
}

// Respond to contact
POST /contact/{id}/respond
{
  "response": "Thank you for your inquiry..."
}
```

## 🎯 Best Practices

### **Status Management**
1. **Update status** when starting work on a contact
2. **Assign to yourself** or team member
3. **Set appropriate priority** based on urgency
4. **Add notes** for internal tracking
5. **Resolve** when customer issue is addressed

### **Response Guidelines**
1. **Be professional** and helpful
2. **Address all questions** in the original message
3. **Provide clear next steps** if needed
4. **Update status** after sending response
5. **Close** when no further action needed

### **Filtering Tips**
1. **Use search** for specific customers or topics
2. **Filter by status** to see work in progress
3. **Check unassigned** contacts regularly
4. **Monitor high priority** items
5. **Review resolved** contacts for quality

## 🚨 Troubleshooting

### **Common Issues**
- **Contacts not loading**: Check API connection
- **Filters not working**: Clear filters and try again
- **Response not sending**: Check email configuration
- **Status not updating**: Refresh page and try again

### **Support**
- Check browser console for errors
- Verify API endpoints are accessible
- Ensure proper authentication
- Contact development team for issues

---

**Quick Access**: Management > Contacts  
**URL**: `/contacts`  
**Last Updated**: October 6, 2025
