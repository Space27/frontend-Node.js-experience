class StocksService {
  baseUrl = 'http://localhost:3030';
  stocksUrl = `${this.baseUrl}/stocks`;

  getStocks() {
    return fetch(this.stocksUrl, {method: 'GET'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }

  getStockHistory(symbol) {
    return fetch(`${this.stocksUrl}/${symbol}`, {method: 'GET'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }
}

export default new StocksService()
