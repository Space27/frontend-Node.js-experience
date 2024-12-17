import { Module } from "@nestjs/common";
import { StocksGateway } from "./stocks.gateway";
import { StocksService } from "./stocks.service";
import { StocksController } from "./stocks.controller";

@Module({
  providers: [StocksService, StocksGateway],
  controllers: [StocksController],
  exports: [StocksService, StocksGateway]
})
export class StocksModule {
}