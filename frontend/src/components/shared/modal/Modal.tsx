import React from 'react';

interface ModalProps {
    isOpen: boolean;
    title?: string;
    content: React.ReactNode;
    onConfirm?: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    content,
    onConfirm,
    onCancel,
    confirmButtonText,
    cancelButtonText,
    showCloseButton = true
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onCancel();
    };

    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal" onClick={handleContentClick}>
                {(title || showCloseButton) && (
                    <header className="modal-header">
                        {title && <h2>{title}</h2>}
                        {showCloseButton && <button className='header-button' onClick={onCancel}>X</button>}
                    </header>
                )}
                <div className="modal-body">
                    {content}
                </div>
                {(onConfirm && confirmButtonText) || cancelButtonText ? (
                    <footer className="modal-footer">
                        {cancelButtonText && <button className='header-button' onClick={onCancel}>{cancelButtonText}</button>}
                        {onConfirm && confirmButtonText && <button className='header-button' onClick={onConfirm}>{confirmButtonText}</button>}
                    </footer>
                ) : null}
            </div>
        </div>
    );
};

export default Modal;
