import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {UserService} from '../../service/user.service';
import {User} from '../../user';
import {ActivatedRoute} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {SocketService} from '../../service/socket.service';
import {Post} from '../../post';

@Component({
  selector: 'profile',
  templateUrl: 'news.component.html',
  styleUrl: 'news.component.css',
  standalone: true,
  imports: [HeaderComponent, MatCardModule, MatButtonModule, NgForOf],
})
export class NewsComponent {
  protected user: User;
  protected news: { author: User, content: Post }[];

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private socketService: SocketService) {
    let id: number = route.snapshot.params['id'];
    this.user = {
      id,
      name: '',
      birth: '',
      email: '',
      role: '',
      status: ''
    };
    this.news = [];
    userService.getUser(id)
      .subscribe({
        next: (value: any) => this.user = value as User
      });
    userService.getUserFriendsNews(id)
      .subscribe({
        next: (value: any) => this.news = value as { author: User, content: Post }[]
      });
    socketService.onUpdate()
      .subscribe((value: any) => {
        userService.getUserFriendsNews(id)
          .subscribe({
            next: (value: any) => this.news = value as { author: User, content: Post }[]
          });
      })
  }

  prettyDate(dateString: string): string {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
  }
}
