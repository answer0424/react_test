// src/components/ValidationErrorModal.jsx
import React from 'react';
import '../assets/css/components.css'; // 스타일시트 경로 수정

export default function ExcelValidationErrorModal({ isOpen, onClose, errors }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content error-modal">
                <h2>데이터 검증 실패</h2>
                <div className="error-list">
                    {errors.map((error, index) => (
                        <p key={index} className="error-item">{error}</p>
                    ))}
                </div>
                <button onClick={onClose} className="close-button">
                    확인
                </button>
            </div>
        </div>
    );
}