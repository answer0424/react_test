import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: expanded ? 180 : 56,
                background: '#23262f',
                transition: 'width 0.2s',
                zIndex: 100,
                boxShadow: '2px 0 8px rgba(0,0,0,0.10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: expanded ? 'flex-start' : 'center'
            }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div style={{
                width: '100%',
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: expanded ? 'flex-start' : 'center',
                paddingLeft: expanded ? 18 : 0,
                color: '#00bcd4',
                fontWeight: 'bold',
                fontSize: 22,
                borderBottom: '1px solid #444'
            }}>
                {expanded ? (isAutoplus ? 'Autoplus' : 'Customer') : (isAutoplus ? 'A' : 'C')}
            </div>
            <nav style={{marginTop: 24, width: '100%'}}>
                {menus.map(menu => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        style={{
                            display: 'block',
                            padding: expanded ? '12px 24px' : '12px 0',
                            color: location.pathname === menu.path ? '#00bcd4' : '#fff',
                            textDecoration: 'none',
                            fontSize: expanded ? 17 : 0,
                            fontWeight: location.pathname === menu.path ? 'bold' : 'normal',
                            background: location.pathname === menu.path ? '#181a20' : 'transparent',
                            borderRadius: 8,
                            marginBottom: 8,
                            transition: 'font-size 0.2s'
                        }}
                    >
                        {expanded ? menu.label : '•'}
                    </Link>
                ))}
            </nav>
        </div>
    );
}