// components/ExcelEditorModal.jsx
import Modal from '../utils/Modal.jsx';
import '/react_test/gc.spread.sheets.excel2013white.css';
import { SpreadSheets, Worksheet } from '@mescius/spread-sheets-react';
import { useEffect, useCallback, useState} from 'react';
import * as GC from '@mescius/spread-sheets';
import PlateSearchModal from './PlateSearchModal.jsx';


const dummyPlates = [
    { id: 1, number: '12가3456' },
    { id: 2, number: '34나7890' },
    { id: 3, number: '56다1234' },
    { id: 4, number: '78라5678' },
    { id: 5, number: '90마9012' },
    { id: 6, number: '11바3456' },
    { id: 7, number: '22사7890' },
    { id: 8, number: '33아1234' },
    { id: 9, number: '44자5678' },
    { id: 10, number: '55차9012' },
    { id: 11, number: '123가3456'},
];

const businessTypes = [
    { code: '01', name: '렌트' },
    { code: '02', name: '리스' },
    { code: '03', name: '개인' },
];

const locationCompany = [
    {code: '001', name: 'CARBANG'},
    {code: '002', name: 'BMW 성수점'},
    {code: '003', name: 'KIA 건대점'},
    {code: '004', name: 'BMW 방이점'},
    {code: '005', name: 'KIA 잠실점'},
    {code: '006', name: 'HYUNDAI 강남점'},
    {code: '007', name: 'HYUNDAI 강서점'},
    {code: '008', name: 'HYUNDAI 강북점'},
    {code: '009', name: 'HYUNDAI 강동점'},
    {code: '010', name: 'HYUNDAI 강원점'},
    {code: '011', name: 'HYUNDAI 경기점'},
    {code: '012', name: 'HYUNDAI 충청점'},
]

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
            console.log('sheet, rowCount', sheet, rowCount);
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
            const newRows = [];
            for (let i = 1; i < rowCount; i++) {
                const plateNumber = sheet.getValue(i, 1);
                const businessType = sheet.getValue(i, 2);
                const price = sheet.getValue(i, 3);
                const vinNumber = sheet.getValue(i, 4);
                const carName = sheet.getValue(i, 5);
                const companyLocation = sheet.getValue(i, 6);

                // 차량번호가 더미데이터에 포함된 값만 허용
                if (dummyPlates.some(p => p.number === plateNumber)) {
                    newRows.push({
                        index: i,
                        차량번호: plateNumber,
                        업무구분: businessType,
                        공급가액: price,
                        차대번호: vinNumber,
                        차명: carName,
                        사용본거지: companyLocation
                    });
                }
            }
            console.log('sheet, rowCount', sheet, rowCount);
            return newRows;
        },
        initSheet: (sheet, rowCount, openPlateSearchModal) => {
            sheet.setColumnWidth(0, 80);  // index
            sheet.setColumnWidth(1, 120); // 차량번호
            sheet.setColumnWidth(2, 100); // 업무구분
            sheet.setColumnWidth(3, 100); // 공급가액
            sheet.setColumnWidth(4, 120); // 차대번호
            sheet.setColumnWidth(5, 120); // 차명
            sheet.setColumnWidth(6, 150); // 사용본거지

            // 셀 클릭 이벤트: 차량번호 셀 클릭 시 PlateSearchModal 오픈
            const handleCellClick = (sender, args) => {
                if (args.row > 0 && args.col === 1) {
                    openPlateSearchModal(args.row);
                }
            };
            sheet.bind(GC.Spread.Sheets.Events.CellClick, handleCellClick);


            // 차량번호 셀렉트 cellType 적용
            const plateNumbers = dummyPlates.map(p => p.number);
            const companyLocationNames = locationCompany.map(l => l.name);
            const businessTypeNames = businessTypes.map(b => b.name);
            for (let i = 1; i < rowCount; i++) {
                // 차량번호 셀
                // const plateCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
                // plateCombo.items(plateNumbers);
                // plateCombo.editorValueType(GC.Spread.Sheets.CellTypes.EditorValueType.text);
                // sheet.getCell(i, 1).cellType(plateCombo);

                // 업무구분 셀
                const businessCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
                businessCombo.items(businessTypeNames);
                businessCombo.editorValueType(GC.Spread.Sheets.CellTypes.EditorValueType.text);
                sheet.getCell(i, 2).cellType(businessCombo);

                // 사용본거지 셀
                const locationCombo = new GC.Spread.Sheets.CellTypes.ComboBox();
                locationCombo.items(companyLocationNames);
                locationCombo.editorValueType(GC.Spread.Sheets.CellTypes.EditorValueType.text);
                sheet.getCell(i, 6).cellType(locationCombo);

                console.log(sheet.getCell(i, 1).cellType(), sheet.getCell(i, 2).cellType(), sheet.getCell(i, 6).cellType());
            }
            console.log(sheet.getCell(1, 1).cellType(), sheet.getCell(1, 2).cellType(), sheet.getCell(1, 6).cellType());
            console.log(rowCount);
        }
    }
};

export default function ExcelEditorModal({ isOpen, onClose, rows, excelColumns, handleRowsChange, editorType = 'plateRegisterEditor' }) {
    console.log('ExcelEditorModal.isOpen');
    const [spread, setSpread] = useState(null);
    const [plateModalOpen, setPlateModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        if (!isOpen) setSpread(null); // 모달 닫힐 때 spread 초기화
    }, [isOpen]);

    const openPlateSearchModal = (row) => {
        setSelectedRow(row);
        setPlateModalOpen(true);
    };

    const closePlateSearchModal = () => {
        setPlateModalOpen(false);
        setSelectedRow(null);
    };

    const handlePlateSelect = (plate) => {
        if (spread && selectedRow !== null) {
            const sheet = spread.getActiveSheet();
            sheet.setValue(selectedRow, 1, plate.number); // 1번 컬럼: 차량번호
        }
        closePlateSearchModal();
    };

    const getSelectedPlateNumbers = () => {
        if (!spread) return [];
        const sheet = spread.getActiveSheet();
        const rowCount = sheet.getRowCount();
        const plateNumbers = [];
        for (let i = 1; i < rowCount; i++) {
            const plate = sheet.getValue(i, 1);
            if (plate) plateNumbers.push(plate);
        }
        return plateNumbers;
    };

    const workbookInit = useCallback((spreadsheet) => {
        console.log('workbookInit 호출');

        setSpread(spreadsheet);
        const sheet = spreadsheet.getActiveSheet();

        console.log('ExcelEditorModal.workbookInit', spreadsheet, sheet);

        sheet.setRowCount(20);

        const data = new Array(rows.length + 1).fill(null).map(() => new Array(excelColumns.length).fill(null));
        excelColumns.forEach((col, index) => {
            data[0][index] = col.name;
        });

        rows.forEach((row, rowIndex) => {
            excelColumns.forEach((col, colIndex) => {
                data[rowIndex + 1][colIndex] = row[col.key];
            });
        });

        console.log('ExcelEditorModal.data', data);

        sheet.setArray(0, 0, data);

        const headerRange = sheet.getRange(0, 0, 1, excelColumns.length);
        headerRange.backColor('#f8f9fa');
        headerRange.font('bold 12px Arial');

        const rowCount = sheet.getRowCount();
        functionMap[editorType].initSheet(sheet, rowCount, openPlateSearchModal);

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
                {plateModalOpen && (
                    <PlateSearchModal
                        isOpen={plateModalOpen}
                        onClose={closePlateSearchModal}
                        onSelect={handlePlateSelect}
                        plates={dummyPlates}
                        selectedPlateNumbers={getSelectedPlateNumbers()}
                    />
                )}
                <div className="excel-editor-button-group">
                    <button onClick={handleConfirm} className="excel-editor-save-btn">확인</button>
                    <button onClick={onClose} className="excel-editor-cancel-btn">취소</button>
                </div>
            </div>
        </Modal>
    );
}