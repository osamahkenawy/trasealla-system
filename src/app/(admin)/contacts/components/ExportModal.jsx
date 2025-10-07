'use client';

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { exportToPDF, exportToExcel, exportToCSV, exportStatsToPDF, exportStatsToExcel } from '@/services/exportService';
import { useNotificationContext } from '@/context/useNotificationContext';

const ExportModal = ({ 
  show, 
  onHide, 
  contacts = [], 
  stats = null, 
  exportType = 'contacts' // 'contacts' or 'statistics'
}) => {
  const { showSuccess, showError } = useNotificationContext();
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedFields, setSelectedFields] = useState([
    'id', 'name', 'email', 'phone', 'subject', 'status', 'priority', 'created_at'
  ]);
  const [loading, setLoading] = useState(false);

  // Available fields for contacts export
  const availableFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'assigned_to', label: 'Assigned To' },
    { key: 'created_at', label: 'Created Date' },
    { key: 'updated_at', label: 'Updated Date' }
  ];

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
      let result;
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = exportType === 'statistics' ? 'contacts-statistics' : 'contacts-export';

      if (exportType === 'statistics') {
        // Export statistics
        if (selectedFormat === 'pdf') {
          result = exportStatsToPDF(stats, filename);
        } else if (selectedFormat === 'excel') {
          result = exportStatsToExcel(stats, filename);
        } else {
          result = { success: false, message: 'CSV format not supported for statistics' };
        }
      } else {
        // Export contacts data
        // Filter contacts data based on selected fields
        const filteredData = contacts.map(contact => {
          const filtered = {};
          selectedFields.forEach(field => {
            filtered[field] = contact[field];
          });
          return filtered;
        });

        if (selectedFormat === 'pdf') {
          result = exportToPDF(filteredData, filename);
        } else if (selectedFormat === 'excel') {
          result = exportToExcel(filteredData, filename);
        } else if (selectedFormat === 'csv') {
          result = exportToCSV(filteredData, filename);
        }
      }

      if (result.success) {
        showSuccess(result.message);
        onHide();
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      showError('An error occurred during export');
    } finally {
      setLoading(false);
    }
  };

  const getExportInfo = () => {
    if (exportType === 'statistics') {
      return {
        title: 'Export Statistics',
        description: 'Export contact statistics and metrics',
        dataCount: stats ? Object.keys(stats).length : 0
      };
    } else {
      return {
        title: 'Export Contacts Data',
        description: 'Export contact information and details',
        dataCount: contacts.length
      };
    }
  };

  const exportInfo = getExportInfo();

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{exportInfo.title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Export Selection Info */}
        <Alert variant="info" className="mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle me-2"></i>
            <div>
              <strong>{exportInfo.title}</strong>
              <br />
              <small>{exportInfo.description}</small>
              <br />
              <small className="text-muted">
                {exportType === 'statistics' 
                  ? `Statistics data available` 
                  : `${exportInfo.dataCount} contacts will be exported`
                }
              </small>
            </div>
          </div>
        </Alert>

        {exportType === 'contacts' && (
          <>
            {/* Select Fields to Include */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Select Fields to Include</h6>
              <div className="d-flex justify-content-between mb-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleSelectAllFields}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleDeselectAllFields}
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
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}

        {/* Export Format Selection */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">Select Export Format</h6>
          
          <Row>
            {/* Excel Option */}
            <Col md={4} className="mb-3">
              <div 
                className={`format-option-card ${selectedFormat === 'excel' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('excel')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center p-3 border rounded">
                  <div className="format-icon-wrapper me-3">
                    <div className="format-icon excel-icon d-flex align-items-center justify-content-center">
                      Excel
                    </div>
                  </div>
                  <div className="format-info flex-grow-1">
                    <div className="format-title fw-bold">Excel</div>
                    <div className="format-description text-muted small">
                      Download as Excel spreadsheet
                    </div>
                  </div>
                  <div className="format-radio">
                    <Form.Check
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={selectedFormat === 'excel'}
                      onChange={() => setSelectedFormat('excel')}
                    />
                  </div>
                </div>
              </div>
            </Col>

            {/* PDF Option */}
            <Col md={4} className="mb-3">
              <div 
                className={`format-option-card ${selectedFormat === 'pdf' ? 'selected' : ''}`}
                onClick={() => setSelectedFormat('pdf')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center p-3 border rounded">
                  <div className="format-icon-wrapper me-3">
                    <div className="format-icon pdf-icon d-flex align-items-center justify-content-center">
                      PDF
                    </div>
                  </div>
                  <div className="format-info flex-grow-1">
                    <div className="format-title fw-bold">PDF</div>
                    <div className="format-description text-muted small">
                      Ideal for documentation
                    </div>
                  </div>
                  <div className="format-radio">
                    <Form.Check
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={selectedFormat === 'pdf'}
                      onChange={() => setSelectedFormat('pdf')}
                    />
                  </div>
                </div>
              </div>
            </Col>

            {/* CSV Option (only for contacts) */}
            {exportType === 'contacts' && (
              <Col md={4} className="mb-3">
                <div 
                  className={`format-option-card ${selectedFormat === 'csv' ? 'selected' : ''}`}
                  onClick={() => setSelectedFormat('csv')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center p-3 border rounded">
                    <div className="format-icon-wrapper me-3">
                      <div className="format-icon csv-icon d-flex align-items-center justify-content-center">
                        CSV
                      </div>
                    </div>
                    <div className="format-info flex-grow-1">
                      <div className="format-title fw-bold">CSV</div>
                      <div className="format-description text-muted small">
                        Comma-separated values
                      </div>
                    </div>
                    <div className="format-radio">
                      <Form.Check
                        type="radio"
                        name="exportFormat"
                        value="csv"
                        checked={selectedFormat === 'csv'}
                        onChange={() => setSelectedFormat('csv')}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleExport}
          disabled={loading || (exportType === 'contacts' && selectedFields.length === 0)}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Exporting...
            </>
          ) : (
            'Download'
          )}
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .format-option-card {
          transition: all 0.2s ease;
        }
        
        .format-option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .format-option-card.selected .border {
          border-color: #0d6efd !important;
          background-color: #f8f9ff;
        }
        
        .format-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 11px;
          color: white;
          letter-spacing: 0.5px;
        }
        
        .excel-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .pdf-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        
        .csv-icon {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }
        
        .format-title {
          font-size: 16px;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .format-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }
      `}</style>
    </Modal>
  );
};

export default ExportModal;
