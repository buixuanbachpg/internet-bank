import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"

@Injectable({
    providedIn: 'root'
})

export class userService {
    constructor(
        private http: HttpClient
    ){}

    getAll(limit, offset) {
        let url=`/${limit}${offset}`;
        return this.http.get(url);
    }

    login() {
        // let url=`/`;
        // let param = {
        //     username: 'asad@sss'
        // }
        // return this.http.get(url, param);
    }
}