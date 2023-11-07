import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

export type RecentEditState = {
  edits: Array<{ id: string; gifUrl: string }>;
};

export type RecentEditStore = RecentEditState & {
  addEdit: (entry: { id: string; gifUrl: string }) => void;
  removeEdit: (id: string) => void;
};

type RecentEditPersist = (
  config: StateCreator<RecentEditStore>,
  options: PersistOptions<RecentEditStore>
) => StateCreator<RecentEditStore>;

const useRecentEdit = create<RecentEditStore>(
  (persist as RecentEditPersist)(
    (set): RecentEditStore => ({
      edits: [],
      addEdit: (entry) => set((state) => ({ edits: [entry, ...state.edits] })),
      removeEdit: (id) =>
        set((state) => ({
          edits: state.edits.filter((edit) => edit.id !== id),
        })),
    }),
    {
      name: 'recent-edits',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecentEdit;
