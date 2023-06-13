import { create } from 'zustand';

interface IOnlineListStore {
  memberIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

export const useOnlineList = create<IOnlineListStore>(set => ({
  memberIds: [],
  add: id => set(state => ({ memberIds: [...state.memberIds, id] })),
  remove: id =>
    set(state => ({
      memberIds: state.memberIds.filter(memberId => memberId !== id),
    })),
  set: ids => set({ memberIds: ids }),
}));
