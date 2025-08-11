import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import CarNumberListPage from "./pages/autoplus/CarNumberListPage.jsx";
import {HashRouter, Route, Routes, useLocation} from "react-router-dom";
import PlateRegisterPage from "./pages/autoplus/PlateRegisterPage.jsx";
import LoginPage from "./pages/common/LoginPage.jsx";
import CarRegisterPage from "./pages/customer/CarRegisterPage.jsx";
import RegisterStatusPage from "./pages/customer/CarRegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";
import CarNumberRegisterStatusPage from "./pages/autoplus/CarNumberRegisterStatusPage.jsx";
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
                    <Route path="/autoplus/plates" element={<CarNumberListPage />} />
                    <Route path="/autoplus/plate/add" element={<PlateRegisterPage />} />
                    <Route path="/autoplus/plate/status" element={<CarNumberRegisterStatusPage />} />
                    <Route path="/customer/plate/register" element={<CarRegisterPage />} />
                    <Route path="/customer/plate/status" element={<RegisterStatusPage />} />
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