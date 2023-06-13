import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import {
  DTOs2PagingDto,
  requestToPrismaPagingOpts,
} from '@/app/api/utils/pagination';
import client from '@/libs/prismadb';

interface IParams {
  conversationId?: string;
}

export const GET = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.email)
      return new NextResponse('Unauthorized', { status: 401 });

    const { conversationId } = params;
    const pagingOpts = requestToPrismaPagingOpts(request);

    const whereOpts = {
      conversationId,
      AND: {
        image: { isSet: true },
      },
    };

    return NextResponse.json(
      DTOs2PagingDto(
        await client.message.findMany({
          ...pagingOpts,
          orderBy: {
            createdAt: 'desc',
          },
          where: whereOpts,
        }),
        pagingOpts,
        await client.message.count({ where: whereOpts })
      )
    );
  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
};
