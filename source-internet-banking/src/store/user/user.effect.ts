import { Injectable } from "@angular/core";
import { userService } from './user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, map } from 'rxjs/operators';
import { homeArticles, getArticles } from './user.action';

@Injectable()
export class TestEffect {
    constructor(
        private acction: Actions,
        private userService: userService
    ) {}
    isloading = false;

    loadArticles$ = createEffect( () => 
        this.acction.pipe(
            ofType(homeArticles),
            switchMap((res) => {
                const offset = res.offset;
                this.isloading = true;
                return this.userService.getAll(res.limit, res.offset).pipe(
                    take(1),
                    map((res1) => {
                        this.isloading = false;
                        return getArticles({data: res1, page: (Math.ceil((offset + 1)/10))});
                    })
                );
            }),
        )
    );
}