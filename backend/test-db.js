// Test script to verify database connection and Profile model
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by creating a test profile
    const testProfile = await prisma.profile.create({
      data: {
        email: 'test@example.com',
        password: 'test-password',
        full_name: 'Test User'
      }
    });
    
    console.log('Successfully created test profile:', testProfile);
    
    // Fetch the profile we just created
    const profiles = await prisma.profile.findMany();
    console.log('All profiles:', profiles);
    
    // Clean up by deleting the test profile
    await prisma.profile.delete({
      where: { id: testProfile.id }
    });
    
    console.log('Test profile deleted successfully');
    console.log('Database connection and operations verified successfully!');
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();