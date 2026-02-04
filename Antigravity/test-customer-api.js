// Debug script để test Customer API
// Run: node test-customer-api.js

async function testCustomerAPI() {
    try {
        console.log('Testing Customer API...');

        // Test 1: Dropdown endpoint
        console.log('\n1. Testing dropdown endpoint:');
        const dropdownResponse = await fetch('http://localhost:3000/api/crm/customers?for_dropdown=true&status=ACTIVE');
        const dropdownData = await dropdownResponse.json();
        console.log('Status:', dropdownResponse.status);
        console.log('Response:', JSON.stringify(dropdownData, null, 2));

        if (dropdownData.data) {
            console.log(`Found ${dropdownData.data.length} customers`);
        } else {
            console.log('⚠️ No data array in response!');
        }

        // Test 2: Regular endpoint with pagination
        console.log('\n2. Testing regular endpoint:');
        const regularResponse = await fetch('http://localhost:3000/api/crm/customers?page=1&limit=5');
        const regularData = await regularResponse.json();
        console.log('Status:', regularResponse.status);
        console.log('Response:', JSON.stringify(regularData, null, 2));

    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testCustomerAPI();
