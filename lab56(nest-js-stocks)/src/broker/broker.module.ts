import { Module } from "@nestjs/common";
import { BrokerService } from "./broker.service";
import { BrokerController } from "./broker.controller";
import { BrokerGateway } from "./broker.gateway";
import { StocksModule } from "../stocks/stocks.module";

@Module({
  imports: [StocksModule],
  providers: [BrokerService, BrokerGateway],
  controllers: [BrokerController],
  exports: [BrokerService]
})
export class BrokerModule {
}