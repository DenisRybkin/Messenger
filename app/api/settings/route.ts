import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/getCurrentUser';
import client from '@/libs/prismadb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id)
      return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const { name, image } = body;

    return NextResponse.json(
      await client.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          image: image,
          name: name,
        },
      })
    );
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
}
