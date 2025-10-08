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
const formatFieldValue = (contact, fieldKey) => {
  switch (fieldKey) {
    case 'id':
      return contact.id || '-';
    case 'name':
      return contact.name || '-';
    case 'email':
      return contact.email || '-';
    case 'phone':
      return contact.phone || '-';
    case 'subject':
      return contact.subject || '-';
    case 'message':
      return contact.message ? contact.message.substring(0, 50) + '...' : '-';
    case 'status':
      return contact.status || '-';
    case 'priority':
      return contact.priority || '-';
    case 'assigned_to':
      return contact.assignedTo || contact.assigned_to || '-';
    case 'created_at':
      return contact.createdAt || contact.created_at ? formatDate(contact.createdAt || contact.created_at) : '-';
    case 'updated_at':
      return contact.updatedAt || contact.updated_at ? formatDate(contact.updatedAt || contact.updated_at) : '-';
    default:
      return contact[fieldKey] || '-';
  }
};

// PDF Export Functions
export const exportToPDF = (data, filename = 'contacts-export', selectedFields = null, availableFields = null) => {
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
      
      tableData = data.map(contact => {
        return selectedFields.map(fieldKey => {
          return formatFieldValue(contact, fieldKey);
        });
      });
    } else {
      // Fallback to default fields
      headers = [
        'ID',
        'Name', 
        'Email',
        'Phone',
        'Subject',
        'Message',
        'Status',
        'Priority',
        'Assigned To',
        'Created Date',
        'Updated Date'
      ];
      
      tableData = data.map(contact => [
        contact.id || '-',
        contact.name || '-',
        contact.email || '-',
        contact.phone || '-',
        contact.subject || '-',
        contact.message ? contact.message.substring(0, 50) + '...' : '-',
        contact.status || '-',
        contact.priority || '-',
        contact.assignedTo || contact.assigned_to || '-',
        contact.createdAt || contact.created_at ? formatDate(contact.createdAt || contact.created_at) : '-',
        contact.updatedAt || contact.updated_at ? formatDate(contact.updatedAt || contact.updated_at) : '-'
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
export const exportToExcel = (data, filename = 'contacts-export', selectedFields = null, availableFields = null) => {
  try {
    // Prepare data for Excel based on selected fields
    let excelData;
    
    if (selectedFields && availableFields) {
      // Use selected fields
      excelData = data.map(contact => {
        const row = {};
        selectedFields.forEach(fieldKey => {
          const field = availableFields.find(f => f.key === fieldKey);
          const label = field ? field.label : fieldKey;
          row[label] = formatFieldValue(contact, fieldKey);
        });
        return row;
      });
    } else {
      // Fallback to default fields
      excelData = data.map(contact => ({
        'ID': contact.id || '',
        'Name': contact.name || '',
        'Email': contact.email || '',
        'Phone': contact.phone || '',
        'Subject': contact.subject || '',
        'Message': contact.message || '',
        'Status': contact.status || '',
        'Priority': contact.priority || '',
        'Assigned To': contact.assignedTo || contact.assigned_to || '',
        'Created Date': contact.createdAt || contact.created_at ? formatDate(contact.createdAt || contact.created_at) : '',
        'Updated Date': contact.updatedAt || contact.updated_at ? formatDate(contact.updatedAt || contact.updated_at) : ''
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
