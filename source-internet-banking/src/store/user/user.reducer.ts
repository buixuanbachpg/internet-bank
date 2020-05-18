import { createReducer, on } from '@ngrx/store';
import { setArticles, getArticles, getUser, setUser } from './user.action';


export interface Article {
    author?: any
}

export interface listArticle {
    data?: Array<Article>,
    datalistStore?: {},
    total?: number;
}

export interface user {
    data:  any;
}

// export const initialState: listArticle = { data: [], datalistStore: {}, total: 1 };
export const initialState: user = { data: {} };

const userReducer = createReducer(initialState,
    on(setUser, (state, payload) => {
        return {
            ...state,
            data: payload.data
        };
    }),
    on(getUser, (state, payload) => {
        return {
            ...state,
            data: payload.data
        };
    }),
    // on(setArticles, (state, payload) => {
    //     return {
    //         ...state,
    //         data: payload.data
    //     };
    // }),
    // on(getArticles, (state, payload) => {
    //     if (payload.data) {
    //         const converdata = {
    //             [payload.page]: payload.data.article
    //         };
    //         const dataInstore = { ...state.datalistStore, ...converdata };
    //         return {
    //             ...state,
    //             data: payload.data.article,
    //             datalistStore: dataInstore,
    //             total: payload.data.articlescount
    //         }
    //     }
    // })
);

export function UserReducer(state, action) {
    return userReducer(state, action);
}