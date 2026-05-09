import { create } from 'zustand';

export const useVaultStore = create<VaultState>((set) => ({
  liveData: [],
  status: 'disconnected',
  setLiveData: (data) => set((state) => ({ liveData: [...state.liveData, data] })),
  setStatus: (status) => set({ status }),
}));