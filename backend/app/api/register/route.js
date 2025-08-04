import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../lib/prisma';


export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.profile.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user in the database
    const newUser = await prisma.profile.create({
      data: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        full_name: fullName || email.split('@')[0]
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
      { expiresIn: '1d' }
    );

    // Return user info and token
    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}