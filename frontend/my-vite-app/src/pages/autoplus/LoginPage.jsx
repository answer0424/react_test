import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AccessDeniedModal from "../../components/AccessDeniedModal.jsx";
import {useUser} from "../../contexts/UserProvider.jsx";


const dummyUsers = [
    { username: 'dlruddnjs', password: 'dlruddnjs' },
    { username: 'user2', password: '1234' },
    { username: 'user3', password: '1234' }
];

export default function AutoplusLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useUser();

    const handleLogin = () => {
        const found = dummyUsers.find(
            user => user.username === username && user.password === password
        );
        if (found) {
            setUser(found);
            navigate('/autoplus/plates');
        } else {
            setModalOpen(true);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#181a20'
        }}>
            <AccessDeniedModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <div style={{
                width: 350,
                padding: 32,
                borderRadius: 12,
                background: '#23262f',
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#00bcd4' }}>오토플러스</h1>
                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 16,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 24,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                />
                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '12px 0',
                        borderRadius: 6,
                        background: '#00bcd4',
                        color: '#181a20',
                        border: 'none',
                        fontSize: 16,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    로그인
                </button>
            </div>
        </div>
    );
}