import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, map } from 'rxjs/operators';
import { getUser, login } from './user.action';
import { UserService } from 'src/app/api/user.service';

@Injectable()
export class TestEffect {
    constructor(
        private acction: Actions,
        private userService: UserService
    ) {}
    isloading = false;

    loadArticles$ = createEffect( () => 
        this.acction.pipe(
            ofType(login),
            switchMap((res) => {
                this.isloading = true;
                const user = {
                    username: res.username,
                    password: res.password
                }
                return this.userService.login(user).pipe(
                    take(1),
                    map((res1) => {
                        this.isloading = false;
                        return getUser({data: res1});
                    })
                );
            }),
        )
    );
}