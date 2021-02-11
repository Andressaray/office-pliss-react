import xls  from 'xlsx';
import path from 'path'
const exportExcel = (domicilios) => {
    const workBook = xls.utils.book_new()
    const workSheetData = [
        ...domicilios
    ]
    const workSheet = xls.utils.json_to_sheet(workSheetData)
    xls.utils.book_append_sheet(workBook, workSheet, 'Reporte Domicilios')
    xls.writeFile(workBook, path.resolve('Reporte Domicilios.xlsx'))
}
export { exportExcel }