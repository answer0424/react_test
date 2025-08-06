import reactLogo from './assets/react.svg'
import {useNavigate} from "react-router-dom";

function App() {

    const navigate = useNavigate();

    function navigateLogin() {
        navigate('/login');
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
                <button onClick={() => navigateLogin()}>
                    로그인 페이지 이동
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
