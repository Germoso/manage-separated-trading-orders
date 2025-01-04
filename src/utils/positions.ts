export function calculatePnL (entryPrice: number, exitPrice: number, quantity: number): number {
  console.log('Calculando PnL');
  console.log(entryPrice, exitPrice, quantity);
  const pnl = (exitPrice - entryPrice) * quantity;
  return pnl;
}