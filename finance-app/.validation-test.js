/**
 * Manual validation test for currency parsing improvements
 * Run with: node .validation-test.js
 */

// Import our parseCurrency function (we'll simulate it here for testing)
function parseCurrency(currencyString) {
  // Handle empty string
  if (!currencyString || currencyString.trim() === '') {
    return 0;
  }
  
  // Remove currency symbol and extra spaces
  let cleaned = currencyString
    .replace(/R\$\s?/g, '')
    .replace(/\s+/g, '')
    .trim();
  
  // Handle negative values
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle empty after cleaning
  if (!cleaned) {
    return 0;
  }
  
  // Handle incomplete input like "30," or "30"
  if (cleaned.endsWith(',')) {
    cleaned = cleaned + '00';
  }
  
  // Check different formats
  let number;
  
  if (cleaned.includes(',')) {
    // Brazilian format with comma as decimal separator
    if (!/^\d{1,3}(?:\.\d{3})*,\d{0,2}$|^\d+,\d{0,2}$/.test(cleaned)) {
      // Handle single digit after comma like "30,5" -> "30,50"
      if (/^\d+,\d{1}$/.test(cleaned)) {
        cleaned = cleaned + '0';
      } else if (!/^\d+,\d{2}$/.test(cleaned) && !/^\d{1,3}(?:\.\d{3})*,\d{2}$/.test(cleaned)) {
        throw new Error(`Invalid currency format: ${currencyString}`);
      }
    }
    
    // Convert Brazilian format to standard decimal
    const parts = cleaned.split(',');
    const integerPart = parts[0].replace(/\./g, ''); // Remove thousands separators
    const decimalPart = parts[1] || '00';
    number = parseFloat(`${integerPart}.${decimalPart}`);
  } else if (cleaned.includes('.') && /\d+\.\d{1,2}$/.test(cleaned)) {
    // US/International format with dot as decimal separator
    number = parseFloat(cleaned);
  } else {
    // No decimal separator - treat as whole reais
    number = parseFloat(cleaned);
    if (!isNaN(number)) {
      // Convert whole number to reais (add .00)
      number = number;
    }
  }
  
  if (isNaN(number)) {
    throw new Error(`Cannot parse currency string: ${currencyString}`);
  }
  
  const cents = Math.round(number * 100);
  return isNegative ? -cents : cents;
}

console.log('🧪 Testing Currency Input Fixes...\n');

const testCases = [
  // Test case format: [input, expectedOutput, description]
  ['30', 3000, 'Simple whole number should become 30,00 (3000 cents)'],
  ['30,00', 3000, 'Already formatted should stay 30,00 (3000 cents)'],
  ['30,5', 3050, 'Single decimal should become 30,50 (3050 cents)'],
  ['30,50', 3050, 'Proper decimal should stay 30,50 (3050 cents)'],
  ['', 0, 'Empty string should return 0'],
  ['0', 0, 'Zero should return 0'],
  ['1234,56', 123456, 'Large number with decimal should work'],
  ['R$ 30,00', 3000, 'With currency symbol should work'],
  ['15', 1500, '15 should become 15,00 (1500 cents)'],
  ['0,05', 5, '5 centavos should work correctly'],
];

let passed = 0;
let failed = 0;

testCases.forEach(([input, expected, description], index) => {
  try {
    const result = parseCurrency(input);
    if (result === expected) {
      console.log(`✅ Test ${index + 1}: ${description}`);
      console.log(`   Input: "${input}" → Output: ${result} cents`);
      passed++;
    } else {
      console.log(`❌ Test ${index + 1}: ${description}`);
      console.log(`   Input: "${input}" → Expected: ${expected}, Got: ${result}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Test ${index + 1}: ${description}`);
    console.log(`   Input: "${input}" → Error: ${error.message}`);
    failed++;
  }
  console.log('');
});

console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All currency parsing tests passed!');
} else {
  console.log('🔧 Some tests failed. Currency parsing needs more work.');
}