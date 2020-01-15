import { NgModule } from '@angular/core';
import { LetDirective } from './let/let.directive';
import { PushPipe } from './push/push.pipe';

const DECLARATIONS = [LetDirective, PushPipe];

const EXPORTS = [DECLARATIONS];

@NgModule({
    declarations: [DECLARATIONS],
    imports: [],
    exports: [EXPORTS],
})
export class NgRxComponentModule {}
