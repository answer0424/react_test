import { useNavigate } from 'react-router-dom';
import puppyImage from '../../assets/puppy.png'; // 이미지 경로 수정
import { useUser } from '../../contexts/UserProvider.jsx';
import {useEffect, useState} from "react";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";

export default function AutoplusMyPage() {
    const navigate = useNavigate();
    const { user, setUser } = useUser(); // UserProvider에서 user 정보 가져오기
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen} />;
    }

    const handleLogout = () => {
        // 로그아웃 처리 로직 (예시)
        setUser(null); // UserProvider의 user 상태 초기화
        navigate('/autoplus/login');
    };

    return (
        <div style={{
            minWidth: 400,
            margin: '80px auto',
            padding: 32,
            background: '#23262f',
            borderRadius: 14,
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            textAlign: 'center'
        }}>
            <img
                src={puppyImage}
                alt="프로필"
                style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: 18 }}
            />
            <div style={{ fontWeight: 'bold', fontSize: 22, color: '#fff', marginBottom: 8 }}>아이디: {user.username}</div>
            <div style={{ color: '#aaa', marginBottom: 32 }}>이름: {user.name}</div>
            <button
                onClick={handleLogout}
                style={{
                    width: '100%',
                    padding: '12px 0',
                    borderRadius: 6,
                    background: '#e53935',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer'
                }}
            >
                로그아웃
            </button>
        </div>
    );
}