import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { PagingModel, PagingOpts } from '@/app/api/utils/types';

type PagedRequest<T> = (params?: {
  [key: string]: string | number | boolean | null;
}) => Promise<AxiosResponse<any, any>>;

export type PagingInfo = {
  page: number;
  isLoading: boolean;
  isDone: boolean;
  totalItems?: number;
};

const initialPagingInfo = (page: number): PagingInfo =>
  ({ page, isLoading: false, isDone: false } as PagingInfo);

export const usePaging = <T>(
  request: PagedRequest<T>,
  params?: {
    [key: string]:
      | string
      | number
      | (string | number)[]
      | boolean
      | null
      | undefined;
  },
  options?: PagingOpts,
  initialData?: Array<T>,
  onError?: () => void,
  onSuccess?: (items: Array<T>) => void
) => {
  if (options == null) options = { page: 1, size: 10 } as PagingOpts;

  const initialDataCopy = useRef<T[]>(initialData ?? []);

  const [items, setItems] = useState<T[]>(initialDataCopy.current ?? []);
  const itemsCopy = useRef<T[]>(initialDataCopy.current ?? []);

  const [lastResult, setLastResult] = useState<PagingModel<T> | null>(null);
  const lastResultCopy = useRef<PagingModel<T> | null>(null);

  const [info, setInfo] = useState<PagingInfo>(
    initialPagingInfo(options?.page ?? 1)
  );
  const infoCopy = useRef<PagingInfo>(initialPagingInfo(options?.page ?? 1));

  const setItemsSync = (v: T[]) => {
    const data = filterArrayOfObjectsById(v);
    itemsCopy.current = data;
    setItems(data);
  };

  function arraysEqual(a: any, b: any) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  useEffect(() => {
    if (
      arraysEqual(
        initialData?.map(i => (i as any).id).sort() ?? [],
        initialDataCopy.current?.map(i => (i as any).id).sort()
      )
    )
      return;

    initialDataCopy.current = initialData ?? [];
    setItemsSync(
      filterArrayOfObjectsById([
        ...(initialDataCopy.current ?? []),
        ...itemsCopy.current,
      ])
    );
  }, [initialData]);

  function filterArrayOfObjectsById(array: any[]) {
    return array.filter(
      (value, index, self) => self.findIndex(v => v.id == value.id) == index
    );
  }

  const setLastResultSync = (v: PagingModel<T> | null) => {
    setLastResult(v);
    lastResultCopy.current = v;
  };

  const setInfoSync = (v: PagingInfo) => {
    setInfo(v);
    infoCopy.current = v;
  };

  async function loadNext() {
    await load(infoCopy.current.page + 1);
  }

  async function load(page: number, withoutStateReset?: boolean) {
    if (infoCopy.current.isDone && !withoutStateReset) return;
    if (infoCopy.current.isLoading) return;

    setInfoSync({ ...infoCopy.current, isLoading: true });
    const res = await request({ ...params, ...options, page });
    if (res instanceof AxiosError) return onError?.();
    setLastResultSync(res.data as never as PagingModel<T>);
    onSuccess &&
      onSuccess(
        (res.data as never as PagingModel<T>)?.items != null
          ? [...(res.data as never as PagingModel<T>).items]
          : []
      );
    if (withoutStateReset)
      setItemsSync(
        (res.data as never as PagingModel<T>)?.items != null
          ? [...(res.data as never as PagingModel<T>).items]
          : []
      );
    else {
      setItemsSync(
        (res.data as never as PagingModel<T>)?.items != null
          ? [
              ...itemsCopy.current,
              ...(res.data as never as PagingModel<T>).items,
            ]
          : [...itemsCopy.current]
      );
    }
    setInfoSync({
      isDone:
        (res.data as never as PagingModel<T>).items?.length <
        (options?.size ?? 20),
      isLoading: false,
      page,
      totalItems: (res.data as never as PagingModel<T>)?.totalItems,
    });
  }

  async function restart(withoutStateReset?: boolean) {
    !withoutStateReset && reset(); // A trick to avoid loading outdated data
    await load(1, withoutStateReset);
  }

  function reset() {
    setItemsSync([]);
    setInfoSync(initialPagingInfo(options?.page ?? 1));
    setLastResultSync(null);
  }

  function setData(data: T[]) {
    setItemsSync(data);
  }

  return {
    items,
    info,
    lastResult,
    setData,
    loadNext,
    reset,
    restart,
  };
};
