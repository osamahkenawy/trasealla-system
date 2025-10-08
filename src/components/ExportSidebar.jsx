'use client';

import React, { useState } from 'react';
import { Offcanvas, Button, Form, Row, Col } from 'react-bootstrap';
import { exportToPDF, exportToExcel } from '@/services/exportService';
import { useNotificationContext } from '@/context/useNotificationContext';

/**
 * Generic Export Sidebar Component
 * Can be used across any component for exporting data
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether sidebar is visible
 * @param {Function} props.onHide - Function to hide sidebar
 * @param {Array} props.data - Data array to export
 * @param {string} props.title - Export title (default: 'Export Data')
 * @param {string} props.description - Export description
 * @param {Array} props.availableFields - Available fields for export [{key, label}]
 * @param {Array} props.defaultFields - Default selected fields
 * @param {Function} props.onExport - Custom export handler function
 * @param {number} props.width - Sidebar width in pixels (default: 600)
 */
const ExportSidebar = ({ 
  show, 
  onHide, 
  data = [], // Generic data array
  title = 'Export Data',
  description = 'Select the format you want to download the data.',
  availableFields = [], // Array of field objects with {key, label}
  defaultFields = [], // Array of default selected field keys
  onExport, // Custom export handler function
  width = 600 // Dynamic width
}) => {
  const { showSuccess, showError } = useNotificationContext();
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedFields, setSelectedFields] = useState(defaultFields);
  const [loading, setLoading] = useState(false);

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      showError('Please select at least one field to export');
      return;
    }

    setLoading(true);
    
    try {
      // Use custom export handler if provided
      if (onExport) {
        const result = await onExport({
          data,
          selectedFields,
          selectedFormat,
          title,
          availableFields
        });
        
        if (result.success) {
          showSuccess(result.message);
          onHide();
        } else {
          showError(result.message);
        }
      } else {
        // Default export behavior
        let result;
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;

        if (selectedFormat === 'pdf') {
          result = exportToPDF(data, filename, selectedFields, availableFields);
        } else if (selectedFormat === 'excel') {
          result = exportToExcel(data, filename, selectedFields, availableFields);
        }

        if (result.success) {
          showSuccess(result.message);
          onHide();
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      showError('An error occurred during export');
    } finally {
      setLoading(false);
    }
  };

  const exportInfo = {
    title,
    description,
    dataCount: data.length
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide} 
      placement="end" 
      className="export-sidebar"
      style={{ backgroundColor: '#f8f9fa', width: `${width}px` }}
    >
      <Offcanvas.Header 
        closeButton
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e9ecef' }}
      >
        <Offcanvas.Title className="fw-bold" style={{ color: '#111827' }}>
          {exportInfo.title}
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="p-0" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Export Selection Info */}
          <div className="export-info-section mb-4 p-3 rounded-3" style={{ backgroundColor: '#fff', border: '1px solid #e9ecef' }}>
            <div className="d-flex align-items-center mb-2">
              <div className="export-icon me-3">
                <i className="bi bi-stack" style={{ fontSize: '24px', color: '#6c757d' }}></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold">
                  Exporting All Data
                </h6>
                <p className="mb-0 text-muted small">
                  {data.length > 0 
                    ? 'Data will be exported based on your selection'
                    : 'No data is selected.'
                  }
                </p>
                {data.length === 0 && (
                  <div className="mt-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-lightbulb me-2" style={{ color: '#ffc107' }}></i>
                      <small className="text-muted">
                        <strong>Tip:</strong> All available data will be exported based on your field selection.
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Select Fields to Include */}
          {availableFields.length > 0 && (
            <div className="fields-section mb-4 p-3 rounded-3" style={{ backgroundColor: '#fff', border: '1px solid #e9ecef' }}>
              <h6 className="fw-bold mb-3">Select Fields to Include</h6>
              
              <div className="d-flex justify-content-between mb-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleSelectAllFields}
                  className="rounded-pill"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleDeselectAllFields}
                  className="rounded-pill"
                >
                  Deselect All
                </Button>
              </div>
              
              <Row>
                {availableFields.map(field => (
                  <Col md={6} key={field.key} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`field-${field.key}`}
                      label={field.label}
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                      className="form-check-input-custom"
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Export Format Selection */}
          <div className="format-section" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
            <h6 className="fw-bold mb-3">Export Format Selection</h6>
            
            <div className="d-flex flex-column gap-3">
              {/* Excel Option */}
              <div 
                className={`format-option-card ${selectedFormat === 'excel' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('excel')}
                style={{ cursor: 'pointer' }}
              >
                <div className="format-card d-flex align-items-center" style={{ border: '2px solid #e9ecef', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                  <div className="format-icon-wrapper me-3">
                    <div 
                      className="format-icon excel-icon d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '8px', 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Excel
                    </div>
                  </div>
                  <div className="format-info flex-grow-1">
                    <div className="format-title fw-bold">Excel</div>
                    <div className="format-description text-muted small">
                      Download as a formatted Excel workbook
                    </div>
                  </div>
                  <div className="format-radio">
                    <Form.Check
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={selectedFormat === 'excel'}
                      onChange={() => setSelectedFormat('excel')}
                      className="form-check-input-custom"
                    />
                  </div>
                </div>
              </div>

              {/* PDF Option */}
              <div 
                className={`format-option-card ${selectedFormat === 'pdf' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('pdf')}
                style={{ cursor: 'pointer' }}
              >
                <div className="format-card d-flex align-items-center" style={{ border: '2px solid #e9ecef', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#fff' }}>
                  <div className="format-icon-wrapper me-3">
                    <div 
                      className="format-icon pdf-icon d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '8px', 
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      PDF
                    </div>
                  </div>
                  <div className="format-info flex-grow-1">
                    <div className="format-title fw-bold">PDF</div>
                    <div className="format-description text-muted small">
                      Ideal for documentation and offline access
                    </div>
                  </div>
                  <div className="format-radio">
                    <Form.Check
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={selectedFormat === 'pdf'}
                      onChange={() => setSelectedFormat('pdf')}
                      className="form-check-input-custom"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with Apply Button */}
        <div className="export-footer p-4 border-top" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              onClick={onHide} 
              disabled={loading}
              className="rounded-pill"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleExport}
              disabled={loading || selectedFields.length === 0}
              className="rounded-pill px-4"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Exporting...
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ExportSidebar;
