import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgStateModule } from '@ephemeral-angular/ng-state';

import { AppComponent } from './app.component';
import { DemoModule } from './demo/demo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        NgStateModule,
        DemoModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
