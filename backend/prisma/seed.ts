import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ override: true });

const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed.');
}

if (!supabaseUrl || (!supabaseServiceRoleKey && !supabaseAnonKey)) {
  throw new Error('SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY are required to seed auth users.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey ?? supabaseAnonKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function getOrCreateAuthUser(id: string, email: string, role: string, name: string) {
  const existingProfile = await prisma.profiles.findFirst({ where: { email } });

  if (existingProfile) {
    return { id: existingProfile.id, email };
  }

  if (!supabaseServiceRoleKey) {
    const existingAuthUser = await prisma.users.findFirst({ where: { email } });

    if (existingAuthUser) {
      return { id: existingAuthUser.id, email };
    }

    await prisma.users.upsert({
      where: { id },
      update: {
        email,
        role: 'authenticated',
        raw_app_meta_data: { provider: 'email', providers: ['email'], role },
        raw_user_meta_data: { name, role },
        email_confirmed_at: new Date(),
        updated_at: new Date()
      },
      create: {
        id,
        aud: 'authenticated',
        role: 'authenticated',
        email,
        raw_app_meta_data: { provider: 'email', providers: ['email'], role },
        raw_user_meta_data: { name, role },
        email_confirmed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        is_sso_user: false,
        is_anonymous: false
      }
    });

    return { id, email };
  }

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingUser = usersData.users.find((user) => user.email === email);

  if (existingUser) {
    return existingUser;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'TallerX123!',
    email_confirm: true,
    app_metadata: { role },
    user_metadata: { name }
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function main() {
  console.log('Starting seed...');

  console.log('Seeding Auth Users...');
  const adminUser = await getOrCreateAuthUser('11111111-1111-1111-1111-111111111111', 'admin@tallerx.com', 'admin', 'Admin Taller');
  const mechanicUser = await getOrCreateAuthUser('22222222-2222-2222-2222-222222222222', 'mechanic@tallerx.com', 'mechanic', 'Mecanico Juan');
  const clientUser = await getOrCreateAuthUser('33333333-3333-3333-3333-333333333333', 'client@tallerx.com', 'client', 'Cliente Carlos');

  console.log('Seeding Profiles...');
  await prisma.profiles.upsert({
    where: { id: adminUser.id },
    update: {
      email: 'admin@tallerx.com',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'Taller',
      is_active: true
    },
    create: {
      id: adminUser.id,
      email: 'admin@tallerx.com',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'Taller',
      is_active: true
    }
  });

  await prisma.profiles.upsert({
    where: { id: mechanicUser.id },
    update: {
      email: 'mechanic@tallerx.com',
      role: 'mechanic',
      first_name: 'Mecanico',
      last_name: 'Juan',
      is_active: true
    },
    create: {
      id: mechanicUser.id,
      email: 'mechanic@tallerx.com',
      role: 'mechanic',
      first_name: 'Mecanico',
      last_name: 'Juan',
      is_active: true
    }
  });

  await prisma.profiles.upsert({
    where: { id: clientUser.id },
    update: {
      email: 'client@tallerx.com',
      role: 'client',
      first_name: 'Cliente',
      last_name: 'Carlos',
      phone: '+123456789',
      is_active: true
    },
    create: {
      id: clientUser.id,
      email: 'client@tallerx.com',
      role: 'client',
      first_name: 'Cliente',
      last_name: 'Carlos',
      phone: '+123456789',
      is_active: true
    }
  });

  console.log('Seeding Inventory Items...');
  const items = [
    { name: 'Aceite de Motor 5W-30', sku: 'OIL-5W30', category: 'Liquidos', quantity: 50, min_quantity: 10, unit_price: 25.00 },
    { name: 'Filtro de Aceite', sku: 'FIL-OIL-01', category: 'Filtros', quantity: 30, min_quantity: 5, unit_price: 8.50 },
    { name: 'Pastillas de Freno', sku: 'BRK-PAD-01', category: 'Frenos', quantity: 20, min_quantity: 4, unit_price: 45.00 },
    { name: 'Bateria 12V', sku: 'BAT-12V-01', category: 'Electrico', quantity: 10, min_quantity: 2, unit_price: 120.00 }
  ];

  for (const item of items) {
    await prisma.inventory_items.upsert({
      where: { sku: item.sku },
      update: {
        category: item.category,
        quantity: item.quantity,
        min_quantity: item.min_quantity,
        unit_price: item.unit_price
      },
      create: item
    });
  }

  console.log('Seeding Vehicles...');
  const vehicle = await prisma.vehicles.upsert({
    where: { plate: 'ABC-1234' },
    update: {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 45000,
      assigned_client_id: clientUser.id,
      status: 'available'
    },
    create: {
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 45000,
      assigned_client_id: clientUser.id,
      status: 'available'
    }
  });

  console.log('Seeding Work Orders...');
  await prisma.work_orders.upsert({
    where: { id: '44444444-4444-4444-4444-444444444444' },
    update: {
      vehicle_id: vehicle.id,
      title: 'Mantenimiento Preventivo',
      description: 'Cambio de aceite y revision general',
      status: 'pending',
      priority: 'medium',
      reported_problem: 'Toca mantenimiento por kilometraje',
      estimated_cost: 150.00
    },
    create: {
      id: '44444444-4444-4444-4444-444444444444',
      vehicle_id: vehicle.id,
      title: 'Mantenimiento Preventivo',
      description: 'Cambio de aceite y revision general',
      status: 'pending',
      priority: 'medium',
      reported_problem: 'Toca mantenimiento por kilometraje',
      estimated_cost: 150.00
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
