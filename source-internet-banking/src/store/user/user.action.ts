import {createAction, props } from "@ngrx/store"

export const login = createAction(
    'Login',
    props<{username: string, password: string}>()
);

export const homeArticles = createAction(
    'Home Articles',
    props<{limit?: number, offset?: number}>()
);

export const setArticles = createAction(
    'Set home Articles',
    props<{data: any}>()
);

export const getArticles = createAction(
    'Get home Articles',
    props<{data: any, page: number}>()
);

export const setUser = createAction(
    'Set User',
    props<{data: any}>()
);

export const getUser = createAction(
    'Get User',
    props<{data: any}>()
);