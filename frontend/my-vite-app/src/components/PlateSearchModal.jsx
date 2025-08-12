// components/PlateSearchModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../utils/Modal';
import '../assets/css/components.css';

/**
 * 번호판 검색 및 선택 모달 컴포넌트
 *
 * @param {Object} props                                    - 컴포넌트 속성들
 * @param {boolean} props.isOpen                            - 모달 표시 여부
 * @param {Function} props.onClose                          - 모달이 닫힐 때 트리거되는 콜백 함수
 * @param {Function} props.onSelect                         - 번호판이 선택되었을 때의 콜백 함수
 * @param {Array<Object>} props.plates                      - 선택 가능한 번호판 객체 배열(id`와 `number` 속성)
 * @param {Array<string>} [props.selectedPlateNumbers=[]]   - 선택된 차량 번호 제거 배열
 * @return {JSX.Element}
 */
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