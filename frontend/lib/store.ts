'use client';

import { create } from 'zustand';
import type { ChatMessage } from './types';

interface AppState {
  currentPage: string;
  selectedCountry: 'india' | 'us' | 'global';
  selectedRole: string | null;
  selectedSkill: string | null;
  selectedTimeRange: '6m' | '12m' | '24m';
  sidebarCollapsed: boolean;
  chatHistory: ChatMessage[];

  setPage: (page: string) => void;
  setCountry: (country: 'india' | 'us' | 'global') => void;
  setRole: (role: string | null) => void;
  setSkill: (skill: string | null) => void;
  setTimeRange: (range: '6m' | '12m' | '24m') => void;
  toggleSidebar: () => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  selectedCountry: 'india',
  selectedRole: null,
  selectedSkill: null,
  selectedTimeRange: '12m',
  sidebarCollapsed: false,
  chatHistory: [],

  setPage: (page) => set({ currentPage: page }),
  setCountry: (country) => set({ selectedCountry: country }),
  setRole: (role) => set({ selectedRole: role }),
  setSkill: (skill) => set({ selectedSkill: skill }),
  setTimeRange: (range) => set({ selectedTimeRange: range }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  addChatMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  clearChat: () => set({ chatHistory: [] }),
}));
