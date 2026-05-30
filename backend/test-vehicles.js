
async function main() {
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'testval@tallerx.com', 
        password: 'Password123!', 
        firstName: 'Test', 
        lastName: 'Val',
        role: 'client' 
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    const token = loginData.token;
    const clientId = loginData.user.id;

    // 2. Fetch vehicles
    const res = await fetch(`http://localhost:4000/api/vehicles?clientId=${clientId}&limit=100`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', res.status);
    console.log('Response body:', await res.json());
  } catch (err) {
    console.error(err);
  }
}

main();
