import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../assets/css/components.css';
import {useUser} from "../contexts/UserProvider.jsx";

const autoplusMenus = [
    { path: '/autoplus/plate/add', label: '차량번호 등록' },
    { path: '/autoplus/plates', label: '차량번호 목록' },
    { path: '/autoplus/plate/status', label: '차량번호 신규 등록 상태' },
    { path: '/autoplus/mypage', label: '마이페이지' },
];

const customerMenus = [
    { path: '/customer/plate/register', label: '자동차 신규 등록' },
    { path: '/customer/plate/status', label: '자동차 신규 등록 상태' },
    { path: '/customer/mypage', label: '마이페이지' },
];

const carbangMenus = [
    { path: '/customer/plate/status', label: '차량 등록 상태' },
    { path: '/customer/mypage', label: '마이페이지' },
];

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true); // 기본값 true로 항상 보이게
    const location = useLocation();
    const { user } = useUser();

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