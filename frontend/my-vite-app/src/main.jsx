import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import VhclNoListPage from "./pages/autoplus/VhclNoListPage.jsx";
import {HashRouter, Route, Routes, useLocation} from "react-router-dom";
import VhclNoRegisterPage from "./pages/autoplus/VhclNoRegisterPage.jsx";
import LoginPage from "./pages/common/LoginPage.jsx";
import VhclRegisterPage from "./pages/customer/VhclRegisterPage.jsx";
import RegisterStatusPage from "./pages/customer/CarRegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";
import VhclNoRegisterStatusPage from "./pages/autoplus/VhclNoRegisterStatusPage.jsx";
import './index.css';

function MainLayout() {
    const location = useLocation();
    const hideSidebar = [
        '/autoplus/login',
        '/customer/login',
        '/',
        '/login',
    ].includes(location.pathname);

    return (
        <>
            {!hideSidebar && <Sidebar />}
            <div style={{marginLeft: !hideSidebar ? 180 : 0}}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/autoplus/VhclNoRegister" element={<VhclNoRegisterPage />} />
                    <Route path="/autoplus/VhclNoList" element={<VhclNoListPage />} />
                    <Route path="/autoplus/VhclNoRegisterStatus" element={<VhclNoRegisterStatusPage />} />
                    <Route path="/customer/VhclRegister" element={<VhclRegisterPage />} />
                    <Route path="/customer/RegisterStatus" element={<RegisterStatusPage />} />
                </Routes>
            </div>
        </>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter >
            <UserProvider >
                <MainLayout />
            </UserProvider>
        </HashRouter>
    </StrictMode>,
);