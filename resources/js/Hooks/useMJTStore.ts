import { create } from 'zustand';

interface MJTState {
    // Navigation & UI State
    isSidebarOpen: boolean;
    activeModule: string;
    
    // Notification State
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }>;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setActiveModule: (module: string) => void;
    addNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    removeNotification: (id: string) => void;
}

export const useMJTStore = create<MJTState>((set) => ({
    isSidebarOpen: true,
    activeModule: 'dashboard',
    notifications: [],

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    setActiveModule: (module) => set({ activeModule: module }),
    addNotification: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [...state.notifications, { id, type, message }],
        }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 5000);
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
}));
