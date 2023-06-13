'use client';

import { MessageWithUsersType } from '@/types';
import { useContext, useEffect, useRef, useState } from 'react';
import { MessageBox } from '@/app/conversations/[conversationId]/components/MessageBox';
import { EmptyMessages } from '@/app/conversations/[conversationId]/components/EmptyMessages';
import { useConversation } from '@/hooks/useConversation';
import { pusherClient } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';
import { find } from 'lodash';
import axios from 'axios';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';
import { ViewTrigger } from '@/components/ViewTrigger';
import { usePaging } from '@/hooks/usePaging';
import { toast } from 'react-toastify';
interface ConversationBodyProps {
  initialMessages: MessageWithUsersType[];
  isGroup: boolean;
}

export const ConversationBody = (props: ConversationBodyProps) => {
  const { user } = useContext(AuthContext);

  const { conversationId } = useConversation();

  const bottomRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageWithUsersType[]>(
    props.initialMessages
  );
  const [testRef, setTestRef] = useState<HTMLDivElement | null>(null);

  const handleError = () => toast.error('Something went wrong...');

  const handleLoadMessages = (opts: any) =>
    axios.get(`/api/messages/${conversationId}`, { params: opts });

  const paging = usePaging<MessageWithUsersType>(
    handleLoadMessages,
    undefined,
    { page: 1, size: 20 },
    undefined,
    handleError,
    items => setMessages(prev => [...items, ...prev])
  );

  const handleScrollToDown = () => bottomRef?.current?.scrollIntoView();

  const handleSeenMessage = async (messageId: string) => {
    await axios.post(`/api/conversations/${conversationId}/seen/`, {
      messageId,
    });
  };

  useEffect(handleScrollToDown, [conversationId]);

  useEffect(() => {
    const messageHandler = (message: MessageWithUsersType) => {
      setMessages(prev =>
        !!find(prev, { id: message.id }) ? prev : [...prev, message]
      );
      handleScrollToDown();
    };

    const updateMessageHandler = (newMessage: MessageWithUsersType) => {
      setMessages(prev =>
        prev.map(current =>
          current.id == newMessage.id ? newMessage : current
        )
      );
    };

    pusherClient.subscribe(conversationId);
    pusherClient.bind(PusherKeys.NEW_MESSAGE, messageHandler);
    pusherClient.bind(PusherKeys.UPDATE_MESSAGE, updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind(PusherKeys.NEW_MESSAGE, messageHandler);
      pusherClient.unbind(PusherKeys.UPDATE_MESSAGE, updateMessageHandler);
    };
  }, [conversationId]);

  //rootMargin: '400px 0px 400px 0px',

  return (
    <div
      ref={ref => setTestRef(ref)}
      id="conversation-root"
      className="flex-1 overflow-y-auto relative"
    >
      <ViewTrigger
        disabled={paging.info.isLoading}
        options={{
          root: testRef,
          rootMargin: '700px 0px 700px 0px',
        }}
        onIntersection={paging.loadNext}
        hidden={paging.info.isDone}
        mt={5}
      />
      {messages?.length ? (
        <>
          {messages.map((message, index) => (
            <MessageBox
              data={message}
              key={message.id}
              isGroup={props.isGroup}
              onSeenMessage={handleSeenMessage}
              isLastToSeen={
                message.senderId == user?.id &&
                (!messages[index + 1] ||
                  !(messages[index + 1].senderId == user?.id) ||
                  messages[index + 1].seenIds.length == 1)
              }
            />
          ))}
          <div ref={bottomRef} className="pt-2" />
        </>
      ) : (
        <EmptyMessages isGroup={props.isGroup} />
      )}
    </div>
  );
};
