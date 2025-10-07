import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export Service for PDF and Excel functionality
 * Handles exporting contacts data in various formats
 */

// PDF Export Functions
export const exportToPDF = (data, filename = 'contacts-export') => {
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
    
    // Prepare table data
    const headers = [
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
    
    const tableData = data.map(contact => [
      contact.id || '-',
      contact.name || '-',
      contact.email || '-',
      contact.phone || '-',
      contact.subject || '-',
      contact.message ? contact.message.substring(0, 50) + '...' : '-',
      contact.status || '-',
      contact.priority || '-',
      contact.assigned_to || '-',
      contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-',
      contact.updated_at ? new Date(contact.updated_at).toLocaleDateString() : '-'
    ]);
    
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
        valign: 'top'
      },
      headStyles: {
        fillColor: [28, 55, 93], // #1B365D
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 25 }, // Name
        2: { cellWidth: 30 }, // Email
        3: { cellWidth: 20 }, // Phone
        4: { cellWidth: 30 }, // Subject
        5: { cellWidth: 40 }, // Message
        6: { cellWidth: 20 }, // Status
        7: { cellWidth: 20 }, // Priority
        8: { cellWidth: 25 }, // Assigned To
        9: { cellWidth: 25 }, // Created Date
        10: { cellWidth: 25 } // Updated Date
      },
      margin: { top: 40, right: 20, bottom: 20, left: 20 },
      tableWidth: 'auto',
      showHead: 'everyPage'
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
export const exportToExcel = (data, filename = 'contacts-export') => {
  try {
    // Prepare data for Excel
    const excelData = data.map(contact => ({
      'ID': contact.id || '',
      'Name': contact.name || '',
      'Email': contact.email || '',
      'Phone': contact.phone || '',
      'Subject': contact.subject || '',
      'Message': contact.message || '',
      'Status': contact.status || '',
      'Priority': contact.priority || '',
      'Assigned To': contact.assigned_to || '',
      'Created Date': contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '',
      'Updated Date': contact.updated_at ? new Date(contact.updated_at).toLocaleDateString() : ''
    }));
    
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
