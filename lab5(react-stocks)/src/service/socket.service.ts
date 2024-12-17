import {io} from 'socket.io-client'

const baseUrl = 'http://localhost:3030';

export const brokerSocket = io(`${baseUrl}/broker`, {autoConnect: false});
export const stocksSocket = io(`${baseUrl}/stocks`, {autoConnect: false});
export const tradeSocket = io(`${baseUrl}/trade`, {autoConnect: false});