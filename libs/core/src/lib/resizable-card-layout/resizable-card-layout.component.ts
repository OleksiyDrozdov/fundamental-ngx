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
        console.log('this.columns: ', this.columns);
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
        console.log(
            'ngAfterViewChecked width Available: ',
            this.layoutWidth.nativeElement.getBoundingClientRect().width
        );
    }

    /** @hidden */
    @HostListener('keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        event.stopImmediatePropagation();
        if (!this._keyboardEventsManager.activeItemIndex) {
            this._keyboardEventsManager.setFirstItemActive();
        }

        if (this._keyboardEventsManager) {
            this._keyboardEventsManager.onKeydown(event);
        }
    }

    arrangeCards(cards: Array<ResizableCardItemComponent>): void {
        // sort based on the card rank
        this._sortedCards = cards.sort(this.sortCards);
        this._sortedCards.forEach((card, index) => {
            console.log('positioning card: ', card);
            console.log('positioning card at index: ', index);
            this._setCardPositionValues(card, index);
            console.log('before updating height: ', this.columnsHeight);
            this._updateColumnsHeight(card);
            console.log('after updating height: ', this.columnsHeight);
        });
    }

    cardResizing(event: ResizingEvent): void {}

    cardResizeComplete(event: ResizedEvent): void {
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

        // eg. [1, 2, 3, 4] columnsPositions
        console.log('left columnPositions: ', columnPositions);
        for (const columnPosition of columnPositions) {
            if (!isFitting) {
                // columnPosition-1 ->convert as index
                // columnPosition -1 - (numberOfCardColumns -1) at least 1 column of card on current column
                for (let i = columnPosition - cardColSpan; i < columnPosition - 1 && i > -1 && !isFitting; i++) {
                    console.log('going left i: ', i);
                    // if previous column heights are less then card will fix starting from previous columns as well
                    if (this.columnsHeight[i] > this.columnsHeight[columnPosition - 1]) {
                        isFitting = false;
                        console.log('left false isFitting: ', isFitting);
                    } else {
                        isFitting = true;
                        startingColumnPosition = i;
                        console.log('left true isFitting: ', isFitting);
                        console.log('left true startingColumnPosition: ', startingColumnPosition);
                    }
                }

                // if card spans more than available columns. then it will not fit.
                // console.log('left columnPosition: ', columnPosition);
                // console.log('left cardColSpan: ', cardColSpan);
                // console.log('left this.columns: ', this.columns);
                // if (!isFitting && columnPosition + cardColSpan - 1 > this.columns) {
                //     console.log('left inside condition');
                //     isFitting = false;
                //     break;
                // }
            } else {
                break;
            }
        }

        // if not moving towards left. start from column position and check if fits.
        if (!isFitting) {
            console.log('right columnPositions: ', columnPositions);
            for (const columnPosition of columnPositions) {
                if (!isFitting) {
                    if (height === 0 && cardColSpan + columnPosition - 1 <= this.columns && !isFitting) {
                        isFitting = true;
                        startingColumnPosition = columnPosition - 1;
                        break;
                    }

                    // if card spans more than available columns. then it will not fit.
                    console.log('right columnPosition: ', columnPosition);
                    console.log('right cardColSpan: ', cardColSpan);
                    console.log('right this.columns: ', this.columns);
                    if (columnPosition + cardColSpan - 1 > this.columns) {
                        console.log('right inside condition');
                        isFitting = false;
                        break;
                    }

                    // one column is at columnPosition
                    for (let i = cardColSpan - 1; i > 0 && !isFitting; i--) {
                        if (this.columnsHeight[columnPosition - 1 + i] > this.columnsHeight[columnPosition - 1]) {
                            isFitting = false;
                        } else {
                            isFitting = true;
                            startingColumnPosition = columnPosition - 1;
                        }
                    }
                }
            }
        }

        if (isFitting) {
            console.log('startingColumnPosition: ', startingColumnPosition);
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
