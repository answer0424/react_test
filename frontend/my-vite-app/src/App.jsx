import {Routes, Route, useLocation} from "react-router-dom";
import LoginPage from "./pages/common/LoginPage.jsx";
import VhclNoRegisterPage from "./pages/autoplus/VhclNoRegisterPage.jsx";
import VhclNoListPage from "./pages/autoplus/VhclNoListPage.jsx";
import VhclNoRegisterStatusPage from "./pages/autoplus/VhclNoRegisterStatusPage.jsx";
import VhclRegisterPage from "./pages/customer/VhclRegisterPage.jsx";
import RegisterStatusPage from "./pages/customer/CarRegisterStatuesPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

function App() {
    const location = useLocation();
    const hideNavigation = [
        '/login',
        '/autoplus/login',
        '/customer/login',
        '/',
    ].includes(location.pathname);

    return (
        <>
            {!hideNavigation && <Topbar />}
            {!hideNavigation && <Sidebar />}
            <div style={{marginLeft: !hideNavigation ? 180 : 0}}>
                <Routes>
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

export default App;