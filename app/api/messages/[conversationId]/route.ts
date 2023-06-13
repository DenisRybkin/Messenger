import { getCurrentUser } from '@/actions/getCurrentUser';
import {
  DTOs2PagingDto,
  requestToPrismaPagingOpts,
} from '@/app/api/utils/pagination';
import { NextResponse } from 'next/server';
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
    const { conversationId } = params;
    const pagingOpts = requestToPrismaPagingOpts(request);
    if (!currentUser || !currentUser.email)
      return new NextResponse('Unauthorized', { status: 401 });

    const whereOpts = {
      conversationId,
    };

    return NextResponse.json(
      DTOs2PagingDto(
        (
          await client.message.findMany({
            ...pagingOpts,
            where: whereOpts,
            include: {
              sender: true,
              seen: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
        ).reverse(),
        pagingOpts,
        await client.message.count({ where: whereOpts })
      )
    );
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_GET');
    return new NextResponse('Internal Error', { status: 500 });
  }
};
