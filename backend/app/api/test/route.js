import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Try to query the database to check connection
    const count = await prisma.profile.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful', 
      profileCount: count 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    }, { status: 500 });
  }
}