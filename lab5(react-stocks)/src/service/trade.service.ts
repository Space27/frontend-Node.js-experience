import {Stock} from "../pages/stocks/stocks";

export class TradeService {
    private baseUrl = 'http://localhost:3030';
    private tradeUrl = `${this.baseUrl}/trade`;

    startTrade(date: string, step: number) {
        return fetch(`${this.tradeUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date,
                step
            })
        });
    }

    stopTrade() {
        return fetch(`${this.tradeUrl}`, {method: 'DELETE'});
    }

    getInfo() {
        return fetch(`${this.tradeUrl}`, {method: 'GET'})
            .then(res => res.json())
            .then(data => data as { date: Date, stocks: Stock[] });
    }
}