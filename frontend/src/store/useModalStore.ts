import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    view: string | null; // e.g., 'ADD_TRANSACTION', 'EDIT_CATEGORY'
    props: Record<string, any>;
    title?: string;

    openModal: (view: string, props?: Record<string, any>, title?: string) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    view: null,
    props: {},
    title: undefined,

    openModal: (view, props = {}, title) => set({ isOpen: true, view, props, title }),
    closeModal: () => set({ isOpen: false, view: null, props: {}, title: undefined }),
}));
