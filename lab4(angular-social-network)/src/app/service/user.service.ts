import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getUser(id: number) {
    return this.http.get(`https://localhost:443/user/${id}`);
  }

  getUsers() {
    return this.http.get(`https://localhost:443/user`);
  }

  getUserFriends(id: number) {
    return this.http.get(`https://localhost:443/user/${id}/friends`);
  }

  getUserNews(id: number) {
    return this.http.get(`https://localhost:443/user/${id}/news`);
  }

  getUserFriendsNews(id: number) {
    return this.http.get(`https://localhost:443/user/${id}/friends/news`);
  }

  postUserPost(id: number, text: string) {
    return this.http.post(`https://localhost:443/user/${id}/news`, {text});
  }

  postUserImage(id: number, image: File) {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    return this.http.patch(`https://localhost:443/user/${id}`, formData);
  }

  deleteUserImage(id: number) {
    return this.http.delete(`https://localhost:443/user/${id}/image`);
  }

  addUserFriend(userId: number, friendId: number) {
    return this.http.post(`https://localhost:443/user/${userId}/friends/${friendId}`, {});
  }

  removeUserFriend(userId: number, friendId: number) {
    return this.http.delete(`https://localhost:443/user/${userId}/friends/${friendId}`);
  }
}
