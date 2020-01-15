import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DemoModule } from './demo/demo.module';
import { NgRxComponentModule } from './state/state.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        NgRxComponentModule,
        DemoModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
