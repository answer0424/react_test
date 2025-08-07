const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY || 'fallback-key';

const textToBytes = (text) => new TextEncoder().encode(text);
const bytesToText = (bytes) => new TextDecoder().decode(bytes);

// 🔐 암호화 (XOR + Base64)
export const encrypt = (text) => {
    try {
        const textBytes = textToBytes(text);
        const keyBytes = textToBytes(CRYPTO_KEY);
        const encryptedBytes = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
        const encryptedString = String.fromCharCode(...encryptedBytes);
        return btoa(encryptedString); // ✅ Base64 인코딩
    } catch (e) {
        console.error('Encryption failed:', e);
        return '';
    }
};

// 🔓 복호화 (Base64 → XOR 해제)
export const decrypt = (encoded) => {
    try {
        const encryptedString = atob(encoded);
        const encryptedBytes = textToBytes(encryptedString);
        const keyBytes = textToBytes(CRYPTO_KEY);
        const decryptedBytes = encryptedBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
        return bytesToText(Uint8Array.from(decryptedBytes));
    } catch (e) {
        console.error('Decryption failed:', e);
        return null;
    }
};
