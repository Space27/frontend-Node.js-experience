import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { TradeService } from "./trade.service";
import { SettingsRequest } from "./dto/settings.request";

@Controller("/trade")
export class TradeController {
  constructor(private readonly tradeService: TradeService) {
  }

  @Post()
  startTrade(@Body() settings: SettingsRequest) {
    this.tradeService.startTrade(settings.date, settings.step);
  }

  @Delete()
  stopTrade() {
    this.tradeService.stopTrade();
  }

  @Get()
  getInfo() {
    return this.tradeService.info();
  }
}