import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Demo01childComponent } from './01-extend/demo01child/demo01child.component';
import { Demo01parentComponent } from './01-extend/demo01parent/demo01parent.component';


@NgModule({
    declarations: [Demo01parentComponent, Demo01childComponent],
    imports: [
        CommonModule
    ],
    exports: [Demo01parentComponent]
})
export class DemoModule {
}
