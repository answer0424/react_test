import React from 'react';
import '../assets/css/components.css';


export default function CarRegisterFailureModal({ isOpen, onClose, errors }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>등록 오류</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="error-container">
                        <p className="error-title">다음 오류를 확인해주세요:</p>
                        <ul className="error-list">
                            {Object.values(errors).map((error, index) => (
                                <li key={index} className="error-item">{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="primary-button" onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
}