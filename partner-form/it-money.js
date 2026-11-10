/* Italian cash-register amounts. Digits shift in from the right.
   5 → 0,05, 1550 → 15,50, 125000 → 1.250,00.
   Stored value is euros as a number (15.5), or "" when empty.
   The one helper for every typed € field on the partner form. */
(function (root) {
  function formatCents(cents) {
    const s = String(Math.max(0, Math.round(cents))).padStart(3, "0");
    const dec = s.slice(-2);
    const int = s.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return int + "," + dec;
  }
  function formatItAmount(amount) {
    if (amount === "" || amount == null || !Number.isFinite(Number(amount))) return "";
    return formatCents(Math.round(Number(amount) * 100));
  }
  function priceFromDigits(raw) {
    const digits = String(raw ?? "").replace(/\D/g, "").slice(0, 9);
    if (!digits) return "";
    return Math.round(parseInt(digits, 10)) / 100;
  }
  root.ItMoney = { formatCents, formatItAmount, priceFromDigits };
})(typeof globalThis !== "undefined" ? globalThis : this);
