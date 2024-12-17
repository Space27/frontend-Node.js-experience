import {io} from "socket.io-client";

const URL = "http://localhost:3030";

export const brokerSocket = io(`${URL}/broker`);
export const stocksSocket = io(`${URL}/stocks`);
export const tradeSocket = io(`${URL}/trade`);
