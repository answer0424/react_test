import React from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function LoginRequiredModal({ open, onMoveLogin }) {
    if (!open) return null;

    const navigate = useNavigate();
    const location = useLocation();

    const handleMoveLogin = () => {
        if(location.pathname.startsWith('/autoplus')) {
            navigate('/autoplus/login');
        } else {
            navigate('/customer/login');
        }
    }
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                background: "#23262f",
                padding: 32,
                borderRadius: 12,
                minWidth: 320,
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                color: "#fff",
                textAlign: "center"
            }}>
                <h2 style={{ color: "#00bcd4", marginBottom: 18 }}>로그인이 필요합니다</h2>
                <div style={{ marginBottom: 24 }}>이 페이지는 로그인이 필요합니다.</div>
                <button
                    onClick={handleMoveLogin}
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 6,
                        background: "#00bcd4",
                        color: "#181a20",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: 16,
                        cursor: "pointer"
                    }}
                >
                    로그인 페이지로 이동
                </button>
            </div>
        </div>
    );
}