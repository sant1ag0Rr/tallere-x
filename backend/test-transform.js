const toCamelCase = (value) => value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const normalizeResponse = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeResponse(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [toCamelCase(key), normalizeResponse(item)])
    );
  }
  return value;
};

const toSnakeCase = (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const toSnakeCaseObject = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => toSnakeCaseObject(item));
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
        .map(([key, item]) => [toSnakeCase(key), toSnakeCaseObject(item)])
    );
  }
  return value;
};

function sanitizeData(data) {
  const { 
    id, created_at, updated_at, createdAt, updatedAt, 
    vehicle, vehicles, profile, profiles, client_name, 
    used_parts, images, feedback, work_order_parts,
    vehicle_id,
    ...validData 
  } = data;

  const sanitized = { ...validData };

  if (vehicle_id) {
    sanitized.vehicles = { connect: { id: vehicle_id } };
  }

  return sanitized;
}

const dbOrder = {
  id: "4444",
  vehicle_id: "d3b0",
  title: "Mantenimiento Preventivo",
  description: "Cambio de aceite",
  status: "in_progress",
  priority: "medium",
  reported_problem: "Toca mantenimiento por kilometraje",
  diagnosis: null,
  repairs: null,
  worked_minutes: 0,
  estimated_cost: "150",
  actual_cost: null,
  completed_at: null,
  created_at: "2026-05-18",
  updated_at: "2026-05-30",
  vehicles: {
    id: "d3b0",
    brand: "Toyota",
    model: "Corolla",
    plate: "ABC-123",
    year: 2020,
    profiles: {
      first_name: "Carlos",
      last_name: "Gomez"
    }
  },
  work_order_parts: []
};

// Frontend gets it and normalizes
const frontendOrder = normalizeResponse(dbOrder);
console.log("Frontend order keys:", Object.keys(frontendOrder));

// Frontend adds an image
const updatePayload = { ...frontendOrder, images: ["http://example.com/img.jpg"] };

// Backend receives it and snake_cases it
const backendReceived = toSnakeCaseObject(updatePayload);
console.log("Backend received keys:", Object.keys(backendReceived));

// PrismaWorkOrderRepository sanitizes it
const sanitized = sanitizeData(backendReceived);
console.log("Sanitized keys for Prisma:", Object.keys(sanitized));
console.log("Sanitized object:", sanitized);
