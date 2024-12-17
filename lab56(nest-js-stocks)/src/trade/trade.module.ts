import { Module } from "@nestjs/common";
import { TradeGateway } from "./trade.gateway";
import { TradeService } from "./trade.service";
import { TradeController } from "./trade.controller";
import { StocksModule } from "../stocks/stocks.module";
import { BrokerModule } from "../broker/broker.module";

@Module({
  imports: [StocksModule, BrokerModule],
  providers: [TradeService, TradeGateway],
  controllers: [TradeController]
})
export class TradeModule {
}