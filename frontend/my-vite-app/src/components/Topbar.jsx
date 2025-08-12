import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/components.module.css';
import { decrypt } from '../utils/LoginCrypto.jsx';

const TopBar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [loginTime, setLoginTime] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0.2 * 60); // 30분을 초 단위로

    // 사용자 정보 가져오기 및 복호화
    useEffect(() => {
        try {
            // 로컬 스토리지에서 암호화된 사용자 정보 가져오기
            const encryptedUser = localStorage.getItem('user');

            if (encryptedUser) {
                // LoginCrypto.jsx에 정의된 decrypt 함수 사용
                const decryptedUserString = decrypt(encryptedUser);
                console.log('topbar:', decryptedUserString);

                if (decryptedUserString) {
                    // JSON 파싱
                    const user = JSON.parse(decryptedUserString);

                    // 사용자 이름 설정
                    setUserName(user.username || '사용자');

                    // 로그인 시간 설정
                    const loginDate = new Date(user.loginTime || Date.now());
                    setLoginTime(loginDate.toLocaleString('ko-KR'));
                } else {
                    // 복호화 실패 시 기본값 사용
                    setUserName('사용자');
                    setLoginTime(new Date().toLocaleString('ko-KR'));
                }
            } else {
                setUserName('사용자');
                setLoginTime(new Date().toLocaleString('ko-KR'));
            }
        } catch (error) {
            console.error("사용자 정보 처리 오류:", error);
            setUserName('사용자');
            setLoginTime(new Date().toLocaleString('ko-KR'));
        }
    }, []);

    // 기존 코드는 그대로 유지
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowModal(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // 세션 연장 이벤트 리스너
        const extendSession = () => {
            setRemainingTime(30 * 60); // 30분 재설정
        };

        // 사용자 활동 감지 (클릭, 키보드 입력 등)
        window.addEventListener('click', extendSession);
        window.addEventListener('keypress', extendSession);

        return () => {
            clearInterval(timer);
            window.removeEventListener('click', extendSession);
            window.removeEventListener('keypress', extendSession);
        };
    }, []);

    // 남은 시간 포맷팅
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    // 세션 연장 처리
    const extendSession = () => {
        setRemainingTime(30 * 60);
        setShowModal(false);
    };

    return (
        <div className={styles.topBar}>
            <div className={styles.userInfo}>
                <div className={styles.loginInfo}>
                    <span>로그인: {loginTime}</span>
                </div>
                <div className={styles.userName}>
                    <span>{userName}님</span>
                </div>
                <div className={styles.sessionTime}>
                    <span>세션 만료까지: {formatTime(remainingTime)}</span>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>

            {/* 세션 만료 모달 */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>세션 만료 알림</h2>
                        <p>세션이 곧 만료됩니다. 계속 이용하시겠습니까?</p>
                        <div className={styles.modalButtons}>
                            <button onClick={extendSession}>세션 연장</button>
                            <button onClick={handleLogout}>로그아웃</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopBar;