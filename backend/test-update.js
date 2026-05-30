
async function testUpdate() {
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
  const order = orders[0];
  if (!order) {
    console.log("No orders found");
    return;
  }

  const payload = {
    id: order.id,
    vehicleId: order.vehicle_id,
    title: order.title,
    description: order.description,
    status: order.status,
    priority: order.priority,
    reportedProblem: order.reported_problem,
    workedMinutes: order.worked_minutes,
    estimatedCost: order.estimated_cost,
    images: ['http://example.com/img.jpg'],
    clientName: "Cliente Carlos",
    vehicle: { id: order.vehicle_id, brand: "Toyota", model: "Corolla", plate: "ABC-123", year: 2020 },
    usedParts: []
  };

  console.log("Sending camelCase payload...");
  const updateRes = await fetch(`http://localhost:4000/api/work-orders/${order.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const text = await updateRes.text();
  console.log('Status:', updateRes.status);
  console.log('Response body:', text);
}

testUpdate().catch(console.error);
