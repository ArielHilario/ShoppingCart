import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';
import { AlertController, NavController, MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;
  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
    private navCtrl: NavController
  ) { }
  login(email, password) {
    return this.http.post(this.env.API_URL + 'login',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.setItem('token', token)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );
  }
  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'register',
      {fName: fName, lName: lName, email: email, password: password}
    )
  }
  // logout() {
    
    
  //   const headers = new HttpHeaders({
  //     'Authorization': this.token["token_type"]+" "+this.token["access_token"]
  //   });
  //   return this.http.get(this.env.API_URL + 'auth/logout', { headers: headers })
  //   .pipe(
  //     tap(data => {
  //       this.storage.remove("token");
  //       this.isLoggedIn = false;
  //       delete this.token;
  //       return data;
  //     })
  //   )
  // }
  user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
    .pipe(
      tap(user => {
        return user;
      })
    )
  }
  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
  logoutClicked() {
    console.log('Logout');
    // this.authService.logout();
    this.navCtrl.navigateRoot('/landing');
  }
}