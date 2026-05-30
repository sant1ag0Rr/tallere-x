
async function checkOrders() {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mechanic@tallerx.com', password: 'TallerX123!' })
  });
  const { token } = await loginRes.json();

  const getRes = await fetch('http://localhost:4000/api/work-orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const orders = await getRes.json();
  console.log("Orders count:", orders.length);
  if (orders.length > 0) {
    console.log("First order ID:", orders[0].id);
    console.log("First order keys:", Object.keys(orders[0]));
  }
}

checkOrders().catch(console.error);
