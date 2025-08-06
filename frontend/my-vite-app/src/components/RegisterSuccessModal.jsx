// src/components/Modal.jsx
import React from 'react';
import '../assets/css/components.css'

export default function RegisterSuccessModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="register-success-modal-overlay" onClick={onClose}>
            <div className="register-success-modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button className="register-success-modal-close" onClick={onClose}>확인</button>
            </div>
        </div>
    );
}