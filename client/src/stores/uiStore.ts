import { create } from 'zustand';
import { ReactNode } from 'react';
import { Toast } from '@/types';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  toasts: Toast[];

  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  toasts: [],

  toggleSidebar: () => set((state) => ({
    isSidebarOpen: !state.isSidebarOpen
  })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  openModal: (content) => set({
    isModalOpen: true,
    modalContent: content
  }),

  closeModal: () => set({
    isModalOpen: false,
    modalContent: null
  }),

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  clearToasts: () => set({ toasts: [] }),
}));
