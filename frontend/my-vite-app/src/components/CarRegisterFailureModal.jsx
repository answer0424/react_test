import React from 'react';
import '../assets/css/components.css';

/**
 * 자동차 신규 등록 실패 시 오류 메시지를 표시하는 모달 컴포넌트
 *
 * @param {Object} params           - 모달 컴포넌트에 대한 매개변수
 * @param {boolean} params.isOpen   - 모달 표시 여부
 * @param {Function} params.onClose - 모달이 닫힐 때 트리거되는 콜백 함수
 * @param {Object} params.errors    - 모달에 표시될 오류 메시지
 * @return {JSX.Element|null}
 */
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