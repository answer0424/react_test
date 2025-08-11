// CarNumberRegisterStatusPage.jsx
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import { demoPlateData } from "../../services/CarRegisterDummyData.jsx";
import LoginRequiredModal from "../../components/UserInfoRequiredModal.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider.jsx";

const STATUS_TABS = [
    { id: 'all', label: '전체' },
    { id: 'requested', label: '요청' },
    { id: 'pending', label: '대기' },
    { id: 'completed', label: '완료' }
];

const QuickDateSelector = ({ onSelect }) => {
    const getDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    };
    return (
        <div className="quick-date-selector">
            <button onClick={() => onSelect(new Date(), new Date())}>당일</button>
            <button onClick={() => onSelect(getDate(3), new Date())}>3일전</button>
            <button onClick={() => onSelect(getDate(7), new Date())}>7일전</button>
            <button onClick={() => onSelect(getDate(30), new Date())}>1개월전</button>
            <button onClick={() => onSelect(getDate(90), new Date())}>3개월전</button>
        </div>
    );
};

export default function CarNumberRegisterStatusPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('all');
    const [searchResults, setSearchResults] = useState(demoPlateData);
    const [showQuickSelect, setShowQuickSelect] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const [userInfoRequiredModalOpen, setUserInfoRequiredModalOpen] = useState(false);

    useEffect(() => {
        if (!user) setUserInfoRequiredModalOpen(true);
    }, [user, navigate]);

    if (!user || !user.username) {
        return <LoginRequiredModal open={userInfoRequiredModalOpen}/>;
    }

    const companies = [
        { id: 1, name: '현대자동차' },
        { id: 2, name: '기아자동차' },
        { id: 3, name: '르노코리아' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchResults(demoPlateData);
    };

    const filteredResults = searchResults.filter(result => {
        const statusMatch = activeTab === 'all' ||
            (activeTab === 'requested' && result.status === '요청') ||
            (activeTab === 'pending' && result.status === '대기') ||
            (activeTab === 'completed' && result.status === '완료');
        const companyMatch = !selectedCompany ||
            result.company === companies.find(c => c.id === parseInt(selectedCompany))?.name;
        const plateMatch = !searchTerm ||
            result.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const registeredDate = new Date(result.registeredAt);
        const dateMatch = registeredDate >= startDate.setHours(0, 0, 0, 0) &&
            registeredDate <= endDate.setHours(23, 59, 59, 999);
        return statusMatch && companyMatch && plateMatch && dateMatch;
    });

    const handleQuickSelect = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setShowQuickSelect(false);
    };

    return (
        <div className="customer-container">
            <div className="customer-content">
                <h1 className="customer-title">차량번호 신규 등록 상태</h1>

                <div className="customer-search-filters">
                    <div className="customer-search-row">
                        <input
                            type="text"
                            placeholder="차량번호 번호 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="customer-search-input"
                        />
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="company-select"
                        >
                            <option value="">고객사 선택</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        <div className="customer-date-picker-wrapper">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="customer-date-picker"
                            />
                            <span className="customer-date-separator">~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                                locale={ko}
                                className="customer-date-picker"
                            />
                            <button
                                className="customer-date-select-button"
                                onClick={() => setShowQuickSelect(!showQuickSelect)}
                            >
                                날짜선택
                            </button>
                            {showQuickSelect && (
                                <QuickDateSelector
                                    onSelect={handleQuickSelect}
                                />
                            )}
                        </div>
                        <button onClick={handleSearch} className="customer-search-button">검색</button>
                    </div>
                </div>

                <div className="customer-status-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`customer-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="customer-results-count">
                    총 {filteredResults.length}건
                </div>
                <div className="customer-results-table">
                    <table>
                        <thead>
                        <tr>
                            <th>차량번호</th>
                            <th>고객사</th>
                            <th>상태</th>
                            <th>접수일시</th>
                            <th>등록일시</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="customer-no-data">검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            filteredResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.plateNumber}</td>
                                    <td>{result.company}</td>
                                    <td>{result.status}</td>
                                    <td>{result.expiresAt}</td>
                                    <td>{result.registeredAt}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}