// components/ExcelEditorModal.jsx
import Modal from '../utils/Modal.jsx';
import '@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { SpreadSheets, Worksheet } from '@mescius/spread-sheets-react';
import {useCallback, useState} from 'react';

export default function ExcelEditorModal({ isOpen, onClose, rows, excelColumns, handleRowsChange }) {
    const [spread, setSpread] = useState(null);

    const workbookInit = useCallback((spreadsheet) => {
        setSpread(spreadsheet);
        const sheet = spreadsheet.getActiveSheet();

        // 기본 행 수를 충분히 설정
        sheet.setRowCount(2000);  // 필요한 만큼 조정 가능

        // 데이터 일괄 설정을 위한 배열 준비
        const data = new Array(rows.length + 1).fill(null).map(() => new Array(excelColumns.length).fill(null));

        // 헤더 데이터 설정
        excelColumns.forEach((col, index) => {
            data[0][index] = col.name;
        });

        // 행 데이터 설정
        rows.forEach((row, rowIndex) => {
            excelColumns.forEach((col, colIndex) => {
                data[rowIndex + 1][colIndex] = row[col.key];
            });
        });

        // 데이터 일괄 설정
        sheet.setArray(0, 0, data);

        // 스타일 일괄 설정
        const headerRange = sheet.getRange(0, 0, 1, excelColumns.length);
        headerRange.backColor('#f8f9fa');
        headerRange.font('bold 12px Arial');

        // 기본 설정
        sheet.setColumnWidth(0, 80);
        sheet.setColumnWidth(1, 150);
        sheet.setColumnWidth(2, 200);
        sheet.options.gridline = { showVerticalGridline: true, showHorizontalGridline: true };
        sheet.options.colHeaderVisible = false;
        sheet.options.rowHeaderVisible = false;
    }, [rows, excelColumns]);

    const handleConfirm = useCallback(() => {
        if (!spread) return;

        const sheet = spread.getActiveSheet();
        const rowCount = sheet.getRowCount();
        const newRows = [];

        for (let i = 1; i < rowCount; i++) {
            const rowData = {
                index: i,  // 인덱스는 행 번호 그대로 사용
                차량번호: sheet.getValue(i, 1),  // index 컬럼 다음이므로 1
                고객사: sheet.getValue(i, 2)     // 차량번호 다음이므로 2
            };

            // 실제 데이터가 있는 행만 추가
            if (rowData.차량번호 || rowData.고객사) {
                newRows.push(rowData);
            }
        }

        // 최종적으로 인덱스 재정렬
        const finalRows = newRows.map((row, idx) => ({
            ...row,
            index: idx + 1
        }));

        handleRowsChange(finalRows);
        onClose();
    }, [spread, handleRowsChange, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="excel-editor-content">
                <h2 className="excel-editor-title">엑셀 데이터 편집</h2>
                <div className="excel-editor-grid-container">
                    <SpreadSheets
                        workbookInitialized={workbookInit}
                        hostStyle={{
                            width: '100%',
                            height: '100%'
                        }}
                        backColor="white"
                    >
                        <Worksheet />
                    </SpreadSheets>
                </div>
                <div className="excel-editor-button-group">
                    <button onClick={handleConfirm} className="excel-editor-save-btn">확인</button>
                    <button onClick={onClose} className="excel-editor-cancel-btn">취소</button>
                </div>
            </div>
        </Modal>
    );
}