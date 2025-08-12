// StatusDetailModal.jsx
import { getBusinessTypeName } from '../pages/customer/CarRegisterStatuesPage.jsx';
import '../assets/css/components.css';

/**
 * 차량 상태에 대한 상세 정보를 표시하는 모달 컴포넌트
 *
 * @param {Object} props                    - 컴포넌트에 전달되는 속성들
 * @param {Object} props.status             - 차량 정보를 포함하는 상태 객체
 * @param {string} props.status.vhclNo      - 차량번호
 * @param {string} props.status.bizDv       - 업무구분
 * @param {number} props.status.splyAmt     - 공급가액
 * @param {string} props.status.vhidNo      - 차대번호
 * @param {string} props.status.vhclNm      - 차량이름
 * @param {string} props.status.ownrNm      - 소유자명
 * @param {function} props.onClose          - 모달이 닫힐 때 호출되는 콜백 함수
 *
 * @return {JSX.Element|null} `status`가 제공되면 StatusDetailModal 컴포넌트를, 그렇지 않으면 `null`을 반환합니다.
 */
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
                            <th>차량번호</th>
                            <td>{status.vhclNo}</td>
                        </tr>
                        <tr>
                            <th>업무구분</th>
                            <td>{getBusinessTypeName(status.bizDv)}</td>
                        </tr>
                        <tr>
                            <th>공급가액</th>
                            <td>{Number(status.splyAmt).toLocaleString()}원</td>
                        </tr>
                        <tr>
                            <th>차대번호</th>
                            <td>{status.vhidNo}</td>
                        </tr>
                        <tr>
                            <th>차명</th>
                            <td>{status.vhclNm}</td>
                        </tr>
                        <tr>
                            <th>소유자명</th>
                            <td>{status.ownrNm}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}