async function testSignup() {
    try {
        console.log('Sending signup request...');
        const response = await fetch('http://localhost:5001/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'hjhhuhoihi@gmail.com',
                password: 'password123'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testSignup();
