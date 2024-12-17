import { Injectable, OnModuleInit } from "@nestjs/common";
import { Broker } from "./entity/broker";
import brokerJson from "../../data/broker/broker.json";
import fs from "fs";
import path from "path";
import { PostBrokerRequest } from "./dto/post.broker.request";
import { PatchBrokerRequest } from "./dto/patch.broker.request";
import { StocksService } from "../stocks/stocks.service";
import { BrokerGateway } from "./broker.gateway";

@Injectable()
export class BrokerService implements OnModuleInit {
  private brokers: Map<number, Broker> = new Map();

  constructor(private readonly stocksService: StocksService, private readonly brokerGateway: BrokerGateway) {
  }

  emitUpdate() {
    this.brokerGateway.send("update-brokers", this.getAll());
  }

  onModuleInit(): any {
    for (const broker of brokerJson) {
      this.brokers.set(broker.id, new Broker(broker.id, broker.name, broker.balance));
    }
  }

  updateJson() {
    fs.writeFileSync(path.join(path.resolve().replace("src/broker", ""), "/data/broker/broker.json"), JSON.stringify([...this.brokers.values()]), "utf-8");
  }

  getAll() {
    return [...this.brokers.values()];
  }

  getBrokerId(name: string) {
    const broker = [...this.brokers.entries()]
      .find(({ 1: v }) => v.name === name);

    if (broker) {
      return broker[1].id;
    } else {
      return null;
    }
  }

  getBrokerById(id: number) {
    return this.brokers.get(id);
  }

  deleteBroker(id: number) {
    if (this.brokers.delete(Number(id))) {
      this.updateJson();
      this.emitUpdate();
      return true;
    }

    return false;
  }

  addBroker(broker: PostBrokerRequest) {
    const newId: number = Math.max(...this.brokers.keys()) + 1;
    const newBroker = new Broker(newId, broker.name, Number(broker.balance));

    this.brokers.set(newId, newBroker);

    this.updateJson();
    this.emitUpdate();
  }

  updateBroker(id: number, request: PatchBrokerRequest) {
    const broker = this.brokers.get(Number(id));

    if (broker) {
      if (request.balance) broker.balance = Number(request.balance);
      if (request.name) broker.name = request.name;

      this.updateJson();
      this.emitUpdate();

      return true;
    } else {
      return false;
    }
  }

  buyStocks(id: number, symbol: string, count: number) {
    const broker = this.brokers.get(id);
    const stock = this.stocksService.getStock(symbol);

    if (broker && stock && broker.buyStocks(symbol, count, stock.price)) {
      this.stocksService.buyStock(symbol, count);
      this.updateJson();
      this.emitUpdate();
    } else {
      return false;
    }
  }

  sellStocks(id: number, symbol: string, count: number) {
    const broker = this.brokers.get(id);
    const stock = this.stocksService.getStock(symbol);

    if (broker && stock && broker.sellStocks(symbol, count, stock.price)) {
      this.stocksService.sellStock(symbol, count);
      this.updateJson();
      this.emitUpdate();
    } else {
      return false;
    }
  }
}