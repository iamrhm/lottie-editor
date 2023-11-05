import { create } from 'zustand';

export type SessionState = {
  roomId: string | null;
  users: Array<ProfileState>;
};

export type SessionStore = SessionState & {
  userJoined: (user: ProfileState) => void;
  userLeft: (userId: string) => void;
  updateRoomId: (roomId: string) => void;
};

const useSession = create<SessionStore>((set) => ({
  roomId: null,
  users: [],
  userJoined: (user) =>
    set((state: SessionState) => {
      const users = state.users;
      users.push(user);
      return { users };
    }),
  userLeft: (userId) =>
    set((state: SessionState) => {
      const users = state.users.filter((user) => user.userId !== userId);
      return { users };
    }),
  updateRoomId: (roomId) =>
    set(() => {
      return { roomId };
    }),
}));

export default useSession;
