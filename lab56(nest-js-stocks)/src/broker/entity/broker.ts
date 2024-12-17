export interface BrokerStock {
  symbol: string;
  count: number;
  spent: number;
  received: number;
}

export class Broker {
  public stocks: Map<string, BrokerStock>;

  constructor(
    public id: number,
    public name: string,
    public balance: number
  ) {
    this.stocks = new Map();
  }

  buyStocks(symbol: string, count: number, price: number) {
    if (this.balance < price * count)
      return false;

    this.balance -= price * count;

    const stock = this.stocks.get(symbol);

    if (stock) {
      stock.count += count;
      stock.spent += count * price;
    } else {
      this.stocks.set(symbol, { symbol, count, spent: count * price, received: 0 });
    }

    return true;
  }

  sellStocks(symbol: string, count: number, price: number) {
    const stock = this.stocks.get(symbol);

    if (stock) {
      if (stock.count < count)
        return false;

      stock.count -= count;
      stock.received += count * price;
      this.balance += count * price;

      return true;
    } else {
      return false;
    }
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      balance: this.balance,
      stocks: [...this.stocks.values()]
    };
  }
}