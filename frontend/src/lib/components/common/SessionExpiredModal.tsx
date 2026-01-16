import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../store/useModalStore';
import Button from './Button';

const SessionExpiredModal: React.FC = () => {
    const navigate = useNavigate();
    const { closeModal } = useModalStore();

    const handleConfirm = () => {
        closeModal();
        navigate('/login');
    };

    return (
        <div className="flex flex-col gap-p3 text-center">
            <p className="text-b1 text-subtext">
                Your session has expired. Please log in again to continue.
            </p>
            <div className="mt-p4 flex justify-center">
                <Button
                    text="Okay"
                    onClick={handleConfirm}
                    className="px-p5"
                />
            </div>
        </div>
    );
};

export default SessionExpiredModal;
