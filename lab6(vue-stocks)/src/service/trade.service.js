class TradeService {
  baseUrl = 'http://localhost:3030';
  tradeUrl = `${this.baseUrl}/trade`;

  getInfo() {
    return fetch(this.tradeUrl)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }
}

export default new TradeService();
