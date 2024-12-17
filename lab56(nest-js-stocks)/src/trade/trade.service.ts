import { Injectable } from "@nestjs/common";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru.js";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TradeGateway } from "./trade.gateway";
import { StocksService } from "../stocks/stocks.service";

@Injectable()
export class TradeService {
  private startDate: Dayjs;
  private currentDate: Dayjs;
  private tick: number;
  private interval: NodeJS.Timeout;

  constructor(private readonly tradeGateway: TradeGateway, private readonly stocksService: StocksService) {
    dayjs.extend(customParseFormat);
    dayjs.locale("ru");
  }

  startTrade(startDate: string, tick: number) {
    if (!this.currentDate)
      this.currentDate = dayjs(this.stocksService.lastDate).startOf("day").add(1, "day");

    this.startDate = dayjs(startDate, "DD.MM.YYYY").startOf("day");
    this.tick = tick;

    this.interval = setInterval(() => this.day(), this.tick * 1000);
  }

  stopTrade() {
    clearInterval(this.interval);
  }

  info() {
    if (!this.currentDate)
      this.currentDate = dayjs(this.stocksService.lastDate).startOf("day").add(1, "day");
    return {
      stocks: [...this.stocksService.stocks.values()],
      date: this.currentDate.toDate()
    };
  }

  private day() {
    if (!this.currentDate.isBefore(this.startDate)) {
      this.stocksService.imitateTrades();
    }

    this.stocksService.fixPrice(this.currentDate.toDate());
    this.tradeGateway.send("update-trade", {
      stocks: [...this.stocksService.stocks.values()],
      date: this.currentDate.toDate()
    });

    this.currentDate = this.currentDate.add(1, "day");
  }
}