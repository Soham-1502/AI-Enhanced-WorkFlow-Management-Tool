import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from 'backend\lib\prisma.js';

export async function POST(req) {
    const {name, email, password} = await req.json();

    const existingUser = await prisma.user.findUnique({
        where: {email},
    });

    if (existingUser) {
        return NextResponse.json({error: 'Email already in use'}, {status:400})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({message: 'Registered Successfully', user});
}