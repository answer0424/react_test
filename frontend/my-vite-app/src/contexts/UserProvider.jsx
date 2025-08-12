// UserProvider.jsx
import {createContext, useContext, useEffect, useState} from 'react';
import {decrypt, encrypt} from '../utils/LoginCrypto.jsx';

const UserContext = createContext(null);

/**
 * 사용자 정보를 관리하는 컨텍스트 프로바이더 컴포넌트
 * @param children
 * @returns {JSX.Element|null}
 * @constructor
 */
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

                const parsed = JSON.parse(decryptedUser);
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