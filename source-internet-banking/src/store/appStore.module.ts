import { NgModule } from "@angular/core";
import { StoreModule } from '@ngrx/store';
import { appReducer } from './appStore.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TestEffect } from './user/user.effect';

@NgModule({
    imports: [
        StoreModule.forRoot(appReducer),
        EffectsModule.forRoot([
            TestEffect,
        ])
    ],
    declarations: []
})
export class StoreAllModule {}