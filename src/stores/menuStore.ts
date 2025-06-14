
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuStore {
  isMenuOpen: boolean;
  activeMenuItem: string | null;
  setMenuOpen: (open: boolean) => void;
  setActiveMenuItem: (item: string | null) => void;
  toggleMenu: () => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      isMenuOpen: false,
      activeMenuItem: null,
      
      setMenuOpen: (open) => set({ isMenuOpen: open }),
      setActiveMenuItem: (item) => set({ activeMenuItem: item }),
      toggleMenu: () => set({ isMenuOpen: !get().isMenuOpen }),
    }),
    {
      name: 'agroforrest-menu-store',
      partialize: (state) => ({ activeMenuItem: state.activeMenuItem }),
    }
  )
);
