// UserProvider.jsx
import {createContext, useContext, useEffect, useState} from 'react';
import {decrypt, encrypt} from '../utils/LoginCrypto.jsx';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState(null);

    // logout 함수 정의
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            try {
                const decryptedUser = decrypt(sessionUser);
                console.log(decryptedUser); // ← 문자열 출력해보기

                const parsed = JSON.parse(decryptedUser); // ← 여기에 에러 나면 문자열 자체 문제
                setUser(parsed);
            } catch (e) {
                console.error('Failed to decode user data:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (user && isInitialized) {
            const encryptedUser = encrypt(JSON.stringify(user));
            sessionStorage.setItem('user', encryptedUser);
            localStorage.setItem('user', encryptedUser);
        }
    }, [user, isInitialized]);

    if (!isInitialized) {
        return null;
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}