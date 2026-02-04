// Test customer search API
const testCustomerSearch = async () => {
    try {
        // Test 1: Empty query (should return defaults)
        console.log('Test 1: Empty query');
        const res1 = await fetch('http://localhost:3000/api/shared/search/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: '', limit: 20 })
        });
        const data1 = await res1.json();
        console.log('Result:', data1);

        // Test 2: Search query
        console.log('\nTest 2: Search with query');
        const res2 = await fetch('http://localhost:3000/api/shared/search/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: 'nguyen', limit: 20 })
        });
        const data2 = await res2.json();
        console.log('Result:', data2);

    } catch (error) {
        console.error('Error:', error);
    }
};

testCustomerSearch();
