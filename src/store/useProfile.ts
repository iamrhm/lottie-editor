import { nanoid } from 'nanoid';
import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

export type ProfileStore = ProfileState & {
  setProfile: (userName: string) => void;
  logout: () => void;
};

type ProfilePersist = (
  config: StateCreator<ProfileStore>,
  options: PersistOptions<ProfileStore>
) => StateCreator<ProfileStore>;

const useProfileStore = create<ProfileStore>(
  (persist as ProfilePersist)(
    (set): ProfileStore => ({
      userId: null,
      userName: null,
      setProfile: (userName: string) => {
        const userId = nanoid();
        set({ userId, userName });
      },
      logout: () => set(() => ({ userId: null, userName: null })),
    }),
    {
      name: 'profile',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProfileStore;
