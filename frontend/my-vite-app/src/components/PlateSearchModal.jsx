// components/PlateSearchModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../utils/Modal';
import '../assets/css/components.css';

export default function PlateSearchModal({ isOpen, onClose, onSelect, plates, selectedPlateNumbers = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlates, setFilteredPlates] = useState([]);

    useEffect(() => {
        setFilteredPlates(
            plates
                .filter(plate => !selectedPlateNumbers.includes(plate.number))
                .filter(plate =>
                    plate.number.toLowerCase().includes(searchTerm.toLowerCase())
                )
        );
    }, [searchTerm, plates, selectedPlateNumbers]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="plate-search-modal">
                <h2>차량번호 검색</h2>
                <div className="plate-search-box">
                    <input
                        type="text"
                        placeholder="차량번호를 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="plates-list">
                    {filteredPlates.map(plate => (
                        <div
                            key={plate.id}
                            className="plate-item"
                            onClick={() => {
                                onSelect(plate);
                                onClose();
                            }}
                        >
                            {plate.number}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}