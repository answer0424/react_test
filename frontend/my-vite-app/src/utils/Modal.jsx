// components/Modal.jsx
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto; position: relative; overflow-x: hidden; 
`;

const CloseButton = styled.button`
    position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; padding: 5px; color: #666; max-width: 30px;
    &:hover { color: #000; }
`;

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {children}
            </ModalContainer>
        </ModalOverlay>
    );
}