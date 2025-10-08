import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export Service for PDF and Excel functionality
 * Handles exporting contacts data in various formats
 */

// Helper function to format dates
const formatDate = (dateString) => {
  try {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    // Format as MM/DD/YYYY HH:MM AM/PM
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} ${timeStr}`;
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '-';
  }
};

// Helper function to format field values
const formatFieldValue = (item, fieldKey, itemType = 'contact') => {
  if (itemType === 'user') {
    switch (fieldKey) {
      case 'id':
        return item.id || '-';
      case 'firstName':
        return item.firstName || '-';
      case 'lastName':
        return item.lastName || '-';
      case 'name':
        return `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-';
      case 'email':
        return item.email || '-';
      case 'phone':
        return item.phone || '-';
      case 'role':
        return item.role || '-';
      case 'isActive':
        return item.isActive ? 'Yes' : 'No';
      case 'isEmailVerified':
        return item.isEmailVerified ? 'Verified' : 'Unverified';
      case 'dateOfBirth':
        return item.dateOfBirth || '-';
      case 'nationality':
        return item.nationality || '-';
      case 'address':
        return item.address || '-';
      case 'city':
        return item.city || '-';
      case 'country':
        return item.country || '-';
      case 'created_at':
        return item.createdAt || item.created_at ? formatDate(item.createdAt || item.created_at) : '-';
      case 'updated_at':
        return item.updatedAt || item.updated_at ? formatDate(item.updatedAt || item.updated_at) : '-';
      default:
        return item[fieldKey] || '-';
    }
  } else {
    // Original contact logic
    switch (fieldKey) {
      case 'id':
        return item.id || '-';
      case 'name':
        return item.name || '-';
      case 'email':
        return item.email || '-';
      case 'phone':
        return item.phone || '-';
      case 'subject':
        return item.subject || '-';
      case 'message':
        return item.message ? item.message.substring(0, 50) + '...' : '-';
      case 'status':
        return item.status || '-';
      case 'priority':
        return item.priority || '-';
      case 'assigned_to':
        return item.assignedTo || item.assigned_to || '-';
      case 'created_at':
        return item.createdAt || item.created_at ? formatDate(item.createdAt || item.created_at) : '-';
      case 'updated_at':
        return item.updatedAt || item.updated_at ? formatDate(item.updatedAt || item.updated_at) : '-';
      default:
        return item[fieldKey] || '-';
    }
  }
};

// PDF Export Functions
export const exportToPDF = (data, filename = 'contacts-export', selectedFields = null, availableFields = null, itemType = 'contact') => {
  try {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Contacts Export', 20, 20);
    
    // Add export date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add company logo (if available)
    const imgWidth = 76.23; 
    const imgHeight = 21.76;
    const pageWidth = doc.internal.pageSize.getWidth();
    try {
      doc.addImage("/assets/images/TRASEALLA.png", 'PNG', pageWidth - imgWidth - 20, 11, imgWidth, imgHeight);
    } catch (error) {
      console.warn('Logo not found, continuing without logo');
    }
    
    // Prepare table data based on selected fields
    let headers, tableData;
    
    if (selectedFields && availableFields) {
      // Use selected fields
      headers = selectedFields.map(fieldKey => {
        const field = availableFields.find(f => f.key === fieldKey);
        return field ? field.label : fieldKey;
      });
      
      tableData = data.map(item => {
        return selectedFields.map(fieldKey => {
          return formatFieldValue(item, fieldKey, itemType);
        });
      });
    } else {
      // Fallback to default fields
      headers = [
        'ID',
        'Name', 
        'Email',
        'Phone',
        'Role',
        'Is Active',
        'Email Verified',
        'Priority',
        'Created Date',
        'Updated Date'
      ];
      
      tableData = data.map(item => [
        item.id || '-',
        itemType === 'user' ? `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-' : item.name || '-',
        item.email || '-',
        item.phone || '-',
        itemType === 'user' ? (item.role || '-') : (item.subject || '-'),
        itemType === 'user' ? (item.isActive ? 'Yes' : 'No') : (item.message ? item.message.substring(0, 50) + '...' : '-'),
        itemType === 'user' ? (item.isEmailVerified ? 'Verified' : 'Unverified') : (item.status || '-'),
        itemType === 'user' ? '' : (item.priority || '-'),
        item.createdAt || item.created_at ? formatDate(item.createdAt || item.created_at) : '-',
        item.updatedAt || item.updated_at ? formatDate(item.updatedAt || item.updated_at) : '-'
      ]);
    }
    
    // Calculate full table width (page width minus margins)
    const docPageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 20;
    const rightMargin = 20;
    const fullTableWidth = docPageWidth - leftMargin - rightMargin;
    
    // Dynamic column width calculation based on selected fields
    const generateColumnStyles = (numColumns) => {
      const columnStyles = {};
      const equalWidth = fullTableWidth / numColumns;
      
      // Define priority widths for specific field types
      const fieldWidths = {
        'id': 0.06,           // ID - smaller
        'name': 0.15,         // Name
        'email': 0.20,        // Email
        'phone': 0.12,        // Phone
        'subject': 0.20,      // Subject
        'message': 0.25,      // Message
        'status': 0.10,       // Status
        'priority': 0.10,     // Priority
        'assigned_to': 0.15,  // Assigned To
        'created_at': 0.15,   // Created Date
        'updated_at': 0.15    // Updated Date
      };
      
      if (selectedFields && availableFields) {
        // Use specific field widths when fields are selected
        selectedFields.forEach((fieldKey, index) => {
          const field = availableFields.find(f => f.key === fieldKey);
          const fieldName = field ? field.key : fieldKey;
          const widthRatio = fieldWidths[fieldName] || (1 / numColumns);
          columnStyles[index] = { cellWidth: fullTableWidth * widthRatio };
        });
      } else {
        // Use equal distribution for default fields
        for (let i = 0; i < numColumns; i++) {
          columnStyles[i] = { cellWidth: equalWidth };
        }
      }
      
      return columnStyles;
    };
    
    // Generate table using autoTable
    doc.autoTable({
      startY: 40,
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'top',
        halign: 'left'
      },
      headStyles: {
        fillColor: [28, 55, 93], // #1B365D
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      margin: { top: 40, right: rightMargin, bottom: 20, left: leftMargin },
      tableWidth: fullTableWidth, // Force full width
      showHead: 'everyPage',
      columnStyles: generateColumnStyles(headers.length)
    });
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 40,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    // Save the PDF
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`${filename}-${timestamp}.pdf`);
    
    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, message: 'Failed to export PDF: ' + error.message };
  }
};

// Excel Export Functions
export const exportToExcel = (data, filename = 'contacts-export', selectedFields = null, availableFields = null, itemType = 'contact') => {
  try {
    // Prepare data for Excel based on selected fields
    let excelData;
    
    if (selectedFields && availableFields) {
      // Use selected fields
      excelData = data.map(item => {
        const row = {};
        selectedFields.forEach(fieldKey => {
          const field = availableFields.find(f => f.key === fieldKey);
          const label = field ? field.label : fieldKey;
          row[label] = formatFieldValue(item, fieldKey, itemType);
        });
        return row;
      });
    } else {
      // Fallback to default fields
      excelData = data.map(item => ({
        'ID': item.id || '',
        'Name': itemType === 'user' ? `${item.firstName || ''} ${item.lastName || ''}`.trim() || '' : item.name || '',
        'Email': item.email || '',
        'Phone': item.phone || '',
        'Subject/Role': itemType === 'user' ? (item.role || '') : (item.subject || ''),
        'Message/IsActive': itemType === 'user' ? (item.isActive ? 'Yes' : 'No') : (item.message || ''),
        'Status/EmailVerified': itemType === 'user' ? (item.isEmailVerified ? 'Verified' : 'Unverified') : (item.status || ''),
        'Priority': itemType === 'user' ? '' : (item.priority || ''),
        'Assigned To/DateOfBirth': itemType === 'user' ? (item.dateOfBirth || '') : (item.assignedTo || item.assigned_to || ''),
        'Created Date/Nationality': itemType === 'user' ? (item.nationality || '') : (item.createdAt || item.created_at ? formatDate(item.createdAt || item.created_at) : ''),
        'Created Date': item.createdAt || item.created_at ? formatDate(item.createdAt || item.created_at) : '',
        'Updated Date': item.updatedAt || item.updated_at ? formatDate(item.updatedAt || item.updated_at) : ''
      }));
    }
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 8 },  // ID
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 25 }, // Subject
      { wch: 50 }, // Message
      { wch: 12 }, // Status
      { wch: 12 }, // Priority
      { wch: 20 }, // Assigned To
      { wch: 15 }, // Created Date
      { wch: 15 }  // Updated Date
    ];
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${timestamp}.xlsx`;
    
    // Save the file
    XLSX.writeFile(wb, fullFilename);
    
    return { success: true, message: 'Excel file exported successfully' };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, message: 'Failed to export Excel: ' + error.message };
  }
};


// Statistics Export Functions
export const exportStatsToPDF = (stats, filename = 'contacts-statistics') => {
  try {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Contacts Statistics', 20, 20);
    
    // Add export date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add statistics data
    let yPosition = 50;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    if (stats) {
      const statItems = [
        { label: 'Total Contacts', value: stats.total || 0 },
        { label: 'New Contacts', value: stats.new || 0 },
        { label: 'In Progress', value: stats.in_progress || 0 },
        { label: 'Resolved', value: stats.resolved || 0 },
        { label: 'Assigned', value: stats.assigned || 0 }
      ];
      
      statItems.forEach(item => {
        doc.text(`${item.label}: ${item.value}`, 20, yPosition);
        yPosition += 10;
      });
    }
    
    // Save the PDF
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`${filename}-${timestamp}.pdf`);
    
    return { success: true, message: 'Statistics PDF exported successfully' };
  } catch (error) {
    console.error('Statistics PDF export error:', error);
    return { success: false, message: 'Failed to export statistics PDF: ' + error.message };
  }
};

export const exportStatsToExcel = (stats, filename = 'contacts-statistics') => {
  try {
    // Prepare statistics data for Excel
    const excelData = [
      { 'Metric': 'Total Contacts', 'Value': stats?.total || 0 },
      { 'Metric': 'New Contacts', 'Value': stats?.new || 0 },
      { 'Metric': 'In Progress', 'Value': stats?.in_progress || 0 },
      { 'Metric': 'Resolved', 'Value': stats?.resolved || 0 },
      { 'Metric': 'Assigned', 'Value': stats?.assigned || 0 }
    ];
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [{ wch: 20 }, { wch: 15 }];
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${timestamp}.xlsx`;
    
    // Save the file
    XLSX.writeFile(wb, fullFilename);
    
    return { success: true, message: 'Statistics Excel file exported successfully' };
  } catch (error) {
    console.error('Statistics Excel export error:', error);
    return { success: false, message: 'Failed to export statistics Excel: ' + error.message };
  }
};
