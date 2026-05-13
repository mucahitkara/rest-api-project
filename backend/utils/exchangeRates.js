const NBP_BASE_URL = "https://api.nbp.pl/api/exchangerates";

const NBP_CURRENCY_MAP = {
  USD: "usd",
  EUR: "eur",
  GBP: "gbp",
  JPY: "jpy",
  CHF: "chf",
  CAD: "cad",
  AUD: "aud",
  CNY: "cny",
  PLN: "pln", // Base currency
};

// Custom rates for unsupported currencies (relative to USD)
const CUSTOM_RATES = {
  UZS: 0.000082,
  INR: 0.012,
  USD: 1.0,
};

const UNSUPPORTED = ["UZS", "INR"];

// Simple in-memory cache
const cache = {
  rates: {},
  lastUpdated: 0,
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetches current rate for a specific currency from NBP.
 * @param {string} currency 
 * @returns {Promise<number>}
 */
const fetchNBPRate = async (currency) => {
  if (currency === "PLN") return 1.0;
  
  const nbpCode = NBP_CURRENCY_MAP[currency];
  if (!nbpCode) throw new Error(`Currency ${currency} not supported by NBP`);

  // Check cache
  const now = Date.now();
  if (cache.rates[currency] && now - cache.lastUpdated < CACHE_DURATION) {
    return cache.rates[currency];
  }

  try {
    const response = await fetch(`${NBP_BASE_URL}/rates/a/${nbpCode}/?format=json`);
    if (!response.ok) throw new Error(`NBP API error: ${response.statusText}`);
    
    const data = await response.json();
    const rate = data.rates[0].mid;
    
    // Update cache
    cache.rates[currency] = rate;
    cache.lastUpdated = now;
    
    return rate;
  } catch (error) {
    console.error(`Error fetching NBP rate for ${currency}:`, error);
    // If we have a cached rate, use it even if expired as fallback
    if (cache.rates[currency]) return cache.rates[currency];
    throw error;
  }
};

/**
 * Calculates the converted amount based on live NBP rates.
 * @param {string} fromCurrency 
 * @param {string} toCurrency 
 * @param {number} amount 
 * @returns {Promise<number>}
 */
const calculateExchange = async (fromCurrency, toCurrency, amount) => {
  const fromUnsupported = UNSUPPORTED.includes(fromCurrency);
  const toUnsupported = UNSUPPORTED.includes(toCurrency);

  if (fromUnsupported || toUnsupported) {
    let conversionRate = 1.0;
    
    // We need USD to PLN rate for these conversions
    const usdToPln = await fetchNBPRate("USD");

    if (fromUnsupported && toUnsupported) {
      conversionRate = CUSTOM_RATES[fromCurrency] / CUSTOM_RATES[toCurrency];
    } else if (fromUnsupported) {
      const toRate = await fetchNBPRate(toCurrency);
      conversionRate = (CUSTOM_RATES[fromCurrency] * usdToPln) / toRate.rate;
    } else {
      const fromRate = await fetchNBPRate(fromCurrency);
      conversionRate = fromRate.rate / usdToPln / CUSTOM_RATES[toCurrency];
    }
    
    return parseFloat((amount * conversionRate).toFixed(4));
  }

  // Standard NBP conversion
  const [fromRate, toRate] = await Promise.all([
    fetchNBPRate(fromCurrency),
    fetchNBPRate(toCurrency),
  ]);

  const amountInPLN = amount * fromRate;
  const convertedAmount = amountInPLN / toRate;
  
  return parseFloat(convertedAmount.toFixed(4));
};

/**
 * Gets the rate of a currency relative to USD.
 * @param {string} currency 
 * @returns {Promise<number>}
 */
const getUSDRate = async (currency) => {
  if (currency === "USD") return 1.0;
  if (UNSUPPORTED.includes(currency)) return CUSTOM_RATES[currency];
  
  const [currencyRate, usdRate] = await Promise.all([
    fetchNBPRate(currency),
    fetchNBPRate("USD"),
  ]);
  
  return currencyRate / usdRate;
};

module.exports = { calculateExchange, getUSDRate };
