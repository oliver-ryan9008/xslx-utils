export * from './utils'

declare global {
  interface Number {
    /**
     * CUSTOM - Rounds the number to the specified number of decimal places and returns it as a float.
     *
     * @param {number} [digits=14] - The number of decimal places to round to. Defaults to 14.
     * @returns {number} - The rounded number as a float.
     *
     * @example
     * const value = 1.1234567890123456789;
     * console.log(value.toFixedFloat(6)); // Output: 1.123457
     */
    toFixedFloat(_digits?: number): number
    /**
     * CUSTOM - Counts the number of decimal places in the number.
     *
     * @returns {number} - The number of decimal places in the number. Returns 0 if the number is an integer.
     *
     * @example
     * const value = 1.12345;
     * console.log(value.countDecimals()); // Output: 5
     *
     * const integerValue = 42;
     * console.log(integerValue.countDecimals()); // Output: 0
     */
    countDecimals(): number
  }
}

Number.prototype.toFixedFloat = function (digits = 35) {
  const fixedValue = this.toFixed(digits)
  const floatValue = parseFloat(fixedValue)
  return floatValue
}

Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0
  return this.toString().split('.')[1]?.length ?? 0
}
