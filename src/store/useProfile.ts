import { nanoid } from 'nanoid';
import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

export type ProfileStore = ProfileState & {
  setProfile: (userName: string) => Promise<void>;
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
      userAvatar: null,

      setProfile: async (userName: string) => {
        const userId = nanoid();
        set({ userId, userName, userAvatar: '' });
      },
    }),
    {
      name: 'editor',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProfileStore;
