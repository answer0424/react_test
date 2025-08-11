import Modal from '../utils/Modal.jsx';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PlateSearchModal from './PlateSearchModal.jsx';
import Handsontable from 'handsontable';
import {HotTable}  from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { DropdownCellType } from 'handsontable/cellTypes';
Handsontable.cellTypes.registerCellType('dropdown', DropdownCellType);

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
];

function processRows(rows, editorType) {
    if (editorType === 'plateRegisterEditor') {
        return rows.filter(row => row.차량번호 || row.고객사);
    }
    if (editorType === 'carRegisterEditor') {
        return rows.filter(row =>
            dummyPlates.some(p => p.number === row.차량번호)
        );
    }
    return rows;
}

export default function ExcelEditorModal({
                                             isOpen,
                                             onClose,
                                             rows,
                                             excelColumns,
                                             handleRowsChange,
                                             editorType = 'plateRegisterEditor'
                                         }) {
    const [tableData, setTableData] = useState([]);
    const [plateModalOpen, setPlateModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const hotRef = useRef(null);

    console.log('excelColumns rows: ',excelColumns, rows);

    useEffect(() => {
        if (isOpen) {
            const initialRows = Array.from({ length: 2000 }, (_, i) => {
                const row = rows[i] || {};
                return { index: i + 1, ...row };
            });
            setTableData(initialRows);

            // Handsontable 강제 렌더링
            setTimeout(() => {
                if (hotRef.current) {
                    hotRef.current.hotInstance.render();
                }
            }, 100);
        }
    }, [isOpen, rows]);

    // Handsontable columns 설정
    const columns = excelColumns.map(col => {
        if (editorType === 'carRegisterEditor' && col.key === '차량번호') {
            return {
                data: col.key,
                renderer: function(instance, td, row, colIdx, prop, value, cellProps) {
                    td.innerHTML = value || '차량번호 선택';
                    td.style.cursor = 'pointer';
                }
            };
        }
        if (editorType === 'carRegisterEditor' && col.key === '업무구분') {
            return {
                data: col.key,
                type: 'dropdown',
                source: businessTypes.map(b => b.name),
                allowInvalid: false
            };
        }
        if (editorType === 'carRegisterEditor' && col.key === '사용본거지') {
            return {
                data: col.key,
                type: 'dropdown',
                source: locationCompany.map(l => l.name),
                allowInvalid: false
            };
        }
        return { data: col.key };
    });

    // 차량번호 셀 클릭 시 PlateSearchModal 오픈
    const afterOnCellMouseDown = (event, coords, td) => {
        if (
            editorType === 'carRegisterEditor' &&
            coords.col >= 0 &&
            excelColumns[coords.col].key === '차량번호'
        ) {
            setSelectedRow(coords.row);
            setPlateModalOpen(true);
            event.stopImmediatePropagation();
        }
    };

    const closePlateSearchModal = useCallback(() => {
        setPlateModalOpen(false);
        setSelectedRow(null);
    }, []);

    const handlePlateSelect = useCallback((plate) => {
        setTableData(prev =>
            prev.map((row, idx) =>
                idx === selectedRow ? { ...row, vhclNo: plate.number } : row
            )
        );
        closePlateSearchModal();
    }, [selectedRow, closePlateSearchModal]);

    const getSelectedPlateNumbers = useCallback(() => {
        return tableData.map(row => row.차량번호).filter(Boolean);
    }, [tableData]);

    const handleConfirm = useCallback(() => {
        const newRows = processRows(tableData, editorType).map((row, idx) => ({
            ...row,
            index: idx + 1
        }));
        handleRowsChange(newRows);
        onClose();
    }, [tableData, handleRowsChange, onClose, editorType]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="excel-editor-content">
                <h2 className="excel-editor-title">엑셀 데이터 편집</h2>
                <div className="excel-editor-grid-container" style={{ height: 500 }}>
                    <HotTable
                        ref={hotRef}
                        data={tableData}
                        colHeaders={excelColumns.map(col => col.name)}
                        columns={columns}
                        rowHeaders={true}
                        height={500} // 숫자값으로 지정
                        width="100%"
                        licenseKey="non-commercial-and-evaluation"
                        afterOnCellMouseDown={afterOnCellMouseDown}
                        stretchH="all"
                        manualColumnResize={true}
                        manualRowResize={true}
                        outsideClickDeselects={false}
                        className="htCore"
                        afterChange={(changes, source) => {
                            if (source === 'edit' || source === 'Autofill.fill') {
                                setTableData([...tableData]);
                            }
                        }}
                    />
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