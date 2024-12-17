import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { BrokerModule } from "./broker/broker.module";
import { StocksModule } from "./stocks/stocks.module";
import { TradeModule } from "./trade/trade.module";

@Module({
  imports: [BrokerModule, StocksModule, TradeModule],
  controllers: [AppController]
})
export class AppModule {
}
