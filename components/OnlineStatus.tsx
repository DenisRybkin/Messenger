'use client';

import { useOnlineChannel } from '@/hooks/useOnlineChannel';

export const OnlineStatus = () => {
  useOnlineChannel();

  return null;
};
