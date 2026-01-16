import React from 'react';
import { useModalStore } from '../../../store/useModalStore';
import { X } from 'lucide-react';

import TransactionForm from '../expense-tracker/TransactionForm';
import SessionExpiredModal from '../common/SessionExpiredModal';

// Maps view strings to components (to be populated as we build them)
const MODAL_COMPONENTS: Record<string, React.FC<any>> = {
    'ADD_TRANSACTION': TransactionForm,
    'EDIT_TRANSACTION': TransactionForm,
    'SESSION_EXPIRED': SessionExpiredModal,
    // 'MANAGE_CATEGORIES': CategoryManager,
};

// We will inject components into this map or lazily load them to avoid circular deps if needed
// For now, we'll export a function to register components
export const registerModalComponent = (key: string, component: React.FC<any>) => {
    MODAL_COMPONENTS[key] = component;
};

const Modal: React.FC = () => {
    const { isOpen, view, props, title, closeModal } = useModalStore();

    if (!isOpen || !view) return null;

    const ModalContent = MODAL_COMPONENTS[view];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-p3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-secondary w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-p3 border-b border-white/5">
                    <h3 className="text-h4 font-bold text-text-main">{title || 'Modal'}</h3>
                    <button
                        onClick={closeModal}
                        className="p-1 hover:bg-white/5 rounded-full text-subtext hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-p3 max-h-[80vh] overflow-y-auto">
                    {ModalContent ? <ModalContent {...props} /> : <p className="text-error">View {view} not found</p>}
                </div>

            </div>
        </div>
    );
};

export default Modal;
