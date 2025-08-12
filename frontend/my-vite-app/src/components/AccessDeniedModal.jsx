import React from 'react';
import styles from '../assets/css/components.module.css';

/**
 * "접근 거부" 메시지 표시 모달 컴포넌트
 *
 * @param {Object} props            - 컴포넌트에 전달되는 속성들
 * @param {boolean} props.open      - 모달 표시 여부
 * @param {Function} props.onClose  - 트리거될 때 모달을 닫는 콜백 함수
 * @return {JSX.Element|null}
 */
export default function AccessDeniedModal({open, onClose}) {
    if (!open) return null;

    return (
        <div className={styles.accessDeniedModalOverlay}>
            <div className={styles.accessDeniedModalContainer}>
                <h2 className={styles.accessDeniedModalHeading}>접근 거부</h2>
                <div className={styles.accessDeniedModalText}>
                    아이디 또는 비밀번호가 일치하지 않습니다.<br/>
                    다시 시도해 주세요.
                </div>
                <button
                    onClick={onClose}
                    className={styles.accessDeniedModalButton}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}