import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../assets/css/components.css';
import {useUser} from "../contexts/UserProvider.jsx";
import {useNavigate} from "react-router-dom";

const autoplusMenus = [
    { path: '/autoplus/VhclNoRegister', label: '차량번호 등록' },
    { path: '/autoplus/VhclNoList', label: '차량번호 목록' },
    { path: '/autoplus/VhclNoRegisterStatus', label: '차량번호 신규 등록 상태' },
];

const customerMenus = [
    { path: '/customer/VhclRegister', label: '자동차 신규 등록' },
    { path: '/customer/RegisterStatus', label: '자동차 신규 등록 상태' },
];

const carbangMenus = [
    { path: '/customer/RegisterStatus', label: '차량 등록 상태' },
];

/**
 * 내비게이션 메뉴를 나타내는 사이드바 컴포넌트
 *
 * @return {JSX.Element}
 */
export default function Sidebar() {
    const [expanded, setExpanded] = useState(true); // 사이드바 확장 상태

    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();

    // 회사명에 따라 메뉴를 반환하는 함수
    const getMenusByCompany = () => {
        switch (user?.company) {
            case 'AUTOPLUS':
                return autoplusMenus;
            case 'CARBANG':
                return carbangMenus;
            default:
                return customerMenus;
        }
    };

    const menus = getMenusByCompany();

    const handleLogout = () => {
        logout?.();
        navigate('/login');
    };

    return (
        <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
            <div className="sidebar-header">
                {expanded ? user?.company || 'Customer' : user?.company?.[0] || 'C'}
                <button
                    style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#2c3e50'
                    }}
                    onClick={() => setExpanded(prev => !prev)}
                    aria-label="사이드바 토글"
                >
                    {expanded ? '◀' : '▶'}
                </button>
            </div>
            <nav className="sidebar-nav">
                {menus.map(menu => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        className={`sidebar-link ${location.pathname === menu.path ? 'active' : ''}`}
                    >
                        {expanded ? menu.label : '•'}
                    </Link>
                ))}
            </nav>
        </div>
    );
}