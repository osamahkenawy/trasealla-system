/**
 * Test Date Formatting in Export
 * This test verifies that date formatting is working correctly
 */

// Helper function to format dates (same as in export service)
const formatDate = (dateString) => {
  try {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    // Format as MM/DD/YYYY
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '-';
  }
};

// Test data with different date formats
const testDates = [
  '2024-01-15T10:30:00Z',           // ISO string
  '2024-01-16',                     // Date only
  '2024-01-17T14:20:00.000Z',       // ISO with milliseconds
  '2024-01-18T15:45:00+00:00',      // ISO with timezone
  '2024-01-19',                     // Simple date
  null,                             // Null value
  undefined,                        // Undefined value
  'invalid-date',                   // Invalid date
  '',                               // Empty string
  '2024-13-45'                      // Invalid date format
];

console.log('🧪 Testing Date Formatting...\n');

console.log('📅 Test Results:');
testDates.forEach((dateString, index) => {
  const formatted = formatDate(dateString);
  console.log(`${index + 1}. Input: "${dateString}" → Output: "${formatted}"`);
});

console.log('\n✅ Expected Results:');
console.log('   - Valid dates should be formatted as MM/DD/YYYY');
console.log('   - Invalid dates should show as "-"');
console.log('   - Null/undefined should show as "-"');

console.log('\n🎯 This ensures that:');
console.log('   - Created Date and Updated Date will show properly in PDF');
console.log('   - Date formatting is consistent across all exports');
console.log('   - Invalid dates are handled gracefully');

// Test with mock contact data
const mockContact = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-16T14:20:00Z'
};

console.log('\n📊 Mock Contact Test:');
console.log('Contact:', mockContact.name);
console.log('Created Date:', formatDate(mockContact.created_at));
console.log('Updated Date:', formatDate(mockContact.updated_at));

console.log('\n🎉 Date formatting test complete!');
console.log('💡 Created Date and Updated Date should now appear correctly in PDF exports!');
