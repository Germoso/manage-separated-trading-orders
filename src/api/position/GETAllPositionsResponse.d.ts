export type GETAllPositionsResponse = Array<{
  id:             string;
  account:        Account;
  price:          number;
  quantity:       number;
  ticker:         Ticker;
  positionStatus: PositionStatus;
  generalStatus:  GeneralStatus;
}>

export interface Account {
  id: string;
}

export interface Ticker {
  id:     string;
  symbol: string;
  price:  number;
}

type PositionStatus = "OPEN" | "CLOSED";
type GeneralStatus = "ACTIVE" | "INACTIVE";