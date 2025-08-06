import {useNavigate} from 'react-router-dom';
import puppyImage from '../../assets/puppy.png';
import {useUser} from '../../contexts/UserProvider.jsx';
import {useEffect, useState} from "react";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import '../../assets/css/autoplus.css'; // 스타일시트 경로 수정

export default function AutoplusMyPage() {
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    const handleLogout = () => {
        setUser(null);
        navigate('/react_test/autoplus/login');
    };

    return (
        <div id="mypage-container">
            <div id="mypage-content">
                <div id="profile-section">
                    <img
                        src={puppyImage}
                        alt="프로필"
                        id="profile-image"
                    />
                    <div id="user-info">
                        <div id="user-id">아이디: {user.username}</div>
                        <div id="user-name">이름: {user.name}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    id="logout-button"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
}