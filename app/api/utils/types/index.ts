export type PrismaPagingOpts = { skip: number; take: number };
export type ParamsWithPaging = { page?: number; size?: number };

export type PagingOpts = Required<ParamsWithPaging>;

export type PagingModel<T> = { items: T[]; totalItems: number } & PagingOpts;
