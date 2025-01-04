export type GETAllPositionsResponse = Array<{
  id:       string;
  account:  Account;
  price:    number;
  quantity: number;
  ticker:   Ticker;
}>

export interface Account {
  id: string;
}

export interface Ticker {
  id:     string;
  symbol: string;
  price: number;
}
