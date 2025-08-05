import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const dummyPlates = [
    {id: 1, number: '12가 3456', model: 'Hyundai Sonata'},
    {id: 2, number: '34나 7890', model: 'Kia K5'},
    {id: 3, number: '56다 1234', model: 'Genesis GV80'},
    {id: 4, number: '78라 5678', model: 'Porter II'},
    {id: 5, number: '90마 4321', model: 'Avante'},
];

export default function CarRegisterPage({onRegister}) {
    const [selectedPlateId, setSelectedPlateId] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carColor, setCarColor] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!selectedPlateId || !carModel || !carColor) return;
        const plate = dummyPlates.find(p => p.id === Number(selectedPlateId));
        if (plate) {
            onRegister?.({
                plateId: plate.id,
                plateNumber: plate.number,
                carModel,
                carColor
            });
            setSelectedPlateId('');
            setCarModel('');
            setCarColor('');
            navigate('/customer/plate/search');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#181a20'
        }}>
            <div style={{
                width: 380,
                padding: 32,
                borderRadius: 12,
                background: '#23262f',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)'
            }}>
                <h1 style={{color: '#00bcd4', textAlign: 'center', marginBottom: 24}}>차량 등록</h1>
                <select
                    value={selectedPlateId}
                    onChange={e => setSelectedPlateId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 14,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                >
                    <option value="">번호판 선택</option>
                    {dummyPlates.map(plate => (
                        <option key={plate.id} value={plate.id}>
                            {plate.number} ({plate.model})
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="차량 모델명"
                    value={carModel}
                    onChange={e => setCarModel(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 14,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                />
                <input
                    type="text"
                    placeholder="차량 색상"
                    value={carColor}
                    onChange={e => setCarColor(e.target.value)}
                    style={{
                        width: '100%',
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 6,
                        border: '1px solid #444',
                        background: '#181a20',
                        color: '#fff',
                        fontSize: 16
                    }}
                />
                <button
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        padding: '12px 0',
                        borderRadius: 6,
                        background: '#00bcd4',
                        color: '#181a20',
                        border: 'none',
                        fontSize: 16,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    등록
                </button>
            </div>
        </div>
    );
}