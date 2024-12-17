import { BrokerService } from "./broker.service";
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { PostBrokerRequest } from "./dto/post.broker.request";
import { PatchBrokerRequest } from "./dto/patch.broker.request";
import { PostBrokerNameRequest } from "./dto/post.broker.name.request";

@Controller("/broker")
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {
  }

  @Get()
  getAll() {
    return this.brokerService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: number) {
    const broker = this.brokerService.getBrokerById(Number(id));

    if (broker) {
      return broker;
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(":id")
  deleteBroker(@Param("id") id: number) {
    if (!this.brokerService.deleteBroker(id)) {
      throw new NotFoundException();
    }
  }

  @Post()
  addBroker(@Body() request: PostBrokerRequest) {
    this.brokerService.addBroker(request);
  }

  @Patch("/buy")
  buyStocks(@Body() request: { id: number, count: number, symbol: string }) {
    this.brokerService.buyStocks(Number(request.id), request.symbol, Number(request.count));
  }

  @Patch("/sell")
  sellStocks(@Body() request: { id: number, count: number, symbol: string }) {
    this.brokerService.sellStocks(Number(request.id), request.symbol, Number(request.count));
  }

  @Patch(":id")
  updateBroker(@Param("id") id: number, @Body() request: PatchBrokerRequest) {
    if (!this.brokerService.updateBroker(id, request)) {
      throw new NotFoundException();
    }
  }

  @Post("/name")
  getBrokerId(@Body() request: PostBrokerNameRequest) {
    const brokerId = this.brokerService.getBrokerId(request.name);

    if (brokerId) {
      return brokerId;
    } else {
      throw new NotFoundException();
    }
  }
}