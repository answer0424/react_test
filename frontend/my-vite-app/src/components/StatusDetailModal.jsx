import {getBusinessTypeName} from '../pages/customer/RegisterStatuesPage.jsx';
import '../assets/css/components.css';


export default function StatusDetailModal({status, onClose}) {
    if (!status) return null;

    // 모달 외부 클릭 시 닫기
    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>상세 정보</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="detail-item">
                        <label>번호판:</label>
                        <span>{status.plateNumber}</span>
                    </div>
                    <div className="detail-item">
                        <label>업무구분:</label>
                        <span>{getBusinessTypeName(status.businessType)}</span>
                    </div>
                    <div className="detail-item">
                        <label>공급가액:</label>
                        <span>{Number(status.price).toLocaleString()}원</span>
                    </div>
                    <div className="detail-item">
                        <label>차대번호:</label>
                        <span>{status.vinNumber}</span>
                    </div>
                    <div className="detail-item">
                        <label>차명:</label>
                        <span>{status.carName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}