import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';

import {
    HorizontalResizeStep,
    ResizingEvent,
    ResizedEvent,
    ResizableCardItemComponent,
    ResizableCardItemConfig
} from './resizable-card-item/resizable-card-item.component';

let cardRank = 1;
const DRAG_START_DELAY = 500;
export type LayoutSize = 'sm' | 'md' | 'lg';
export type ResizableCardLayoutConfig = Array<ResizableCardItemConfig>;

@Directive({ selector: '[fdRsCardDef]' })
export class ResizableCardDefinitionDirective implements OnInit {
    /**
     * rank of card.
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
export class ResizableCardLayoutComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @Input()
    draggable = true;

    @Input()
    layoutConfig: ResizableCardLayoutConfig;

    /** @hidden */
    @ContentChildren(ResizableCardDefinitionDirective)
    resizeCardDirectives: QueryList<ResizableCardDefinitionDirective>;

    @ViewChildren(ResizableCardItemComponent)
    resizeCardItems: QueryList<ResizableCardItemComponent>;

    @ViewChild('layout')
    layoutWidth: ElementRef;

    layoutSize: LayoutSize = 'md';
    columns = 4; // TODO: set according to layoutSize
    columnsHeight: Array<number>;
    disableDragDrop = false;
    dragStartDelay = DRAG_START_DELAY;
    resizeCardDirectivesArray: ResizableCardDefinitionDirective[];

    private _availableLayoutWidth: number;
    private _sortedCards: Array<ResizableCardItemComponent>;
    /** @hidden FocusKeyManager instance */
    private _keyboardEventsManager: FocusKeyManager<ResizableCardItemComponent>;

    constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.columnsHeight = new Array(this.columns);
        this._initHeightArray();
    }

    private _initHeightArray(): void {
        for (let index = 0; index < this.columns; index++) {
            this.columnsHeight[index] = 0;
        }
    }

    /** @hidden */
    ngAfterViewInit(): void {
        this._accessibilitySetup();
        this._availableLayoutWidth = this.layoutWidth.nativeElement.getBoundingClientRect().width;
        console.log('_availableLayoutWidth: ', this._availableLayoutWidth);
        this.arrangeCards(this.resizeCardItems.toArray());
        this._changeDetectorRef.detectChanges();
    }

    ngAfterViewChecked(): void {
        console.log('ngAfterViewChecked width Available: ', this.layoutWidth.nativeElement.getBoundingClientRect().width);
    }

    /** @hidden */
    @HostListener('keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        event.stopImmediatePropagation();
        if (!this._keyboardEventsManager.activeItemIndex) {
            this._keyboardEventsManager.setFirstItemActive();
            console.log('setting first item active');
        }

        console.log('listen keydown event manager: ', this._keyboardEventsManager);

        if (this._keyboardEventsManager) {
            this._keyboardEventsManager.onKeydown(event);
        }
    }

    arrangeCards(cards: Array<ResizableCardItemComponent>): void {
        // sort based on the card rank
        this._sortedCards = cards.sort(this.sortCards);
        this._sortedCards.forEach((card, i) => {
            this._setCardPositionValues(card, i);
            this._updateColumnsHeight(card);
        });
    }

    cardResizing(event: ResizingEvent): void {
        this.disableDragDrop = true;
    }

    cardResizeComplete(event: ResizedEvent): void {
        this.disableDragDrop = false;
        this._initHeightArray();
        this.arrangeCards(this.resizeCardItems.toArray());
    }

    miniHeaderReached(event: ResizedEvent): void {
        console.log('card mini header reached: ', event);
    }

    miniContentReached(event: ResizedEvent): void {
        console.log('card mini content reached: ', event);
    }

    cardStepped(event: ResizedEvent): void {
        console.log('card Step change: ', event);
    }

    /** @hidden */
    private _accessibilitySetup(): void {
        this._keyboardEventsManager = new FocusKeyManager(this.resizeCardItems).withWrap();
    }

    private _updateColumnsHeight(card: ResizableCardItemComponent): void {
        const columnsStart = Math.floor(card.left / HorizontalResizeStep);
        const columnsSpan = Math.floor((card.left + card.cardWidth) / HorizontalResizeStep);
        const columnHeight = card.cardHeight + card.top;

        for (let i = columnsStart; i < columnsSpan; i++) {
            this.columnsHeight[i] = columnHeight;
        }
    }

    private _setCardPositionValues(card: ResizableCardItemComponent, index: number): void {
        if (index === 0) {
            card.left = 0;
            card.top = 0;
            return;
        }

        const uniqueHeights = this._getSortedUniqueHeights();

        let cardPositioned = false;
        for (const height of uniqueHeights) {
            if (!cardPositioned) {
                cardPositioned = this._isPositionSetSuccess(height, card);
            } else {
                break;
            }
        }
    }

    private _isPositionSetSuccess(height: number, card: ResizableCardItemComponent): boolean {
        const columnPositions = new Array();
        let index = 0;
        for (const columnHeight of this.columnsHeight) {
            index++;
            if (columnHeight === height) {
                columnPositions.push(index);
            }
        }

        // start from previous indexes
        const cardColSpan = Math.floor(card.cardWidth / HorizontalResizeStep);

        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        for (const columnPosition of columnPositions) {
            // columnPosition-1 ->convert as index
            // columnPosition -1 - (numberOfCardColumns -1) at least 1 column of card on current column
            if (!isFitting) {
                for (let i = columnPosition - cardColSpan; i < columnPosition - 1 && i > -1 && !isFitting; i++) {
                    if (this.columnsHeight[i] > this.columnsHeight[columnPosition - 1]) {
                        isFitting = false;
                    } else {
                        isFitting = true;
                        startingColumnPosition = i;
                    }
                }
            } else {
                break;
            }
        }

        // if not moving towards left. start from column position and check if fits.
        if (!isFitting) {
            for (const columnPosition of columnPositions) {
                // one column is at columnPosition
                for (let i = cardColSpan - 1; i > 0 && !isFitting; i--) {
                    if (this.columnsHeight[columnPosition - 1 + i] > this.columnsHeight[columnPosition - 1]) {
                        isFitting = false;
                    } else {
                        isFitting = true;
                        startingColumnPosition = columnPosition - 1;
                    }
                }

                if (height === 0 && cardColSpan === 1 && !isFitting) {
                    isFitting = true;
                    startingColumnPosition = columnPosition - 1;
                }
            }
        }

        if (isFitting) {
            card.left = startingColumnPosition * HorizontalResizeStep;
            card.top = height;
        }
        return isFitting;
    }

    private _getSortedUniqueHeights(): number[] {
        const tempArray = this.columnsHeight.slice();
        const sortedColumnsHeightArray = tempArray.sort(comparer);
        const uniqueHeights = new Array();

        for (const sortedHeight of sortedColumnsHeightArray) {
            if (uniqueHeights.indexOf(sortedHeight) === -1) {
                uniqueHeights.push(sortedHeight);
            }
        }
        function comparer(first: number, second: number): number {
            return first - second;
        }
        return uniqueHeights;
    }

    sortCards(firstCard: ResizableCardItemComponent, secondCard: ResizableCardItemComponent): number {
        return firstCard.rank - secondCard.rank;
    }
}
