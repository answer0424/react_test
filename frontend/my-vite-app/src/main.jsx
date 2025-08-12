import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter, Route, Routes, useLocation} from "react-router-dom";
import App from './App.jsx'
import LoginPage from "./pages/common/LoginPage.jsx";
import VhclNoRegisterPage from "./pages/autoplus/VhclNoRegisterPage.jsx";
import VhclNoListPage from "./pages/autoplus/VhclNoListPage.jsx";
import VhclNoRegisterStatusPage from "./pages/autoplus/VhclNoRegisterStatusPage.jsx";
import VhclRegisterPage from "./pages/customer/VhclRegisterPage.jsx";
import RegisterStatusPage from "./pages/customer/CarRegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";
import './index.css';

function MainLayout() {
    const location = useLocation();
    const hideNavigation = [
        '/autoplus/login',
        '/customer/login',
        '/',
        '/login',
    ].includes(location.pathname);

    return (
        <>
            {!hideNavigation && <TopBar />}
            {!hideNavigation && <Sidebar />}
            <div style={{marginLeft: !hideNavigation ? 180 : 0}}>
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