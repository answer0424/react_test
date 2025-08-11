import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AccessDeniedModal from '../../components/AccessDeniedModal.jsx';
import { useUser } from "../../contexts/UserProvider.jsx";
import '../../assets/css/customer.css';

const dummyUsers = [
    { username: 'dlruddnjs1', password: 'dlruddnjs', name: 'CARBANG', company: 'CARBANG' },
    { username: 'dlruddnjs2', password: 'dlruddnjs', name: 'AUTOPLUS', company: 'AUTOPLUS' },
    { username: 'dlruddnjs3', password: 'dlruddnjs', name: 'HYUNDAI', company: 'HYUNDAI' },
    { username: 'dlruddnjs4', password: 'dlruddnjs', name: 'KIA', company: 'KIA' },
    { username: 'dlruddnjs5', password: 'dlruddnjs', name: 'GENESIS', company: 'GENESIS' }
];

const companies = ['CARBANG', 'AUTOPLUS', 'HYUNDAI', 'KIA', 'GENESIS'];

export default function LoginPage() {
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

            // 사용자 정보를 세션에 저장
            setUser({
                ...found,
                company: found.company // company 정보 명시적 포함
            });

            // 회사별 리다이렉션 경로 설정
            switch (found.company) {
                case 'CARBANG':
                    navigate('/customer/plate/status');
                    break;
                case 'AUTOPLUS':
                    navigate('/autoplus/plate/add');
                    break;
                default:
                    navigate('/customer/plate/register');
                    break;
            }
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