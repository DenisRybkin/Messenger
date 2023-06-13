import { useParams } from 'next/navigation';
import { useMemo } from 'react';

interface IUseConversation {
  conversationId: string;
  isOpen: boolean;
}

export const useConversation = (): IUseConversation => {
  const params = useParams();

  const conversationId = useMemo(
    () => (params?.conversationId ?? '') as string,
    [params?.conversationId]
  );

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(() => ({ isOpen, conversationId }), [isOpen, conversationId]);
};
