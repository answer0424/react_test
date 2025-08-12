// src/components/ValidationErrorModal.jsx
import React from 'react';
import '../assets/css/components.css'; // 스타일시트 경로 수정

/**
 * 엑셀 데이터의 유효성 검증 오류를 표시하는 모달 컴포넌트
 *
 * @param {Object} props                - 컴포넌트에 전달되는 속성들
 * @param {boolean} props.isOpen        - 모달 표시 여부
 * @param {Function} props.onClose      - 모달이 닫힐 때 트리거되는 콜백 함수
 * @param {Array<string>} props.errors  - 모달에 표시될 오류 메시지 목록
 * @return {JSX.Element|null}
 */
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