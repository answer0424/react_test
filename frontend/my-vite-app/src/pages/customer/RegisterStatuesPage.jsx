import { useState } from 'react';

const dummyStatus = [
    { id: 1, number: '12가 3456', owner: '홍길동', status: '승인 대기', requestedAt: '2024-06-01' },
    { id: 2, number: '34나 7890', owner: '김철수', status: '승인 완료', requestedAt: '2024-05-28' },
    { id: 3, number: '56다 1234', owner: '이영희', status: '반려', requestedAt: '2024-05-25' },
];

export default function RegisterStatusPage() {
    const [statuses] = useState(dummyStatus);

    return (
        <div style={{
            background: '#181a20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: 420,
                padding: 32,
                borderRadius: 14,
                background: '#23262f',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)'
            }}>
                <h1 style={{ color: '#00bcd4', marginBottom: 24, textAlign: 'center' }}>번호판 등록 진행 상태</h1>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {statuses.length === 0 ? (
                        <div style={{ color: '#aaa', textAlign: 'center', padding: 24 }}>
                            진행 중인 등록 내역이 없습니다.
                        </div>
                    ) : (
                        statuses.map(item => (
                            <li key={item.id} style={{
                                background: '#23262f',
                                color: '#fff',
                                borderRadius: 8,
                                padding: '16px 20px',
                                marginBottom: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{item.number}</span>
                                <span style={{ color: '#00bcd4', fontSize: 15 }}>{item.owner}</span>
                                <span style={{ color: '#aaa', fontSize: 13 }}>
                                    상태: {item.status} / 신청일: {item.requestedAt}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}