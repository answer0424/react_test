import { useState } from 'react';

const dummyPlates = [
    { id: 1, number: '12가 3456', owner: '홍길동', type: '승용차', model: 'Hyundai Sonata' },
    { id: 2, number: '34나 7890', owner: '김철수', type: 'SUV', model: 'Kia K5' },
    { id: 3, number: '56다 1234', owner: '이영희', type: '승합차', model: 'Genesis GV80' },
    { id: 4, number: '78라 5678', owner: '박민수', type: '트럭', model: 'Porter II' },
    { id: 5, number: '90마 4321', owner: '최지훈', type: '승용차', model: 'Avante' },
];

export default function PlateSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlates = dummyPlates.filter(
        plate =>
            plate.number.includes(searchTerm) ||
            plate.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plate.owner.includes(searchTerm)
    );

    return (
        <div style={{
            background: '#181a20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: 420,
                padding: 32,
                borderRadius: 14,
                background: '#23262f',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)'
            }}>
                <h1 style={{ color: '#00bcd4', marginBottom: 24, textAlign: 'center' }}>번호판 검색</h1>
                <input
                    type="text"
                    placeholder="차량 번호, 모델, 소유자 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 18,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filteredPlates.length === 0 ? (
                        <div style={{ color: '#aaa', textAlign: 'center', padding: 24 }}>
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        filteredPlates.map(plate => (
                            <li key={plate.id} style={{
                                background: '#23262f',
                                color: '#fff',
                                borderRadius: 8,
                                padding: '16px 20px',
                                marginBottom: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{plate.number}</span>
                                <span style={{ color: '#00bcd4', fontSize: 15 }}>{plate.model}</span>
                                <span style={{ color: '#aaa', fontSize: 13 }}>{plate.owner} / {plate.type}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
