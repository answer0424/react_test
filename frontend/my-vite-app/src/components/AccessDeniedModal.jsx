import React from 'react';

export default function AccessDeniedModal({open, onClose}) {
    if (!open) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: '#23262f',
                borderRadius: 12,
                padding: '32px 28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                minWidth: 320,
                textAlign: 'center'
            }}>
                <h2 style={{color: '#00bcd4', marginBottom: 18}}>접근 거부</h2>
                <div style={{color: '#fff', marginBottom: 24}}>
                    아이디 또는 비밀번호가 일치하지 않습니다.<br/>
                    다시 시도해 주세요.
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px 28px',
                        borderRadius: 6,
                        background: '#00bcd4',
                        color: '#181a20',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: 16,
                        cursor: 'pointer'
                    }}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}