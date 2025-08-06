import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../assets/css/components.css'; // 스타일시트 경로 수정

const autoplusMenus = [
    { path: '/autoplus/plates', label: '번호판 목록' },
    { path: '/autoplus/plate/add', label: '번호판 등록' },
    { path: '/autoplus/mypage', label: '마이페이지' },
];
const customerMenus = [
    { path: '/customer/plate/register', label: '차량 등록' },
    { path: '/customer/plate/search', label: '번호판 검색' },
    { path: '/customer/plate/status', label: '등록 상태' },
    { path: '/customer/mypage', label: '마이페이지' },
];

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const isAutoplus = location.pathname.startsWith('/autoplus');
    const menus = isAutoplus ? autoplusMenus : customerMenus;

    return (
        <div
            className={`sidebar ${expanded ? 'expanded' : ''}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="sidebar-header">
                {expanded ? (isAutoplus ? 'Autoplus' : 'Customer') : (isAutoplus ? 'A' : 'C')}
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