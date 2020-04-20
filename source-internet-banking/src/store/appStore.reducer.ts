import { ActionReducerMap } from '@ngrx/store';
import * as reducerArticle from './user/user.reducer'

export interface AppState {
    article: reducerArticle.listArticle;
}

export const appReducer : ActionReducerMap<AppState> = {
    article: reducerArticle.ArticleReducer,
}