import { Body, Controller, Get, NotFoundException, Param, Patch } from "@nestjs/common";
import { StocksService } from "./stocks.service";
import { PatchStockRequest } from "./dto/patch.stock.request";

@Controller("/stocks")
export class StocksController {
  constructor(private readonly stocksService: StocksService) {
  }

  @Get()
  getAll() {
    return this.stocksService.getStocks();
  }

  @Get(":symbol")
  getStockHistory(@Param("symbol") symbol: string) {
    const history = this.stocksService.getStockHistory(symbol);

    if (history) {
      return history;
    } else {
      throw new NotFoundException();
    }
  }

  @Patch(":symbol")
  updateStockTrade(@Param("symbol") symbol: string, @Body() request: PatchStockRequest) {
    if (!this.stocksService.setStockTrade(symbol, request.isTrade)) {
      throw new NotFoundException();
    }
  }
}