// User types
export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface UserWithId extends User {
  userid: string;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

// Currency types
export interface Currency {
  label: string;
  value: string;
  symbol: string;
  flag: string;
}

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'UZS'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY';

export interface Balances {
  [key: string]: number;
  USD: number;
  EUR: number;
  GBP: number;
  INR: number;
  JPY: number;
  UZS: number;
  CAD: number;
  AUD: number;
  CHF: number;
  CNY: number;
}
  
export interface WalletNumbers {
  [key: string]: string;
  USD: string;
  EUR: string;
  GBP: string;
  INR: string;
  JPY: string;
  UZS: string;
  CAD: string;
  AUD: string;
  CHF: string;
  CNY: string;
}

// Transaction types
export type TransactionType = 'send' | 'exchange';

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string | Date;
  senderName: string;
  targetName: string;
}

export interface TransactionDetail extends Transaction {
  userId?: string;
  targetId?: string;
}

// API Request/Response types
export interface TransferRequest {
  to: string;
  currency: string;
  amount: number;
}

export interface ExchangeRequest {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

export interface BalanceResponse {
  balances: Balances;
  walletNumbers: WalletNumbers;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
}

export interface TransactionDetailResponse {
  transaction: TransactionDetail;
}

export interface UsersResponse {
  users: UserWithId[];
}

export interface SigninResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponse extends SigninResponse {
  userId: string;
}

// NBP API types
export interface ExchangeRate {
  currency: string;
  rate: number;
  date: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  fromRate: number;
  toRate: number;
}
