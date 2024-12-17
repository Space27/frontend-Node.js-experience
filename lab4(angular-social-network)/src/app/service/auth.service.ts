import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string) {
    return this.http.post('https://localhost:443/login', {email});
  }

  register(user: {email: string, name: string, birth: string}) {
    return this.http.post('https://localhost:443/register', user);
  }
}
