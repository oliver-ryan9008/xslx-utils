import xlsx, { CellObject, WorkSheet } from 'xlsx'

/**
 * Gets the numeric values from a specified range in a worksheet.
 *
 * @param {WorkSheet} worksheet - The worksheet from which to retrieve the values.
 * @param {string} range - The range of cells to retrieve values from (e.g., "A1:B2").
 * @returns {(number | undefined)[][]} - A 2D array of numeric values from the specified range.
 * Each inner array represents a row of values, and each value is either a number or undefined if the cell is empty.
 *
 * @throws {Error} - Throws an error if the range is invalid or if the worksheet is not provided.
 *
 * @example
 * const worksheet = workbook.Sheets['Sheet1'];
 * const range = 'A1:B2';
 * const values = getRangeValues(worksheet, range);
 * console.log(values); // [[1, 2], [3, 4]]
 *
 */
export const getRangeValues = (worksheet: WorkSheet, range: string): (number | undefined)[][] => {
  const decodedRange = xlsx.utils.decode_range(range)
  const values: (number | undefined)[][] = []

  for (let row = decodedRange.s.r; row <= decodedRange.e.r; row++) {
    const rowValues: (number | undefined)[] = []
    for (let col = decodedRange.s.c; col <= decodedRange.e.c; col++) {
      const cellAddress = xlsx.utils.encode_cell({ r: row, c: col })
      const cell = worksheet[cellAddress]
      rowValues.push(cell?.v as number | undefined) // Push the cell value or undefined if the cell is empty
    }
    values.push(rowValues)
  }

  return values
}

/**
 * Gets the numeric value of a cell in a worksheet.
 *
 * @param {WorkSheet} worksheet - The worksheet where the cell is located.
 * @param {string} cellAddress - The address of the cell (e.g., "A1") to be retrieved.
 * @returns {number} The numeric value of the cell, or 0 if the cell is not found or not a number type.
 */
export const getCellNumericValue = (worksheet: WorkSheet, cellAddress: string): number => {
  const cell = worksheet[cellAddress]
  if (!cell || cell.t !== 'n') {
    return 0
  }

  return cell.v as number
}

/**
 * Gets the string value of a cell in a worksheet.
 *
 * @param {WorkSheet} worksheet - The worksheet where the cell is located.
 * @param {string} cellAddress - The address of the cell (e.g., "A1") to be retrieved.
 * @returns {string} The string value of the cell, or an empty string if the cell is not found or not a string type.
 */
export const getCellStringValue = (worksheet: WorkSheet, cellAddress: string): string => {
  const cell = worksheet[cellAddress]
  if (!cell || cell.t !== 's') {
    return ''
  }

  return cell.v as string
}

/**
 * Sets the value of a cell in a worksheet.
 *
 * @param {WorkSheet} worksheet - The worksheet where the cell value will be set.
 * @param {string} cellAddress - The address of the cell (e.g., "A1") to be set.
 * @param {number | string | CellObject | undefined} value - The value to be set in the cell. It can be a number, string, CellObject, or undefined.
 * @param {boolean} formatCell - Optional. If true, the cell will be formatted as a number or string. Defaults to true. Should be false when passing an entire CellObject.
 * @throws {Error} If the value is not a number, string, CellObject, or undefined.
 */
export const setCellValue = (
  worksheet: WorkSheet,
  cellAddress: string,
  value: number | string | CellObject | undefined,
  formatCell = true
): void => {
  if (!formatCell || typeof value === 'object') {
    worksheet[cellAddress] = value
    return
  }

  if (value === undefined) {
    worksheet[cellAddress] = { v: undefined }
    return
  }

  if (typeof value === 'string') {
    worksheet[cellAddress] = { t: 's', v: value }
    return
  }

  const isWholeNumber = value % 1 === 0

  const fixedValue = isWholeNumber ? value : value.toFixedFloat()

  const format = isWholeNumber ? '0' : '0.0000'

  worksheet[cellAddress] = { t: 'n', v: fixedValue, z: format }
}

/**
 * Copies the value of a specific cell from a source worksheet to a target worksheet.
 *
 * @param {WorkSheet} sourceSheet - The worksheet from which the cell value will be copied.
 * @param {WorkSheet} targetSheet - The worksheet to which the cell value will be copied.
 * @param {string} cellAddress - The address of the cell (e.g., "A1") to be duplicated.
 * @param {string} [targetCellAddress] - Optional. The address of the target cell (e.g., "B1") on the target sheet to copy to. If not provided, the source cell address will be used.
 *
 * @throws {Error} If the source cell does not exist in the source worksheet.
 */
export const duplicateToSheet = (
  sourceSheet: WorkSheet,
  targetSheet: WorkSheet,
  sourceCellAddress: string,
  targetCellAddress?: string
): void => {
  const cellAddress = targetCellAddress ?? sourceCellAddress

  const sourceCell = sourceSheet[cellAddress]
  targetSheet[cellAddress] = sourceCell
}

/**
 * Merges cells in a worksheet, creating a single cell that spans the specified range.
 *
 * @param {WorkSheet} worksheet - The worksheet where the cells will be merged.
 * @param {string} startAddress - The starting cell address (e.g., "A1").
 * @param {string} endAddress - The ending cell address (e.g., "B2").
 */
export const mergeCells = (worksheet: WorkSheet, startAddress: string, endAddress: string): void => {
  const startCell = xlsx.utils.decode_cell(startAddress)
  const endCell = xlsx.utils.decode_cell(endAddress)

  const mergedRange = {
    s: { r: startCell.r, c: startCell.c },
    e: { r: endCell.r, c: endCell.c }
  }

  if (!worksheet['!merges']) {
    worksheet['!merges'] = []
  }

  worksheet['!merges'].push(mergedRange)
}
