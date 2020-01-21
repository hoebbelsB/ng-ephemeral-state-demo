import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgStateModule } from '@ephemeral-angular/ng-state';
import { Demo01childComponent } from './01-extend/demo01child/demo01child.component';
import { Demo01parentComponent } from './01-extend/demo01parent/demo01parent.component';
import { Demo02childComponent } from './02-provide/demo02child/demo02child.component';
import { Demo02parentComponent } from './02-provide/demo02parent/demo02parent.component';


@NgModule({
    declarations: [
        Demo01parentComponent,
        Demo01childComponent,
        Demo02parentComponent,
        Demo02childComponent
    ],
    imports: [
        CommonModule,
        NgStateModule
    ],
    exports: [Demo01parentComponent, Demo02parentComponent]
})
export class DemoModule {
}
