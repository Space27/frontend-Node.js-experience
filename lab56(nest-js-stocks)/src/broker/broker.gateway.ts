import { Server } from "socket.io";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({
  namespace: "/broker",
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
  }
})
@Injectable()
export class BrokerGateway {
  @WebSocketServer() server: Server;

  send(event: string, src: any) {
    this.server.emit(event, src);
  }
}