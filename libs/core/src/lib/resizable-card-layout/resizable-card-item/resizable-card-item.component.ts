import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type ResizeDirection = 'vertical' | 'horizontal' | 'both';

// values in pixel
export const HorizontalResizeStep = 320;
export const verticalResizeStep = 16;

export interface ResizableCardItemConfig {
    title?: string;
    rank?: number;
    cardWidth?: number;
    cardHeight?: number;
    miniHeaderHeight?: number;
    miniContentHeight?: number;
    resizable?: boolean;
}

export class PositionChange {
    constructor(public xPositionChange: number, public yPositionChange: number) {}
}

export class ResizingEvent {
    constructor(public card: ResizableCardItemComponent, public positionChange: PositionChange) {}
}

export class ResizedEvent {
    constructor(
        public card: ResizableCardItemComponent,
        public prevCardWidth: number,
        public prevCardHeight: number,
        public cardWidth: number,
        public cardHeight: number
    ) {}
}

let cardRank = 1;

@Component({
    selector: 'fd-resizable-card-item',
    templateUrl: 'resizable-card-item.component.html',
    styleUrls: ['./resizable-card-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardItemComponent implements OnInit, OnDestroy, FocusableOption {
    /** @hidden */
    @HostBinding()
    tabindex = 0;

    /** Set config from parent */
    @Input()
    get config(): ResizableCardItemConfig {
        return this._config;
    }

    set config(config: ResizableCardItemConfig) {
        this._config = config;
        this._initialSetup();
        this._changeDetectorRef.detectChanges();
    }

    @HostBinding('style.z-index')
    zIndex = 0;

    @HostBinding('style.position')
    position = 'absolute';

    @Input()
    @HostBinding('style.left.px')
    left = 0;

    @Input()
    @HostBinding('style.top.px')
    top = 0;

    @Output()
    stepChange: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    @Output()
    resizing: EventEmitter<ResizingEvent> = new EventEmitter<ResizingEvent>();

    @Output()
    resized: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    @Output()
    dropped: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    miniHeaderReached: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    @Output()
    miniContentReached: EventEmitter<ResizedEvent> = new EventEmitter<ResizedEvent>();

    id: string;

    title: string;

    rank: number = cardRank++;

    /** card width in px. Default value to 20rem */
    cardWidth: number = HorizontalResizeStep;

    /** card height in px */
    cardHeight: number;

    miniHeaderHeight: number;

    miniContentHeight: number;

    showResizeIcon = true;

    showBorder = false;

    resizable = true;

    resizeBoth = true;

    resizeHorizontal = false;

    resizeVertical = false;

    private _resizeDebounce$: Subject<PositionChange> = new Subject<PositionChange>();

    private _config: ResizableCardItemConfig;
    private _prevX: number;
    private _prevY: number;
    private _prevCardWidth: number;
    private _prevCardHeight: number;
    private _resize = false;
    private _resizeDirection: ResizeDirection;

    constructor(private _changeDetectorRef: ChangeDetectorRef, private _elementRef: ElementRef) {}

    ngOnInit(): void {
        this._resizeDebounce$.pipe(debounceTime(20)).subscribe((positionChange: PositionChange) => {
            this.resizing.emit(new ResizingEvent(this, positionChange));
        });
    }

    ngOnDestroy(): void {}

    private _initialSetup(): void {
        this.cardWidth = this._config.cardWidth || this.cardWidth;
        this.cardHeight = this._config.cardHeight;
        this.title = this._config.title;
        this.rank = this._config.rank || this.rank;
        this.miniHeaderHeight = this._config.miniHeaderHeight;
        this.miniContentHeight = this._config.miniContentHeight;
        this.resizable = this.resizable || this._config.resizable;
    }

    onMouseDown(event: MouseEvent, resizeDirection: ResizeDirection): void {
        event.preventDefault();
        this.showBorder = true;
        this._resize = true;
        this._prevX = event.clientX;
        this._prevY = event.clientY;
        this._prevCardWidth = this.cardWidth;
        this._prevCardHeight = this.cardHeight;
        this._resizeDirection = resizeDirection;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        if (!this._resize) {
            return;
        }

        // resizing card will go over other cards
        this.zIndex = 1;

        if (this._resizeDirection === 'both') {
            this.cardWidth = this.cardWidth - (this._prevX - event.clientX);
            this._verticalResizing(event.clientY);
        } else if (this._resizeDirection === 'horizontal') {
            this.cardWidth = this.cardWidth - (this._prevX - event.clientX);
        } else {
            this._verticalResizing(event.clientY);
        }

        this._resizeDebounce$.next(new PositionChange(this._prevX - event.clientX, this._prevY - event.clientY));

        const heightDiff = Math.abs(this.cardHeight - this._prevCardHeight);
        const widthDiff = Math.abs(this.cardWidth - this._prevCardWidth);
        if (
            (heightDiff > 0 && heightDiff % verticalResizeStep === 0) ||
            (widthDiff > 0 && widthDiff % HorizontalResizeStep === 0)
        ) {
            this.stepChange.emit(this._getResizedEventObject());
        }

        this._prevX = event.clientX;
        this._prevY = event.clientY;
    }

    private _verticalResizing(yPosition: number): void {
        // TODO: vertical resize step is 1rem
        if (this.cardHeight === this.miniHeaderHeight) {
            // decreasing height
            if (this._prevY - yPosition > 0) {
                // if miniHeader height reached, stop resizing
                return;
            } else {
                // increasing height
                this.cardHeight = this.miniHeaderHeight + this.miniContentHeight;
                this._stopResizing();
                this.miniContentReached.emit(this._getResizedEventObject());
            }
        } else if (this.cardHeight < this.miniContentHeight + this.miniHeaderHeight) {
            // have to do both way. increase height and decrease height
            if (this._prevY - yPosition > 0) {
                // if miniHeader height reached, stop resizing
                this.cardHeight = this.miniHeaderHeight;
                this._stopResizing();
                this.miniHeaderReached.emit(this._getResizedEventObject());
            } else {
                this.cardHeight = this.miniHeaderHeight + this.miniContentHeight;
                this._stopResizing();
                this.miniContentReached.emit(this._getResizedEventObject());
            }
        } else {
            this.cardHeight = this.cardHeight - (this._prevY - yPosition);
        }

        // stop resizing on miniContent
        if (this.cardHeight <= this.miniContentHeight + this.miniHeaderHeight) {
            this.miniContentReached.emit(this._getResizedEventObject());
            this._stopResizing();
        }
    }

    onMouseUp(event: MouseEvent, resizeDirection: ResizeDirection): void {
        if (Math.abs(this.cardWidth - this._prevCardWidth) > 0) {
            this._horizontalResizing();
        }
        this._stopResizing();
    }

    /**
     * make horizontal resize only on step of 20rem
     * raise stepChange event
     */
    private _horizontalResizing(): void {
        // positive value indicates that width has increased
        const widthIncrement = this.cardWidth - this._prevCardWidth;
        const cardSpan = Math.floor(this.cardWidth / HorizontalResizeStep);
        const cardSpanFraction = this.cardWidth % HorizontalResizeStep;

        if (widthIncrement > 0) {
            this.cardWidth =
                cardSpanFraction > 0 ? (cardSpan + 1) * HorizontalResizeStep : cardSpan * HorizontalResizeStep;
        } else {
            this.cardWidth = cardSpan * HorizontalResizeStep;
        }

        this.stepChange.emit(this._getResizedEventObject());
    }

    /** Sets focus on the element */
    focus(): void {
        this._elementRef.nativeElement.focus();
    }

    onMouseOver(event: MouseEvent): void {
        // this.showResizeIcon = true;
        // this._changeDetectorRef.markForCheck();
        // console.log('mouse over cornerHandle: ', this.cornerHandle);
    }

    onMouseOut(event: MouseEvent): void {
        // this.showResizeIcon = false;
        // this._changeDetectorRef.markForCheck();
        // this.cornerHandleSub.unsubscribe();
    }

    markForCheck(): void {
        this._changeDetectorRef.markForCheck();
    }

    detectChanges(): void {
        this._changeDetectorRef.detectChanges();
    }

    stopCardResizing(): void {
        if (this._resize) {
            this._stopResizing();
        }
    }

    private _stopResizing(): void {
        this._resize = false;
        this.zIndex = 0;
        this.showBorder = false;
        this.resized.emit(this._getResizedEventObject());
    }

    private _getResizedEventObject(): ResizedEvent {
        return new ResizedEvent(this, this._prevCardWidth, this._prevCardHeight, this.cardWidth, this.cardHeight);
    }
}
