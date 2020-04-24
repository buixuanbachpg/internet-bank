import { createReducer, on } from '@ngrx/store';
import { setArticles, getArticles } from './user.action';


export interface Article {
    author?: any
}

export interface listArticle {
    data?: Array<Article>,
    datalistStore?: {},
    total?: number;
}

export const initialState: listArticle = { data: [], datalistStore: {}, total: 1 };

const articleReducer = createReducer(initialState,
    on(setArticles, (state, payload) => {
        return {
            ...state,
            data: payload.data
        };
    }),
    on(getArticles, (state, payload) => {
        if (payload.data) {
            const converdata = {
                [payload.page]: payload.data.article
            };
            const dataInstore = { ...state.datalistStore, ...converdata };
            return {
                ...state,
                data: payload.data.article,
                datalistStore: dataInstore,
                total: payload.data.articlescount
            }
        }
    })
);

export function ArticleReducer(state, action) {
    return articleReducer(state, action);
}