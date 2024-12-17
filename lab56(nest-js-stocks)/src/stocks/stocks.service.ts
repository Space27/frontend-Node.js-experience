import { Injectable, OnModuleInit } from "@nestjs/common";
import { Stock } from "./entity/stock";
import { StockHistoryRow } from "./entity/stock.history.row";
import stocksJson from "../../data/stocks/stocks.json";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { StocksGateway } from "./stocks.gateway";

interface StockJson {
  symbol: string;
  name: string;
  isTrade: boolean;
  history: string;
}

@Injectable()
export class StocksService implements OnModuleInit {
  stocks: Map<string, Stock> = new Map();
  stocksHistory: Map<string, StockHistoryRow[]> = new Map();
  lastDate: Date;

  constructor(private readonly stocksGateway: StocksGateway) {
  }

  onModuleInit(): any {
    for (const stock of stocksJson) {
      const stockJson = stock as StockJson;

      const symbol: string = stockJson.symbol;
      const csv: string = stockJson.history;

      this.parseCsv(path.join(path.resolve().replace("src/stocks", ""), "/data/stocks/history/", csv))
        .then(res => {
          this.stocksHistory.set(symbol, res);
          this.stocks.set(symbol, new Stock(symbol, stockJson.name, res[0].price, stockJson.isTrade, csv));
          this.lastDate = res[0].date;
        });
    }
  }

  emitUpdate() {
    this.stocksGateway.send("update-stocks", this.getStocks());
  }

  emitHistoryUpdate() {
    this.stocksGateway.send("update-stocks-history", null);
  }

  async parseCsv(path: string): Promise<StockHistoryRow[]> {
    const history: StockHistoryRow[] = [];

    await new Promise(resolve => fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row: { Date?: string; Open?: string }) => {
        if (row.Date && row.Open) {
          history.push({ date: new Date(row.Date), price: parseFloat(row.Open.replace("$", "")) });
        }
      })
      .on("end", resolve));

    return [...history];
  }

  getStocks(): Stock[] {
    return [...this.stocks.values()];
  }

  getStock(symbol: string) {
    const stock = this.stocks.get(symbol);

    if (stock) {
      return stock;
    } else {
      return null;
    }
  }

  getStockHistory(symbol: string): StockHistoryRow[] | null {
    const history = this.stocksHistory.get(symbol);

    if (history) {
      return history;
    } else {
      return null;
    }
  }

  saveStocks() {
    const jsonStocks: StockJson[] = [...this.stocks.values()].map(e => ({
      symbol: e.symbol,
      name: e.name,
      isTrade: e.isTrade,
      history: e.history
    }));

    fs.writeFileSync(path.join(path.resolve().replace("src/stocks", ""), "/data/stocks/stocks.json"), JSON.stringify(jsonStocks), "utf-8");
  }

  setStockTrade(symbol: string, isTrade: boolean) {
    const stock = this.stocks.get(symbol);

    if (stock) {
      stock.isTrade = isTrade;

      this.saveStocks();
      this.emitUpdate();

      return true;
    } else {
      return false;
    }
  }

  fixPrice(date: Date) {
    for (const [key, value] of this.stocksHistory.entries()) {
      value.unshift({ date, price: this.stocks.get(key).price });
    }

    this.emitHistoryUpdate();
  }

  buyStock(symbol: string, count: number) {
    if (count <= 0)
      return false;

    const stock = this.stocks.get(symbol);

    return stock && stock.isTrade;
  }

  sellStock(symbol: string, count: number) {
    if (count <= 0)
      return false;

    const stock = this.stocks.get(symbol);

    return stock && stock.isTrade;
  }

  imitateTrades() {
    for (const stock of this.stocks.values()) {
      const percent = Math.random() * 5 / 100 + 1;

      if (Math.random() < 0.5) {
        stock.price *= percent;
      } else {
        stock.price /= percent;
      }
    }
    this.emitUpdate();
  }
}