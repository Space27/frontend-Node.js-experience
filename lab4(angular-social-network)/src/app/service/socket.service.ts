import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io('https://localhost:443');
  }

  public sendUpdate() {
    this.socket.emit('new_post');
  }

  public onUpdate() {
    return new Observable(observer => {
      this.socket.on('update', () => {
        observer.next();
      });
    });
  }
}
