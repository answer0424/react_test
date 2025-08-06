// StatusDetailModal.jsx
import { getBusinessTypeName } from '../pages/customer/RegisterStatuesPage.jsx';
import '../assets/css/components.css';

export default function StatusDetailModal({status, onClose}) {
    if (!status) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content detail-modal">
                <div className="modal-header">
                    <h3>차량 상세 정보</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <table className="detail-table">
                        <tbody>
                        <tr>
                            <th>번호판</th>
                            <td>{status.plateNumber}</td>
                        </tr>
                        <tr>
                            <th>업무구분</th>
                            <td>{getBusinessTypeName(status.businessType)}</td>
                        </tr>
                        <tr>
                            <th>공급가액</th>
                            <td>{Number(status.price).toLocaleString()}원</td>
                        </tr>
                        <tr>
                            <th>차대번호</th>
                            <td>{status.vinNumber}</td>
                        </tr>
                        <tr>
                            <th>차명</th>
                            <td>{status.carName}</td>
                        </tr>
                        <tr>
                            <th>소유자명</th>
                            <td>{status.ownerName}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}