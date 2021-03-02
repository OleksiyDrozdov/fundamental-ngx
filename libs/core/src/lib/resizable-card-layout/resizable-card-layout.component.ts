import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    Directive,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import { ResizableCardItemComponent } from './resizable-card-item/resizable-card-item.component';
import { ResizableCardItemConfig } from './resizable-card-item/resizable-card-item.component';

let cardRank = 1;
const DRAG_START_DELAY = 200;
export type LayoutSize = 'sm' | 'md' | 'lg';
export type ResizableCardLayoutConfig = Array<ResizableCardItemConfig>;

@Directive({ selector: '[fdRsCardDef]' })
export class ResizableCardDefinitionDirective implements OnInit {
    /**
     * Behaves like rank of card.
     * Useful in creating layout again after drag&drop or resize.
     */
    @Input()
    fdRsCardDef: number = cardRank++;

    constructor(public template: TemplateRef<any>, public container: ViewContainerRef) {}

    ngOnInit(): void {
        this.container.createEmbeddedView(this.template);
    }
}

@Component({
    selector: 'fd-resizable-card-layout',
    templateUrl: 'resizable-card-layout.component.html',
    styleUrls: ['./resizable-card-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardLayoutComponent implements AfterViewInit {
    @Input()
    draggable = true;

    @Input()
    layoutConfig: ResizableCardLayoutConfig;

    @ContentChildren(ResizableCardItemComponent)
    resizeCardItems: QueryList<ResizableCardItemComponent>;

    public layoutSize: LayoutSize = 'md';

    constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    /** @hidden */
    ngAfterViewInit(): void {
        this.resizeCardItems.forEach((card, i) => {
            card.config = this.layoutConfig[i];
            card.detectChanges();
        });
        this._changeDetectorRef.markForCheck();
    }
}
