import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const dummyPlates = [
    {id: 1, number: '12가 3456', model: 'Hyundai Sonata'},
    {id: 2, number: '34나 7890', model: 'Kia K5'},
    {id: 3, number: '56다 1234', model: 'Genesis G80'},
];

function PlateList({plates}) {
    if (plates.length === 0) {
        return (
            <div style={{color: '#aaa', textAlign: 'center', padding: 24}}>
                등록된 차량이 없습니다.
            </div>
        );
    }
    return (
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            {plates.map(plate => (
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
                    <span style={{fontWeight: 'bold', fontSize: 18}}>{plate.number}</span>
                    <span style={{color: '#00bcd4', fontSize: 15}}>{plate.model}</span>
                </li>
            ))}
        </ul>
    );
}

export default function PlateListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddPlate = () => {
        navigate('/autoplus/plate/add');
    };

    const filteredPlates = dummyPlates.filter(
        plate => plate.number.includes(searchTerm) || plate.model.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 style={{color: '#00bcd4', marginBottom: 24, textAlign: 'center'}}>번호판 목록</h1>
                <input
                    type="text"
                    placeholder="차량 번호 또는 모델 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 16,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                />
                <button
                    onClick={handleAddPlate}
                    style={{
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: 6,
                        background: '#00bcd4',
                        color: '#181a20',
                        border: 'none',
                        fontSize: 16,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: 20
                    }}
                >
                    차량 추가
                </button>
                <PlateList plates={filteredPlates}/>
            </div>
        </div>
    );
}