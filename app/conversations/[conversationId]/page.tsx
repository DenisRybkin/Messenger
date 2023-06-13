import { getConversationById } from '@/actions/getConversationById';
import { getMessages } from '@/actions/getMessages';
import { EmptyState } from '@/components/EmptyState';
import { ConversationHeader } from '@/app/conversations/[conversationId]/components/ConversationHeader';
import { ConversationBody } from '@/app/conversations/[conversationId]/components/ConversationBody';
import { ConversationFrom } from '@/app/conversations/[conversationId]/components/ConversationFrom';

interface IParams {
  conversationId: string;
}

interface PageProps {
  params: IParams;
}

const Page = async (props: PageProps) => {
  const [conversation, messages] = await Promise.all([
    getConversationById(props.params.conversationId),
    getMessages(props.params.conversationId),
  ]);

  if (!conversation)
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <ConversationHeader conversation={conversation} />
        <ConversationBody
          initialMessages={messages}
          isGroup={!!conversation.isGroup}
        />
        <ConversationFrom />
      </div>
    </div>
  );
};

export default Page;
