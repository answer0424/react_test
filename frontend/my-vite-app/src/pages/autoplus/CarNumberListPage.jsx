import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../assets/css/autoplus.css';
import {useUser} from "../../contexts/UserProvider.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";

function PlateList({plates}) {
    if (plates.length === 0) {
        return (
            <div id="plate-empty-message">
                등록된 차량번호가 없습니다.
            </div>
        );
    }
    return (
        <table id="plate-list-table">
            <thead>
            <tr>
                <th>차량번호</th>
                <th>고객사</th>
            </tr>
            </thead>
            <tbody>
            {plates.map(plate => (
                <tr key={plate.id} className="plate-item">
                    <td>{plate.number}</td>
                    <td>{plate.companyName}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default function CarNumberListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
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

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    const handleAddPlate = () => {
        navigate('/autoplus/plate/add');
    };

    // 더미 데이터 (고객사 포함)
    const dummyPlates = [
        { id: 1, number: '12가3456', companyName: '현대캐피탈 강남지점' },
        { id: 2, number: '34나5678', companyName: '현대캐피탈 강남지점' },
        { id: 3, number: '56다9012', companyName: '현대캐피탈 강북중고지점' },
        { id: 4, number: '78라3456', companyName: '현대캐피탈 강서지점' },
        { id: 5, number: '90마7890', companyName: '현대캐피탈 광진지점' },
        { id: 6, number: '11바1234', companyName: '현대캐피탈 마포지점' },
        { id: 7, number: '22사5678', companyName: '현대캐피탈 강남지점' },
        { id: 8, number: '33아9012', companyName: '현대캐피탈 강북중고지점' },
        { id: 9, number: '44자3456', companyName: '현대캐피탈 강서지점' },
        { id: 10, number: '55차7890', companyName: '현대캐피탈 강남지점' },
        { id: 11, number: '66카1234', companyName: 'KB캐피탈 강남지점' },
        { id: 12, number: '77타5678', companyName: 'KB캐피탈 강북지점' },
        { id: 13, number: '88파9012', companyName: 'KB캐피탈 강서지점' },
        { id: 14, number: '99하3456', companyName: 'KB캐피탈 서울지점' },
        { id: 15, number: '10허7890', companyName: 'KB캐피탈 생활금융부 집중화팀' },
        { id: 16, number: '20호1234', companyName: 'KB캐피탈 강남지점' },
        { id: 17, number: '30후5678', companyName: 'KB캐피탈 강남지점' },
        { id: 18, number: '40흐9012', companyName: 'KB캐피탈 강서지점' },
        { id: 19, number: '50휴3456', companyName: 'KB캐피탈 강남지점' },
        { id: 20, number: '60흰7890', companyName: '메리츠캐피탈 본점' },
        { id: 21, number: '70힘1234', companyName: '메리츠캐피탈 강남신차지점' },
        { id: 22, number: '80힐5678', companyName: '메리츠캐피탈 서울지점' },
        { id: 23, number: '90힙9012', companyName: '메리츠캐피탈 강남신차지점' },
        { id: 24, number: '11힙3456', companyName: '메리츠캐피탈 본점' },
        { id: 25, number: '21햇7890', companyName: '현대캐피탈 강남지점' },
        { id: 26, number: '31햄1234', companyName: '현대캐피탈 강서지점' },
        { id: 27, number: '41행5678', companyName: 'KB캐피탈 강남지점' },
        { id: 28, number: '51향9012', companyName: '메리츠캐피탈 서울지점' },
        { id: 29, number: '61허3456', companyName: 'KB캐피탈 강북지점' },
        { id: 30, number: '71현7890', companyName: '현대캐피탈 마포지점' }
    ];


    // 고객사 목록 추출
    const companyList = Array.from(new Set(dummyPlates.map(p => p.companyName)));

    // 필터링
    const filteredPlates = dummyPlates.filter(
        plate =>
            plate.number.includes(searchTerm) &&
            (selectedCompany === '' || plate.companyName === selectedCompany)
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
                    <select
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        id="plate-company-select"
                        style={{ minWidth: '120px', padding: '8px 12px', borderRadius: '4px', border: '1px solid #dde2e5', fontSize: '14px' }}
                    >
                        <option value="">전체 고객사</option>
                        {companyList.map(company => (
                            <option key={company} value={company}>{company}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddPlate}
                        id="plate-add-button"
                    >
                        신규 차량번호 등록
                    </button>
                </div>
                <div className="customer-results-count">
                    총 {filteredPlates.length}건
                </div>
                <div id="plate-list-table-wrapper">
                    <PlateList plates={filteredPlates}/>
                </div>
            </div>
        </div>
    );
}