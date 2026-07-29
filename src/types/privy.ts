export interface BackendWallet {
  id?: string;
  address: string;
  blockchain?: string;
  chainType?: string;
  [key: string]: unknown;
}
