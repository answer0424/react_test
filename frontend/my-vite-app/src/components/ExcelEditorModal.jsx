// components/ExcelEditorModal.jsx
import Modal from '../utils/Modal.jsx';
import '@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { SpreadSheets, Worksheet } from '@mescius/spread-sheets-react';
import {useCallback, useState} from 'react';

const functionMap = {
    plateRegisterEditor: {
        processData: (sheet, rowCount) => {
            const newRows = [];
            for (let i = 1; i < rowCount; i++) {
                const rowData = {
                    index: i,
                    차량번호: sheet.getValue(i, 1),
                    고객사: sheet.getValue(i, 2)
                };
                if (rowData.차량번호 || rowData.고객사) {
                    newRows.push(rowData);
                }
            }
            return newRows;
        },
        initSheet: (sheet) => {
            sheet.setColumnWidth(0, 80);
            sheet.setColumnWidth(1, 150);
            sheet.setColumnWidth(2, 200);
        }
    },
    // 다른 에디터 타입을 추가할 수 있음
    carRegisterEditor: {
        processData: (sheet, rowCount) => {
            // 다른 처리 로직
        },
        initSheet: (sheet) => {
            // 다른 초기화 로직
        }
    }
};

export default function ExcelEditorModal({ isOpen, onClose, rows, excelColumns, handleRowsChange, editorType = 'plateRegisterEditor' }) {
    const [spread, setSpread] = useState(null);

    const workbookInit = useCallback((spreadsheet) => {
        setSpread(spreadsheet);
        const sheet = spreadsheet.getActiveSheet();
        sheet.setRowCount(2000);

        const data = new Array(rows.length + 1).fill(null).map(() => new Array(excelColumns.length).fill(null));
        excelColumns.forEach((col, index) => {
            data[0][index] = col.name;
        });

        rows.forEach((row, rowIndex) => {
            excelColumns.forEach((col, colIndex) => {
                data[rowIndex + 1][colIndex] = row[col.key];
            });
        });

        sheet.setArray(0, 0, data);

        const headerRange = sheet.getRange(0, 0, 1, excelColumns.length);
        headerRange.backColor('#f8f9fa');
        headerRange.font('bold 12px Arial');

        functionMap[editorType].initSheet(sheet);

        sheet.options.gridline = { showVerticalGridline: true, showHorizontalGridline: true };
        sheet.options.colHeaderVisible = false;
        sheet.options.rowHeaderVisible = false;
    }, [rows, excelColumns, editorType]);

    const handleConfirm = useCallback(() => {
        if (!spread) return;

        const sheet = spread.getActiveSheet();
        const rowCount = sheet.getRowCount();

        const newRows = functionMap[editorType].processData(sheet, rowCount);

        const finalRows = newRows.map((row, idx) => ({
            ...row,
            index: idx + 1
        }));

        handleRowsChange(finalRows);
        onClose();
    }, [spread, handleRowsChange, onClose, editorType]);

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