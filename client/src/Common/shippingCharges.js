/**
 * Shipping charge lookup based on pin code prefix.
 *
 * | State        | Pin prefix(es)   | Charge (₹) |
 * |-------------|------------------|-----------|
 * | Kerala       | 67, 68, 69       | 99        |
 * | Tamil Nadu   | 60–66            | 99        |
 * | Karnataka    | 56–59            | 99        |
 * | Andhra       | 50–53            | 99        |
 * | Telangana    | 50               | 99        |
 * | Goa          | 403              | 99        |
 * | Others       | —                | 299       |
 */

// Rules are checked top-down; first match wins.
// More-specific prefixes (3-digit) come first.
const SHIPPING_RULES = [
  { prefixes: ["403"], charge: 99 },          // Goa
  { prefixes: ["67", "68", "69"], charge: 99 }, // Kerala
  { prefixes: ["60", "61", "62", "63", "64", "65", "66"], charge: 99 }, // Tamil Nadu
  { prefixes: ["56", "57", "58", "59"], charge: 99 }, // Karnataka
  { prefixes: ["50", "51", "52", "53"], charge: 99 }, // Andhra + Telangana
];

const DEFAULT_CHARGE = 299;

/**
 * Get shipping charge for a given pin code.
 * @param {string|number} pinCode - The delivery pin code.
 * @returns {number} Shipping charge in ₹.
 */
export function getShippingCharge(pinCode) {
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

export default getShippingCharge;
