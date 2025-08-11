import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/autoplus.css';
import {useUser} from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx"; // 스타일시트 경로 수정

function PlateList({plates}) {
    if (plates.length === 0) {
        return (
            <div id="plate-empty-message">
                등록된 차량번호가 없습니다.
            </div>
        );
    }
    return (
        <ul id="plate-list">
            {plates.map(plate => (
                <li key={plate.id} className="plate-item">
                    <span>{plate.number}</span>
                </li>
            ))}
        </ul>
    );
}

export default function CarNumberListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const {user} = useUser();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setUserInfoRequiredModalOpen(true);
        }
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddPlate = () => {
        navigate('/autoplus/plate/add');
    };

    // TODO 더미 데이터 (실제 API 호출로 대체 필요)
    const dummyPlates = [
        { id: 1, number: '12가 3456' },
        { id: 2, number: '34나 5678'},
        { id: 3, number: '56다 9012' },
        { id: 4, number: '78라 3456' },
        { id: 5, number: '90마 7890' },
    ];

    const filteredPlates = dummyPlates.filter(
        plate => plate.number.includes(searchTerm)
    );

    return (
        <div id="plate-list-container">
            <div id="plate-list-content">
                <h1 id="plate-list-title">차량번호 목록</h1>
                <div id="plate-list-actions">
                    <input
                        type="text"
                        placeholder="차량번호 검색..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        id="plate-search-input"
                    />
                    <button
                        onClick={handleAddPlate}
                        id="plate-add-button"
                    >
                        신규 차량번호 등록
                    </button>
                </div>
                <PlateList plates={filteredPlates}/>
            </div>
        </div>
    );
}