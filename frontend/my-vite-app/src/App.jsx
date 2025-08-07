import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../public/vite.svg'
import './App.css'
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

    function login() {
        navigate('/login');
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank" className="vite">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" className="react">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => login()} className="viteLogin">
                    로그인
                </button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
