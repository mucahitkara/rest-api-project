import axios from 'axios';
import { ExchangeRate, HistoricalRate, ConversionResult } from '@/types';

const NBP_BASE_URL = 'https://api.nbp.pl/api/exchangerates';

const NBP_CURRENCY_MAP: Record<string, string> = {
  USD: 'usd',
  EUR: 'eur',
  GBP: 'gbp',
  JPY: 'jpy',
  CHF: 'chf',
  CAD: 'cad',
  AUD: 'aud',
  CNY: 'cny',
};

interface NBPRateResponse {
  rates: Array<{ mid: number; effectiveDate: string }>;
}

export const nbpService = {
  getCurrentRate: async (currency: string): Promise<ExchangeRate> => {
    const nbpCode = NBP_CURRENCY_MAP[currency];
    if (!nbpCode) throw new Error(`Currency ${currency} not supported by NBP`);
    const response = await axios.get<NBPRateResponse>(
      `${NBP_BASE_URL}/rates/a/${nbpCode}/?format=json`
    );
    return {
      currency,
      rate: response.data.rates[0].mid,
      date: response.data.rates[0].effectiveDate,
    };
  },

  getHistoricalRates: async (currency: string, days = 30): Promise<HistoricalRate[]> => {
    const nbpCode = NBP_CURRENCY_MAP[currency];
    if (!nbpCode) throw new Error(`Currency ${currency} not supported by NBP`);
    const response = await axios.get<NBPRateResponse>(
      `${NBP_BASE_URL}/rates/a/${nbpCode}/last/${days}/?format=json`
    );
    return response.data.rates.map((rate) => ({ date: rate.effectiveDate, rate: rate.mid }));
  },

  getAllCurrentRates: async (): Promise<ExchangeRate[]> => {
    const currencies = Object.keys(NBP_CURRENCY_MAP);
    const results = await Promise.all(
      currencies.map((curr) => nbpService.getCurrentRate(curr).catch(() => null))
    );
    return results.filter((r): r is ExchangeRate => r !== null);
  },

  convertCurrency: async (from: string, to: string, amount: number): Promise<ConversionResult> => {
    const [fromRate, toRate] = await Promise.all([
      nbpService.getCurrentRate(from),
      nbpService.getCurrentRate(to),
    ]);
    const amountInPLN = amount * fromRate.rate;
    const convertedAmount = amountInPLN / toRate.rate;
    return {
      from,
      to,
      amount,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      fromRate: fromRate.rate,
      toRate: toRate.rate,
    };
  },
};

// Custom rates for unsupported currencies (relative to USD)
const CUSTOM_RATES: Record<string, number> = {
  UZS: 0.000082,
  INR: 0.012,
  USD: 1.0,
};

const UNSUPPORTED = ['UZS', 'INR'];

export const getConvertedAmount = async (
  amount: number,
  from: string,
  to: string,
  usdToPlnRate?: number
): Promise<number> => {
  const fromUnsupported = UNSUPPORTED.includes(from);
  const toUnsupported = UNSUPPORTED.includes(to);

  if (fromUnsupported || toUnsupported) {
    let conversionRate = 1.0;
    const usdToPln = usdToPlnRate || 4.0;

    if (fromUnsupported && toUnsupported) {
      conversionRate = CUSTOM_RATES[from] / CUSTOM_RATES[to];
    } else if (fromUnsupported) {
      const toRate = await nbpService.getCurrentRate(to);
      conversionRate = (CUSTOM_RATES[from] * usdToPln) / toRate.rate;
    } else {
      const fromRate = await nbpService.getCurrentRate(from);
      conversionRate = fromRate.rate / usdToPln / CUSTOM_RATES[to];
    }
    return parseFloat((amount * conversionRate).toFixed(2));
  }

  const result = await nbpService.convertCurrency(from, to, amount);
  return result.convertedAmount;
};
