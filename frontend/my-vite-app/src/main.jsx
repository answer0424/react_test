import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import AutoplusLoginPage from "./pages/autoplus/LoginPage.jsx";
import PlateListPage from "./pages/autoplus/PlateListPage.jsx";
import {BrowserRouter, HashRouter, Route, Routes, useLocation} from "react-router-dom";
import PlateRegisterPage from "./pages/autoplus/PlateRegisterPage.jsx";
import AutoplusMyPage from "./pages/autoplus/MyPage.jsx";
import CustomerLoginPage from "./pages/customer/LoginPage.jsx";
import CarRegisterPage from "./pages/customer/CarRegisterPage.jsx";
import CustomerMyPage from "./pages/customer/MyPage.jsx";
import PlateSearchPage from "./pages/customer/PlateSearchPage.jsx";
import RegisterStatusPage from "./pages/customer/RegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {UserProvider} from "./contexts/UserProvider.jsx";
import CarRegisterPlatePage from "./pages/autoplus/CarRegisterPlatePage.jsx";

function MainLayout() {
    const location = useLocation();
    const hideSidebar = [
        '/react_test/autoplus/login',
        '/react_test/customer/login',
        '/react_test/'
    ].includes(location.pathname);

    return (
        <HashRouter>
            {!hideSidebar && <Sidebar />}
            <div style={{marginLeft: !hideSidebar ? 180 : 0}}>
                <Routes>
                    <Route path="/react_test/" element={<App />} />
                    <Route path="/react_test/autoplus/login" element={<AutoplusLoginPage />} />
                    <Route path="/react_test/autoplus/plates" element={<PlateListPage />} />
                    <Route path="/react_test/autoplus/plate/add" element={<PlateRegisterPage />} />
                    <Route path="/react_test/autoplus/mypage" element={<AutoplusMyPage />} />
                    <Route path="/react_test/autoplus/plate/status" element={<CarRegisterPlatePage />} />
                    <Route path="/react_test/customer/login" element={<CustomerLoginPage />} />
                    <Route path="/react_test/customer/plate/register" element={<CarRegisterPage />} />
                    <Route path="/react_test/customer/mypage" element={<CustomerMyPage />} />
                    <Route path="/react_test/customer/plate/search" element={<PlateSearchPage />} />
                    <Route path="/react_test/customer/plate/status" element={<RegisterStatusPage />} />
                </Routes>
            </div>
        </HashRouter>
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