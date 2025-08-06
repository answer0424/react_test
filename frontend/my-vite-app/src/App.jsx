import reactLogo from './assets/react.svg'
import {useNavigate} from "react-router-dom";

export default function App() {

    const navigate = useNavigate();

    function navigateCustomerLogin() {
        navigate('/react_test/customer/login');
    }

    function navigateAutoplusLogin() {
        navigate('/react_test/autoplus/login');
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => navigateAutoplusLogin()}>
                    오토플러스 로그인 페이지
                </button>
                <p>
                    오토플러스 로그인 페이지로 이동합니다.
                </p>
            </div>
            <div className="card">
                <button onClick={navigateCustomerLogin}>
                    고객사 로그인 페이지
                </button>
                <p>
                    고객사 로그인 페이지로 이동합니다.
                </p>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
            </p>
            </div>
        </>
    );
}

