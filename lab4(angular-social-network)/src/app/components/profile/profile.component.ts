import {Component, inject} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {UserService} from '../../service/user.service';
import {User} from '../../user';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {AvatarDialogComponent} from './avatar_dialog/avatar.dialog.component';
import {UserNewsComponent} from './user_news/user.news.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrl: 'profile.component.css',
  standalone: true,
  imports: [HeaderComponent, MatCardModule, MatButtonModule, RouterLink, NgIf, UserNewsComponent, MatMenuModule, MatIconModule, NgForOf]
})
export class ProfileComponent {
  protected user: User;
  protected users: { isFriend: boolean, user: User }[];
  readonly dialog = inject(MatDialog);

  constructor(private userService: UserService,
              private route: ActivatedRoute) {
    let id: number = route.snapshot.params['id'];

    this.user = {id, name: '', birth: '', email: '', role: '', status: ''};
    this.users = [];

    userService.getUser(id)
      .subscribe({
        next: (value: any) => this.user = value as User
      });
    this.updateRelUsers(id);
  }

  updateRelUsers(id: number) {
    this.userService.getUserFriends(id)
      .subscribe((data: any) => {
        this.userService.getUsers()
          .subscribe((users: any) => {
            users = users.filter((user: any) => user.id != id);
            this.users = users.map((user: any) => {
              return {isFriend: data.includes(user.id), user}
            });
            this.users.sort((a, b) => Number(b.isFriend) - Number(a.isFriend));
          });
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent);

    dialogRef.componentInstance.submit.subscribe(data => {
      if (data)
        this.userService.postUserImage(this.user.id, data)
          .subscribe(value => {
            this.user = value as User;
          });
      else
        this.userService.deleteUserImage(this.user.id)
          .subscribe(value => {
            this.user = value as User;
          });
    });
  }

  removeFriend(id: number) {
    this.userService.removeUserFriend(this.user.id, id)
      .subscribe(() => {
        this.updateRelUsers(this.user.id);
      });
  }

  addFriend(id: number) {
    this.userService.addUserFriend(this.user.id, id)
      .subscribe(() => {
        this.updateRelUsers(this.user.id);
      });
  }

  prettyDate(dateString: string): string {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
  }
}
