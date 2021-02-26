import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    Directive,
    Input,
    QueryList,
    TemplateRef,
    ViewChildren
} from '@angular/core';

import { ResizableCardItemComponent } from './resizable-card-item/resizable-card-item.component';
import { ResizableCardItemConfig } from './resizable-card-item/resizable-card-item.component';

let cardRank = 1;
const DRAG_START_DELAY = 200;
export type LayoutSize = 'sm' | 'md' | 'lg';
export type ResizableCardLayoutConfig = Array<ResizableCardItemConfig>;

@Directive({ selector: '[fdRsCardDef]' })
export class ResizableCardDefinitionDirective {
    /**
     * Behaves like rank of card.
     * Useful in creating layout again after drag&drop or resize.
     */
    @Input()
    fdCardDef: number = cardRank++;

    constructor(public template: TemplateRef<any>) {}
}

@Component({
    selector: 'fd-resizable-card-layout',
    templateUrl: 'resizable-card-layout.component.html',
    styleUrls: ['./resizable-card-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizableCardLayoutComponent implements AfterViewInit, AfterContentInit {
    @Input()
    draggable = true;

    @Input()
    layoutConfig: ResizableCardLayoutConfig;

    @ViewChildren(ResizableCardItemComponent)
    resizeCardItems: QueryList<ResizableCardItemComponent>;

    /** @hidden */
    @ContentChildren(ResizableCardDefinitionDirective)
    resizeCards: QueryList<ResizableCardDefinitionDirective>;

    public layoutSize: LayoutSize = 'md';

    /** @hidden */
    ngAfterContentInit(): void {
        console.log('ngAfterContentInit resizeCardItems: ', this.resizeCardItems);
        console.log('ngAfterContentInit resizeCards: ', this.resizeCards);
    }

    /** @hidden */
    ngAfterViewInit(): void {
        console.log('ngAfterViewInit resizeCardItems: ', this.resizeCardItems);
        console.log('ngAfterViewInit resizeCards: ', this.resizeCards);
    }
}
