import { useEffect, useRef, useState } from 'react';
import { GETTickerAveragePrice } from './types/response/GetTickerAveragePrice';

export const useMarketData = (tickers: string[]) => {
  const [prices, setPrices] = useState<GETTickerAveragePrice[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (tickers.length === 0) return;

    if (!wsRef.current) {
      wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws');

      wsRef.current.onopen = () => {
        console.log('WebSocket abierto');
      };

      wsRef.current.onmessage = (event) => {
        console.log('Nuevo mensaje');
        const data = JSON.parse(event.data) as GETTickerAveragePrice;
        if (!data) return;
        setPrices(prevPrices => {
          if (prevPrices) {
            const updatedPrices = prevPrices.filter(price => price.s !== data.s);
            return [...updatedPrices, data];
          }
          return [data];
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket cerrado');
      };
    }

    const params = tickers.map(ticker => `${ticker.toLowerCase()}@avgPrice`);
    wsRef.current.send(JSON.stringify({
      method: "SUBSCRIBE",
      params,
      id: 1
    }));

    return () => {
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          method: "UNSUBSCRIBE",
          params,
          id: 1
        }));
      }
    };
  }, [tickers]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { prices, setPrices };
};