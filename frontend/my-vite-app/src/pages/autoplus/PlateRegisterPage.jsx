import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/autoplus.css'; // 스타일시트 경로 수정

export default function PlateRegisterPage() {
    const [plateNumber, setPlateNumber] = useState('');
    const [multipleNumbers, setMultipleNumbers] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);
    const navigate = useNavigate();

    const handleSingleRegister = () => {
        if (!plateNumber) return;
        // TODO: API 호출로 단일 번호판 등록
        navigate('/react_test/autoplus/plates');
    };

    const handleMultipleRegister = () => {
        if (!multipleNumbers) return;
        const numbers = multipleNumbers
            .split('\n')
            .map(num => num.trim())
            .filter(num => num);
        if (numbers.length === 0) return;
        // TODO: API 호출로 다중 번호판 등록
        navigate('/react_test/autoplus/plates');
    };

    return (
        <div id="plate-register-container">
            <div id="plate-register-content">
                <h1 id="plate-register-title">번호판 등록</h1>

                <div id="register-type-toggle">
                    <button
                        className={!isMultiple ? 'active' : ''}
                        onClick={() => setIsMultiple(false)}
                    >
                        단일 등록
                    </button>
                    <button
                        className={isMultiple ? 'active' : ''}
                        onClick={() => setIsMultiple(true)}
                    >
                        다중 등록
                    </button>
                </div>

                {!isMultiple ? (
                    <div id="single-register-form">
                        <input
                            type="text"
                            placeholder="번호판 번호 입력"
                            value={plateNumber}
                            onChange={e => setPlateNumber(e.target.value)}
                            id="plate-number-input"
                        />
                        <button
                            onClick={handleSingleRegister}
                            id="register-button"
                        >
                            등록
                        </button>
                    </div>
                ) : (
                    <div id="multiple-register-form">
                        <textarea
                            placeholder="여러 번호판을 등록하려면 줄바꿈으로 구분해서 입력하세요"
                            value={multipleNumbers}
                            onChange={e => setMultipleNumbers(e.target.value)}
                            id="multiple-plates-input"
                        />
                        <button
                            onClick={handleMultipleRegister}
                            id="register-button"
                        >
                            일괄 등록
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}