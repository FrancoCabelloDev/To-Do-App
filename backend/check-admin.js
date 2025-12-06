import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.profile.findUnique({
      where: { email: 'admin@todoapp.com' }
    });
    
    console.log('Admin user:', JSON.stringify(admin, null, 2));
    
    if (admin && admin.role !== 'ADMIN') {
      console.log('Updating role to ADMIN...');
      await prisma.profile.update({
        where: { email: 'admin@todoapp.com' },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Role updated to ADMIN');
    } else if (admin) {
      console.log('✅ User already has ADMIN role');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
