import { create } from 'zustand';

export type SessionState = {
  roomId: string | null;
  users: Array<ProfileState>;
};

export type SessionStore = SessionState & {
  updateSession: (session: SessionState) => void;
  updateRoomId: (roomId: string) => void;
};

const useSession = create<SessionStore>((set) => ({
  roomId: null,
  users: [],
  updateSession: (session) => set(() => ({ ...session })),
  updateRoomId: (roomId) =>
    set(() => {
      return { roomId };
    }),
}));

export default useSession;
