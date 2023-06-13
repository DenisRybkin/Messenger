import {
  ParamsWithPaging,
  PrismaPagingOpts,
  PagingModel,
} from '@/app/api/utils/types';

export const requestToPrismaPagingOpts = (
  request: Request
): PrismaPagingOpts => {
  const { searchParams } = new URL(request.url);

  const page: number = parseInt(searchParams.get('page') ?? '1');
  const size: number = parseInt(searchParams.get('size') ?? '25');
  const skip: number = page == 1 ? 0 : page * size - size;
  return {
    skip,
    take: size,
  };
};

export const DTOs2PagingDto = <T>(
  items: T[],
  opts: PrismaPagingOpts,
  count: number
): PagingModel<T> => ({
  size: opts.take ?? 25,
  page:
    Math.floor(opts.skip / opts.take) == 1
      ? 2
      : Math.floor(opts.skip / opts.take) + 1,
  totalItems: count,
  items,
});
