import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer.component';
import { PlatformLinkModule } from '../link/public_api';

@NgModule({
    declarations: [FooterComponent],
    imports: [CommonModule, PlatformLinkModule],
    exports: [FooterComponent]
})
export class PlatformFooterModule {}
