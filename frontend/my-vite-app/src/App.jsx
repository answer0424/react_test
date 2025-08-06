import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

    function loginAutoplus() {
        navigate('/react_test/autoplus/login');
    }
    function loginCustomer() {
        navigate('/react_test/customer/login');
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => loginAutoplus()}>
                    오토플러스 로그인
                </button>
            </div>
            <div className="card">
                <button onClick={() => loginCustomer()}>
                    고객사 로그인
                </button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
