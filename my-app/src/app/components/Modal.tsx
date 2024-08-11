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
                    padding: 10px;
                    border-radius: 8px;
                    max-width: 90%;
                    max-height: 90%;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                .close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                    cursor: pointer;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 5px;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20%;
                    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
                }
                .close:hover {
                    background-color: rgb(226 232 240);
                
                }
                .modal-content {
                    display: block;
                    max-width: 100%;
                    max-height: calc(100vh - 60px);
                    margin: 0 auto;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

export default Modal;
