import { create } from 'zustand';

export type SessionState = {
  roomId: string | null;
  users: Array<ProfileState>;
};

export type SessionStore = SessionState & {
  updateUserList: (users: Array<ProfileState>) => void;
  updateRoomId: (roomId: string) => void;
};

const useSession = create<SessionStore>((set) => ({
  roomId: null,
  users: [],
  updateUserList: (users) => set(() => ({ users })),
  updateRoomId: (roomId) =>
    set(() => {
      return { roomId };
    }),
}));

export default useSession;
