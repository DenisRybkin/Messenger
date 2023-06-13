import { Conversation, Message, User } from '@prisma/client';

export type MessageWithUsersType = Message & {
  seen: User[];
  sender: User;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: MessageWithUsersType[];
};

export type ConversationWithUsers = Conversation & { users: User[] };
