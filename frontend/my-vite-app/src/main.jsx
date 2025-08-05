import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AutoplusLoginPage from "./pages/autoplus/LoginPage.jsx";
import PlateListPage from "./pages/autoplus/PlateListPage.jsx";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import PlateRegisterPage from "./pages/autoplus/PlateRegisterPage.jsx";
import AutoplusMyPage from "./pages/autoplus/MyPage.jsx";
import CustomerLoginPage from "./pages/customer/LoginPage.jsx";
import CarRegisterPage from "./pages/customer/CarRegisterPage.jsx";
import CustomerMyPage from "./pages/customer/MyPage.jsx";
import PlateSearchPage from "./pages/customer/PlateSearchPage.jsx";
import RegisterStatusPage from "./pages/customer/RegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";

function MainLayout() {
    const location = useLocation();
    const hideSidebar = [
        '/autoplus/login',
        '/customer/login'
    ].includes(location.pathname);

    return (
        <>
            {!hideSidebar && <Sidebar />}
            <div style={{marginLeft: !hideSidebar ? 180 : 0}}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/autoplus/login" element={<AutoplusLoginPage />} />
                    <Route path="/autoplus/plates" element={<PlateListPage />} />
                    <Route path="/autoplus/plate/add" element={<PlateRegisterPage />} />
                    <Route path="/autoplus/mypage" element={<AutoplusMyPage />} />
                    <Route path="/customer/login" element={<CustomerLoginPage />} />
                    <Route path="/customer/plate/register" element={<CarRegisterPage />} />
                    <Route path="/customer/mypage" element={<CustomerMyPage />} />
                    <Route path="/customer/plate/search" element={<PlateSearchPage />} />
                    <Route path="/customer/plate/status" element={<RegisterStatusPage />} />
                </Routes>
            </div>
        </>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <UserProvider >
                <MainLayout />
            </UserProvider>
        </BrowserRouter>
    </StrictMode>,
);