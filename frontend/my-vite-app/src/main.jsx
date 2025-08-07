import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import AutoplusLoginPage from "./pages/autoplus/LoginPage.jsx";
import PlateListPage from "./pages/autoplus/PlateListPage.jsx";
import {HashRouter, Route, Routes, useLocation} from "react-router-dom";
import PlateRegisterPage from "./pages/autoplus/PlateRegisterPage.jsx";
import AutoplusMyPage from "./pages/autoplus/MyPage.jsx";
import LoginPage from "./pages/common/LoginPage.jsx";
import CarRegisterPage from "./pages/customer/CarRegisterPage.jsx";
import CustomerMyPage from "./pages/customer/MyPage.jsx";
import RegisterStatusPage from "./pages/customer/RegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";
import CarRegisterStatusPage from "./pages/autoplus/CarRegisterStatusPage.jsx";
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
                    <Route path="/autoplus/plates" element={<PlateListPage />} />
                    <Route path="/autoplus/plate/add" element={<PlateRegisterPage />} />
                    <Route path="/autoplus/mypage" element={<AutoplusMyPage />} />
                    <Route path="/autoplus/plate/status" element={<CarRegisterStatusPage />} />
                    <Route path="/customer/plate/register" element={<CarRegisterPage />} />
                    <Route path="/customer/mypage" element={<CustomerMyPage />} />
                    <Route path="/customer/plate/status" element={<RegisterStatusPage />} />
                    {/*<Route path="/autoplus/login" element={<AutoplusLoginPage />} />*/}
                    {/*<Route path="/customer/plate/search" element={<PlateSearchPage />} />*/}
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