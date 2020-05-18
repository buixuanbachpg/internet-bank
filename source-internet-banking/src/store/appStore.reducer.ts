import { ActionReducerMap } from '@ngrx/store';
import * as reducerArticle from './user/user.reducer'

export interface AppState {
    user: reducerArticle.user;
}

export const appReducer : ActionReducerMap<AppState> = {
    user: reducerArticle.UserReducer,
}