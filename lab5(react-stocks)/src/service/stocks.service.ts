import {Stock, StockDataElement} from "../pages/stocks/stocks";

export class StocksService {
    private baseUrl = 'http://localhost:3030';
    private stocksUrl = `${this.baseUrl}/stocks`;

    getStocks(): Promise<Stock[]> {
        return fetch(this.stocksUrl, {method: 'GET'})
            .then(res => res.json())
            .then(data => data as Stock[]);
    }

    getStockHistory(symbol: string) {
        return fetch(`${this.stocksUrl}/${symbol}`, {method: 'GET'})
            .then(res => res.json())
            .then(data => data as StockDataElement[]);
    }

    setStockTrade(symbol: string, isTrade: boolean) {
        return fetch(`${this.stocksUrl}/${symbol}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isTrade
            })
        });
    }
}