import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/customer.css'; // 스타일시트 경로 수정

const dummyPlates = [
    { id: 1, number: '12가3456' },
    { id: 2, number: '34나7890' },
    { id: 3, number: '56다1234' },
    { id: 4, number: '78라5678' },
    { id: 5, number: '90마4321' },
];

const businessTypes = [
    { code: '01', name: '렌트' },
    { code: '02', name: '리스' },
    { code: '03', name: '개인' },
];

export default function CarRegisterPage() {
    const [formData, setFormData] = useState({
        plateId: '',
        businessType: '',
        price: '',
        vinNumber: '',
        carName: '',
        ownerName: '',
        idType: 'personal', // personal or business
        idNumber: '',
        hasCoOwner: false,
        coOwnerName: '',
        coOwnerIdType: 'personal',
        coOwnerIdNumber: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: 유효성 검사 및 데이터 처리
        console.log(formData);
        navigate('/react_test/customer/plate/search');
    };

    return (
        <div className="wrap">
            <div className="register_box">
                <h1 className="title">차량 등록</h1>
                <form id="registerForm" onSubmit={handleSubmit}>
                    <select
                        name="plateId"
                        value={formData.plateId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">번호판 선택</option>
                        {dummyPlates.map(plate => (
                            <option key={plate.id} value={plate.id}>
                                {plate.number}
                            </option>
                        ))}
                    </select>

                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">업무구분 선택</option>
                        {businessTypes.map(type => (
                            <option key={type.code} value={type.code}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="price"
                        placeholder="공급가액"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="vinNumber"
                        placeholder="차대번호"
                        value={formData.vinNumber}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="carName"
                        placeholder="차명"
                        value={formData.carName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="ownerName"
                        placeholder="소유자명"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                    />

                    <div className="id-type-selector">
                        <label>
                            <input
                                type="radio"
                                name="idType"
                                value="personal"
                                checked={formData.idType === 'personal'}
                                onChange={handleChange}
                            /> 주민번호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="idType"
                                value="business"
                                checked={formData.idType === 'business'}
                                onChange={handleChange}
                            /> 법인번호
                        </label>
                    </div>

                    <input
                        type="text"
                        name="idNumber"
                        placeholder={formData.idType === 'personal' ? "주민번호 입력" : "법인번호 입력"}
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                    />

                    <div className="co-owner-check">
                        <label>
                            <input
                                type="checkbox"
                                name="hasCoOwner"
                                checked={formData.hasCoOwner}
                                onChange={handleChange}
                            /> 공동 소유자 있음
                        </label>
                    </div>

                    {formData.hasCoOwner && (
                        <div className="co-owner-section">
                            <input
                                type="text"
                                name="coOwnerName"
                                placeholder="공동 소유자명"
                                value={formData.coOwnerName}
                                onChange={handleChange}
                                required
                            />

                            <div className="id-type-selector">
                                <label>
                                    <input
                                        type="radio"
                                        name="coOwnerIdType"
                                        value="personal"
                                        checked={formData.coOwnerIdType === 'personal'}
                                        onChange={handleChange}
                                    /> 주민번호
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="coOwnerIdType"
                                        value="business"
                                        checked={formData.coOwnerIdType === 'business'}
                                        onChange={handleChange}
                                    /> 법인번호
                                </label>
                            </div>

                            <input
                                type="text"
                                name="coOwnerIdNumber"
                                placeholder={formData.coOwnerIdType === 'personal' ? "주민번호 입력" : "법인번호 입력"}
                                value={formData.coOwnerIdNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit">등록</button>
                </form>
            </div>
        </div>
    );
}