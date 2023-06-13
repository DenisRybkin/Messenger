import { Sidebar } from '@/components/sidebar/Sidebar';
import { getUsers } from '@/actions/getUsers';
import { UserList } from '@/app/users/components/UserList';
import { getCurrentUser } from '@/actions/getCurrentUser';

export default async function UsersLayout(props: {
  children: React.ReactNode;
}) {
  const [users, currentUser] = await Promise.all([
    getUsers(),
    getCurrentUser(),
  ]);

  return (
    <Sidebar currentUser={currentUser}>
      <div className="h-full">
        <UserList items={users} />
        {props.children}
      </div>
    </Sidebar>
  );
}
