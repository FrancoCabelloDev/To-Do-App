import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function main() {
  console.log('🌱 Starting seed...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD are required in .env');
    process.exit(1);
  }

  // Verificar si ya existe el admin
  const existingAdmin = await prisma.profile.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', adminEmail);
    return;
  }

  // Crear usuario en Supabase Auth
  console.log('Creating admin user in Supabase Auth...');
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Administrator'
    }
  });

  if (authError || !authUser.user) {
    console.error('❌ Failed to create auth user:', authError);
    process.exit(1);
  }

  // Crear perfil en la base de datos
  console.log('Creating admin profile in database...');
  await prisma.profile.create({
    data: {
      id: authUser.user.id,
      email: adminEmail,
      fullName: 'Administrator',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created successfully!');
  console.log(`📧 Email: ${adminEmail}`);
  console.log('🔑 You can now login with these credentials');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
