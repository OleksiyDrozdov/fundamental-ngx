import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import { ResizableCardItemComponent } from './resizable-card-item/resizable-card-item.component';
import { ResizableCardItemConfig } from './resizable-card-item/resizable-card-item.component';

let cardRank = 1;
const DRAG_START_DELAY = 200;
const cardWidthResizeStep = 320; // 20rem
const cardHeightResizeStep = 16; // 1rem
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

    resizeCardDirectivesArray: ResizableCardDefinitionDirective[];

    private _dirty = true;
    private _availableLayoutWidth: number;
    private _sortedCards: Array<ResizableCardItemComponent>;
    constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.columnsHeight = new Array(this.columns);
        for (let index = 0; index < this.columns; index++) {
            this.columnsHeight[index] = 0;
        }
    }

    /** @hidden */
    ngAfterViewInit(): void {
        this._availableLayoutWidth = this.layoutWidth.nativeElement.getBoundingClientRect().width;
        this.arrangeCards(this.resizeCardItems.toArray());
        this._changeDetectorRef.detectChanges();
    }

    ngAfterViewChecked(): void {
        if (this._dirty) {
            this._dirty = false;

            this._changeDetectorRef.markForCheck();
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

    private _updateColumnsHeight(card: ResizableCardItemComponent): void {
        const columnsStart = Math.floor(card.left / cardWidthResizeStep);
        const columnsSpan = Math.floor((card.left + card.cardWidth) / cardWidthResizeStep);
        const columnHeight = card.cardHeight + card.top;

        for (let i = columnsStart; i < columnsSpan; i++) {
            this.columnsHeight[i] = columnHeight;
        }
    }

    private _setCardPositionValues(card: ResizableCardItemComponent, rank: number): void {
        if (rank === 0) {
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
        const cardColSpan = Math.floor(card.cardWidth / cardWidthResizeStep);

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
            card.left = startingColumnPosition * cardWidthResizeStep;
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

    onCardResize(): void {
        this._dirty = true;
    }

    onDragDrop(): void {
        this._dirty = true;
    }

    sortCards(firstCard: ResizableCardItemComponent, secondCard: ResizableCardItemComponent): number {
        return firstCard.rank - secondCard.rank;
    }
}
