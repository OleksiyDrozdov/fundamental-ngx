import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ResizableCardLayoutConfig } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-resizable-card-layout-example',
    templateUrl: './resizable-card-layout-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizableCardLayoutExampleComponent implements OnInit {
    layoutConfig: ResizableCardLayoutConfig;

    ngOnInit(): void {
        this.layoutConfig = [
            {
                title: 'card1',
                rank: 1,
                cardWidth: 320,
                cardHeight: 400,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
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
                cardHeight: 250,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card5',
                rank: 5,
                cardWidth: 640,
                cardHeight: 200,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card6',
                rank: 6,
                cardWidth: 640,
                cardHeight: 200,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            },
            {
                title: 'card7',
                rank: 7,
                cardWidth: 640,
                cardHeight: 200,
                miniHeaderHeight: 80,
                miniContentHeight: 100,
                resizable: true
            }
        ];
    }
}
