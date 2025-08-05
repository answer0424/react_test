import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlateRegisterPage({ addPlate }) {
    const [plateNumber, setPlateNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [model, setModel] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        if (!plateNumber || !ownerName || !vehicleType || !model) return;
        addPlate({ number: plateNumber, owner: ownerName, type: vehicleType, model });
        setPlateNumber('');
        setOwnerName('');
        setVehicleType('');
        setModel('');
        navigate('/plates');
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
                <h1 style={{ color: '#00bcd4', textAlign: 'center', marginBottom: 24 }}>번호판 등록</h1>
                <input
                    type="text"
                    placeholder="차량 번호"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
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
                    placeholder="소유자 이름"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
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
                    placeholder="차종"
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
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
                    placeholder="모델명"
                    value={model}
                    onChange={e => setModel(e.target.value)}
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
                    onClick={handleRegister}
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