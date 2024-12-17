import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Post} from '../../../post';
import {UserService} from '../../../service/user.service';
import {SocketService} from '../../../service/socket.service';
import {User} from '../../../user';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'user-news',
  templateUrl: 'user.news.component.html',
  styleUrl: 'user.news.component.css',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgForOf, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule]
})
export class UserNewsComponent {
  @Input() id: number = 0;
  protected user: User;
  protected news: Post[];

  constructor(private userService: UserService,
              private socketService: SocketService,
              private route: ActivatedRoute) {
    this.id = route.snapshot.params['id'];
    this.user = {id: this.id, name: '', birth: '', email: '', role: '', status: ''};
    this.news = [];
    this.userService.getUser(this.id)
      .subscribe({
        next: (value: any) => this.user = value as User
      });
    userService.getUserNews(this.id)
      .subscribe({
        next: (value: any) => this.news = value as Post[]
      });
  }

  readonly post = new FormControl('', []);

  addPost() {
    if (this.post.value !== '') {
      this.userService.postUserPost(this.id, this.post.value ?? '')
        .subscribe((value: any) => {
          this.news = value as Post[];
          this.socketService.sendUpdate();
        });
    }
  }

  prettyDate(dateString: string): string {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
  }
}
