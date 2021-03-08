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
        this._availableLayoutWidth = 1000;
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
            console.log('---- position card---', i);
            this._setCardPositionValues(card, i);
            this._updateColumnsHeight(card);
            // console.log('columnsHeight: ', this.columnsHeight);
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

        // this._getCardPositionValues(card, cardRank);
        // const minHeight = Math.min.apply(Math, this.columnsHeight);
        // const minHeightColumn = this.columnsHeight.indexOf(minHeight);
        // console.log('minHeightColumn: ', minHeightColumn);
        // const columnsSpan = Math.floor((card.left + card.cardWidth) / cardWidthResizeStep);

        // let isFitting = true;
        // for (let span = 0; span < columnsSpan; span++) {
        //     if (this.columnsHeight[minHeightColumn + span] > minHeight) {
        //         isFitting = false;
        //     }
        // }

        // console.log('isFitting: ', isFitting);
        // if (isFitting) {
        //     card.left = minHeightColumn * 320 + minHeightColumn * 16;
        //     card.top = this.columnsHeight[minHeightColumn] + (this.columnsHeight[minHeightColumn] ? 16 : 0);
        // }
        // // how many card taking width in the row
        // // check left+width of previous card
        // let previousCardWidthSpread = this._sortedCards[index - 1].left + this._sortedCards[index - 1].cardWidth;
        // if (previousCardWidthSpread + card.cardWidth > this._availableLayoutWidth) {
        //     console.log('Need to shift this card down: ', card);
        //     this._fitCardOnMovedDown(card, index);
        //     // check how much left and how much top
        // } else {
        //     // think if you are in 2nd row. element from first row has height extending in 2nd row.
        //     card.left = previousCardWidthSpread + 16;
        // }
        // console.log('previousCardWidthSpread: ', previousCardWidthSpread);
        // console.log('_availableLayoutWidth: ', this._availableLayoutWidth);
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
        console.log('cardColSpan: ', cardColSpan);

        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        console.log('columnPositions for height: ', columnPositions);
        console.log('columnPositions --- height: ', height);

        console.log('looking towards left of position');
        for (const columnPosition of columnPositions) {
            // columnPosition-1 ->convert as index
            // columnPosition -1 - (numberOfCardColumns -1) at least 1 column of card on current column
            if (!isFitting) {
                console.log('columnPosition=', columnPosition);
                for (let i = columnPosition - cardColSpan; i < columnPosition - 1 && i > -1 && !isFitting; i++) {
                    console.log('left i=', i);
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

        console.log('left _getFittingColumn isFitting: ', isFitting);
        console.log('left _getFittingColumn startingColumnPosition: ', startingColumnPosition);

        // if not moving towards left. start from column position and check if fits.
        if (!isFitting) {
            console.log('looking towards right of position');
            for (const columnPosition of columnPositions) {
                // one column is at columnPosition
                for (let i = cardColSpan - 1; i > 0 && !isFitting; i--) {
                    console.log('right i=', i);
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

        console.log('right _getFittingColumn isFitting: ', isFitting);
        console.log('right _getFittingColumn startingColumnPosition: ', startingColumnPosition);
        if (isFitting) {
            card.left = startingColumnPosition * 320;
            console.log('set height: ', height);
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

    private _getCardPositionValues(card: ResizableCardItemComponent, index: number): void {
        // check how much left and how much top
        // return left and top value

        // get fitting column (original column)
        // slide left if previous column height is less
        // top value as per original column

        if (index === 3) {
            const tempArray = this.columnsHeight.slice();
            const sortedColumnsHeightArray = tempArray.sort(comparer);
            const uniqueHeights = new Array();

            for (const sortedHeight of sortedColumnsHeightArray) {
                if (uniqueHeights.indexOf(sortedHeight) === -1) {
                    uniqueHeights.push(sortedHeight);
                }
            }

            for (const height of uniqueHeights) {
                this._fittingCard(height, card);
            }
        }

        function comparer(first: number, second: number): number {
            return first - second;
        }

        const minHeight = Math.min.apply(Math, this.columnsHeight);
        const minHeightColumn = this.columnsHeight.indexOf(minHeight);
        // console.log('minHeightColumn: ', minHeightColumn);
        const columnsSpan = Math.floor((card.left + card.cardWidth) / cardWidthResizeStep);

        let isFitting = true;
        for (let span = 0; span < columnsSpan; span++) {
            if (this.columnsHeight[minHeightColumn + span] > minHeight) {
                isFitting = false;
            }
        }

        // console.log('isFitting: ', isFitting);
        if (isFitting) {
            card.left = minHeightColumn * 320 + minHeightColumn * 16;
            card.top = this.columnsHeight[minHeightColumn] + (this.columnsHeight[minHeightColumn] ? 16 : 0);
        }
    }

    // private _isFittingHeight(height: number, card: ResizableCardItemComponent): boolean {
    //     let columnPositions = new Array();
    //     let index = 0;
    //     for (let columnHeight of this.columnsHeight) {
    //         index++;
    //         if (columnHeight === height) {
    //             columnPositions.push(index);
    //         }
    //     }

    //     console.log('try to fit at columns: ', columnPositions);

    //     this._getFittingColumn(columnPositions, card);
    //     // returns which column
    //     return;
    // }

    private _fittingCard(height: number, card: ResizableCardItemComponent): number {
        const columnPositions = new Array();
        let index = 0;
        for (const columnHeight of this.columnsHeight) {
            index++;
            if (columnHeight === height) {
                columnPositions.push(index);
            }
        }

        // start from previous indexes
        const numberOfCardColumns = Math.floor(card.cardWidth / cardWidthResizeStep);
        console.log('numberOfCardColumns: ', numberOfCardColumns);

        // check for each card position, starting from leftmost
        let isFitting = false;
        let startingColumnPosition = -1;

        console.log('looking towards left of position');
        for (const columnPosition of columnPositions) {
            // columnPosition-1 ->convert as index
            // columnPosition -1 - (numberOfCardColumns -1) at least 1 column of card on current column
            if (!isFitting) {
                console.log('columnPosition=', columnPosition);
                for (
                    let i = columnPosition - numberOfCardColumns;
                    i < columnPosition - 1 && i > -1 && !isFitting;
                    i++
                ) {
                    console.log('left i=', i);
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

        console.log('left _getFittingColumn isFitting: ', isFitting);
        console.log('left _getFittingColumn startingColumnPosition: ', startingColumnPosition);

        // if not moving towards left. start from column position and check if fits.
        if (!isFitting) {
            console.log('looking towards right of position');
            for (const columnPosition of columnPositions) {
                // one column is at columnPosition
                for (let i = numberOfCardColumns - 1; i > 0; i--) {
                    console.log('right i=', i);
                    if (this.columnsHeight[columnPosition - 1 + i] > this.columnsHeight[columnPosition - 1]) {
                        isFitting = false;
                    } else {
                        isFitting = true;
                        startingColumnPosition = columnPosition - 1;
                    }
                }
            }
        }

        console.log('right _getFittingColumn isFitting: ', isFitting);
        console.log('right _getFittingColumn startingColumnPosition: ', startingColumnPosition);
        return;
    }

    private _getNthMinHeightColumn(nthMin: number): Array<number> {
        const tempArray = this.columnsHeight.slice();
        const sortedArray = tempArray.sort(comparer);
        const uniqueValArray = new Array();

        for (let i = 0; i < sortedArray.length; i++) {
            if (uniqueValArray.indexOf(sortedArray[i]) === -1) {
                uniqueValArray.push(sortedArray[i]);
            }
        }

        function comparer(first: number, second: number): number {
            return first - second;
        }

        const nthMinValue = uniqueValArray[nthMin - 1];
        console.log('uniqueValArray: ', uniqueValArray);
        console.log('nthMinValue: ', nthMinValue);
        return [0];
    }

    private _getNthMinHeight(): number {
        return 0;
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
