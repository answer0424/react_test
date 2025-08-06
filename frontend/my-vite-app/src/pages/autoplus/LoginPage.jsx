import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AccessDeniedModal from "../../components/AccessDeniedModal.jsx";
import { useUser } from "../../contexts/UserProvider.jsx";
import '../../assets/css/autoplus.css';

export default function AutoplusLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [saveId, setSaveId] = useState(false);

    const dummyUsers = [
        { username: 'admin', password: 'admin123', name: '관리자' },
        { username: 'user1', password: 'password1', name: '사용자1' },
        { username: 'user2', password: 'password2', name: '사용자2' }
    ];

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
        if (savedUsername && savedRememberMe) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = () => {
        const found = dummyUsers.find(
            user => user.username === username && user.password === password
        );
        if (found) {
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.setItem('rememberMe', 'false');
            }
            setUser(found);
            navigate('/react_test/autoplus/plates');
        } else {
            setModalOpen(true);
        }
    };

    return (
        <div className="wrap">
            <AccessDeniedModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <div className="login_box">
                <div id="testlogo" className="test">
                    <b></b>
                </div>
                <h1 className="logo">AUTOPLUS</h1>
                <div className="login_img"></div>
                <form id="loginForm" onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}>
                    <select name="CORP_CD" id="CORP_CD">
                        <option value="001">AUTOPLUS</option>
                    </select>

                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={11}
                        id="id"
                        name="id"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={25}
                        id="password"
                        name="password"
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />

                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">아이디 저장</label>
                    </div>
                    <button type="submit">로그인</button>

                    <div id="pwErrTcnt" className="login_Err">
                        <b></b>
                    </div>
                </form>
            </div>
        </div>
    );
}