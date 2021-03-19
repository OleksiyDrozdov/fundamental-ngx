import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { DialogService, ResizableCardLayoutConfig, LayoutSize } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-resizable-card-layout-example-layoutconfig',
    templateUrl: './resizable-card-layout-example-layoutconfig.component.html',
    styleUrls: ['./resizable-card-layout-example-layoutconfig.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizableCardLayoutExampleLayoutConfigComponent implements OnInit {
    layoutConfig: ResizableCardLayoutConfig;
    layoutSize: LayoutSize;

    constructor(private _dialogService: DialogService) {}

    ngOnInit(): void {
        this.layoutConfig = [
            {
                title: 'card1',
                rank: 1,
                cardWidth: 320,
                cardHeight: 400,
                miniHeaderHeight: 80,
                miniContentHeight: 150,
                resizable: true
            },
            {
                title: 'card2',
                rank: 2,
                cardWidth: 320,
                cardHeight: 300,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card3',
                rank: 3,
                cardWidth: 640,
                cardHeight: 350,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card4',
                rank: 4,
                cardWidth: 640,
                cardHeight: 225,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card5',
                rank: 5,
                cardWidth: 320,
                cardHeight: 225,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card6',
                rank: 6,
                cardWidth: 640,
                cardHeight: 225,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card7',
                rank: 7,
                cardWidth: 640,
                cardHeight: 225,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            }
        ];
    }

    openDialog(dialogTemplate: TemplateRef<any>): void {
        this._dialogService.open(dialogTemplate, {
            mobile: true,
            verticalPadding: true
        });
    }
}
