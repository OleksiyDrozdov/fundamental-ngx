import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { ButtonModule, DynamicComponentService, InputGroupModule, ListModule, TemplateModule, FormModule } from '@fundamental-ngx/core';
import { ComboboxComponent } from './combobox/combobox.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { PlatformAutoCompleteModule } from '../auto-complete/auto-complete.module';

@NgModule({
    declarations: [ComboboxComponent, HighlightPipe],
    imports: [
        CommonModule,
        FormsModule,
        InputGroupModule,
        ListModule,
        ButtonModule,
        OverlayModule,
        PlatformAutoCompleteModule,
        FormModule
    ],
    providers: [DynamicComponentService],
    exports: [ComboboxComponent, TemplateModule]
})
export class PlatformComboboxModule {}
