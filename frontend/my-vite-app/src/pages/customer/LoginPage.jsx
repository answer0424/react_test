import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AccessDeniedModal from '../../components/AccessDeniedModal.jsx';
import { useUser } from "../../contexts/UserProvider.jsx";
import '../../assets/css/customer.css';

const dummyUsers = [
    { username: 'dlruddnjs', password: 'dlruddnjs', name: '홍길동', company: '현대자동차' },
    { username: 'user2', password: '1234', name: '김철수', company: '기아자동차' },
    { username: 'user3', password: '1234', name: '이영희', company: '현대자동차' }
];

const companies = ['현대자동차', '기아자동차', '르노코리아'];

export default function CustomerLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

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
            user => user.username === username &&
                user.password === password &&
                user.company === company
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
            navigate('/react_test/customer/plate/register');
        } else {
            setModalOpen(true);
        }
    };

    return (
        <div className="wrap">
            <AccessDeniedModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <div className="login_box">
                <h1 className="logo">{company}</h1>
                <form id="loginForm">
                    <select
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="company-select"
                    >
                        <option value="">고객사 선택</option>
                        {companies.map(comp => (
                            <option key={comp} value={comp}>{comp}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <button type="button" onClick={handleLogin}>
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}