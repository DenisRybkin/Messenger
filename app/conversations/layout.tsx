import { Sidebar } from '@/components/sidebar/Sidebar';
import { ConversationsList } from '@/app/conversations/components/ConversationsList';
import getConversations from '@/actions/getConversations';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { getUsers } from '@/actions/getUsers';

export default async function ({ children }: { children: React.ReactNode }) {
  const [currentUser, users, conversations] = await Promise.all([
    getCurrentUser(),
    getUsers(),
    getConversations(),
  ]);

  return (
    <Sidebar currentUser={currentUser}>
      <ConversationsList users={users} initialsItems={conversations} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
