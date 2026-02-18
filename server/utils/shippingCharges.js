/**
 * Shipping charge lookup based on pin code prefix.
 *
 * | State        | Pin prefix(es)   | Charge (₹) |
 * |-------------|------------------|-----------|
 * | Kerala       | 67, 68, 69       | 70        |
 * | Tamil Nadu   | 60–66            | 90        |
 * | Karnataka    | 56–59            | 100       |
 * | Andhra       | 50–53            | 100       |
 * | Telangana    | 50               | 100       |
 * | Goa          | 403              | 100       |
 * | Others       | —                | 100       |
 */

const SHIPPING_RULES = [
  { prefixes: ["403"], charge: 100 },          // Goa
  { prefixes: ["67", "68", "69"], charge: 70 }, // Kerala
  { prefixes: ["60", "61", "62", "63", "64", "65", "66"], charge: 90 }, // Tamil Nadu
  { prefixes: ["56", "57", "58", "59"], charge: 100 }, // Karnataka
  { prefixes: ["50", "51", "52", "53"], charge: 100 }, // Andhra + Telangana
];

const DEFAULT_CHARGE = 100;

/**
 * Get shipping charge for a given pin code.
 * @param {string|number} pinCode - The delivery pin code.
 * @returns {number} Shipping charge in ₹.
 */
function getShippingCharge(pinCode) {
  if (!pinCode) return DEFAULT_CHARGE;

  const pin = String(pinCode).trim();
  if (!pin) return DEFAULT_CHARGE;

  for (const rule of SHIPPING_RULES) {
    for (const prefix of rule.prefixes) {
      if (pin.startsWith(prefix)) {
        return rule.charge;
      }
    }
  }

  return DEFAULT_CHARGE;
}

module.exports = { getShippingCharge };
