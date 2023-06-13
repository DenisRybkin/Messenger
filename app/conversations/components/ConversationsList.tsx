'use client';

import { FullConversationType } from '@/types';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConversation } from '@/hooks/useConversation';
import clsx from 'clsx';
import { ConversationBox } from '@/app/conversations/components/ConversationBox';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { EmptyItems } from '@/components/EmptyItems';
import { GroupChatModal } from '@/app/conversations/components/GroupChatModal';
import { User } from '@prisma/client';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';
import { pusherClient } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';
import { find } from 'lodash';
import { toast } from 'react-toastify';

interface ConversationsListProps {
  initialsItems: FullConversationType[];
  users: User[];
}

export const metadata = {
  title: 'Работай пж((',
  description: 'Real time messenger',
};

export const ConversationsList = (props: ConversationsListProps) => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const { conversationId, isOpen } = useConversation();

  const [isOpenGroupChatModal, setIsOpenGroupChatModal] =
    useState<boolean>(false);
  const [items, setItems] = useState<FullConversationType[]>(
    props.initialsItems
  );

  const handleOpenGroupChatModal = () => setIsOpenGroupChatModal(true);
  const handleCloseGroupChatModal = () => setIsOpenGroupChatModal(false);

  const handleNotifyAboutRemoveChat = (conversation: FullConversationType) => {
    toast.info(
      conversation.name
        ? `The ${conversation.name} chat has just been deleted`
        : `The conversation with ${
            conversation.users.find(cUser => cUser.name != user?.name)?.name
          }  just been deleted`
    );
  };

  useEffect(() => {
    if (!user?.email) return;

    const newConversationHandler = (conversation: FullConversationType) =>
      setItems(prev =>
        find(prev, { id: conversationId }) ? prev : [...prev, conversation]
      );

    const updateConversationHandler = (conversation: FullConversationType) =>
      setItems(prev =>
        prev.map(current =>
          current.id == conversation.id
            ? { ...current, messages: conversation.messages }
            : current
        )
      );

    const removeConversationHandler = (conversation: FullConversationType) => {
      setItems(prev => [
        ...prev.filter(current => current.id !== conversation.id),
      ]);
      if (conversation.id == conversationId) {
        router.push('/conversations');
        handleNotifyAboutRemoveChat(conversation);
      }
    };

    pusherClient.subscribe(user.email);
    pusherClient.subscribe(conversationId);
    pusherClient.bind(PusherKeys.NEW_CONVERSATION, newConversationHandler);
    pusherClient.bind(
      PusherKeys.REMOVE_CONVERSATION,
      removeConversationHandler
    );
    pusherClient.bind(
      PusherKeys.UPDATE_CONVERSATION,
      updateConversationHandler
    );

    return () => {
      pusherClient.unsubscribe(user.email!);
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind(PusherKeys.NEW_CONVERSATION, newConversationHandler);
      pusherClient.unbind(
        PusherKeys.REMOVE_CONVERSATION,
        removeConversationHandler
      );
      pusherClient.unbind(
        PusherKeys.UPDATE_CONVERSATION,
        updateConversationHandler
      );
    };
  }, [user?.email, conversationId]);

  return (
    <>
      <GroupChatModal
        users={props.users}
        isOpen={isOpenGroupChatModal}
        onClose={handleCloseGroupChatModal}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 pb-16 lg:pb-0 lg:left-20 lg:w-80 ' +
            'lg:block overflow-y-auto border-r border-gray-200',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5 h-full">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral">Messages</div>
            <div
              onClick={handleOpenGroupChatModal}
              className="rounded-full p-2 bg-gray-100 text-gray-500 cursor-pointer hover:opacity-75 hover:text-sky-500 transition"
            >
              <AiOutlineUsergroupAdd size={24} />
            </div>
          </div>
          {items.length ? (
            items.map(item => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={item.id == conversationId}
              />
            ))
          ) : (
            <EmptyItems text="Conversation&#39;s list is empty" />
          )}
        </div>
      </aside>
    </>
  );
};
