import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { DialogService, ResizableCardLayoutConfig, LayoutSize } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-resizable-card-layout-example',
    templateUrl: './resizable-card-layout-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizableCardLayoutExampleComponent implements OnInit {
    layoutConfig: ResizableCardLayoutConfig;
    layoutSize: LayoutSize;

    constructor(private _dialogService: DialogService) {}

    ngOnInit(): void {}

    openDialog(dialogTemplate: TemplateRef<any>): void {
        let width: string;
        let height: string;

        switch (this.layoutSize) {
            case 'sm':
                width = '320px';
                height = '900px';
                break;
            case 'md':
                width = '672px';
                height = '900px';
                break;
            case 'lg':
                width = '960px';
                height = '900px';
                break;
            case 'xl':
                width = '1280px';
                height = '900px';
                break;
        }
        this._setUpDialog(dialogTemplate, width, height);
    }

    private _setUpDialog(dialogTemplate: TemplateRef<any>, width: string, height: string): void {
        this._dialogService.open(dialogTemplate, {
            mobile: true,
            verticalPadding: true,
            width: width,
            height: height
        });
    }
}
