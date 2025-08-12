// src/components/Modal.jsx
import React from 'react';
import '../assets/css/components.css'

/**
 * 등록 성공 시 렌더링되는 모달 컴포넌트
 * 이 모달은 `isOpen` prop에 따라 조건부로 렌더링
 * 모달 콘텐츠 외부를 클릭하거나 닫기 버튼을 클릭하면 `onClose` 콜백이 트리거
 * 모달의 내용은 `children` prop을 통해 사용자 정의
 *
 * @param {Object} props                    - RegisterSuccessModal 컴포넌트의 속성
 * @param {boolean} props.isOpen            - 모달 표시 여부
 * @param {function} props.onClose          - 모달이 닫힐 때 트리거되는 콜백 함수
 * @param {React.ReactNode} props.children  - 모달 내부 내용
 * @return {React.ReactNode|null}
 */
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