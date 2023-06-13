import bcrypt from 'bcrypt';

import client from '@/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  try {
    if (!email || !name || !password)
      return new NextResponse('Missing info', { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await client.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error, 'REGISTER ERROR!!');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
