import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <span className="close" onClick={onClose}>&times;</span>
                <img src={imageUrl} alt="Full view" className="modal-content" />
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal {
                    position: relative;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 80%;
                    max-height: 80%;
                    overflow: auto;
                }
                .close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                    cursor: pointer;
                }
                .modal-content {
                    max-width: 100%;
                    max-height: 100%;
                }
            `}</style>
        </div>
    );
};

export default Modal;
