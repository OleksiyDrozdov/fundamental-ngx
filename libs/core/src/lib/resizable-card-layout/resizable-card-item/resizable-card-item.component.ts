import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

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

let cardRank = 1;

@Component({
    selector: 'fd-resizable-card-item',
    templateUrl: 'resizable-card-item.component.html',
    styleUrls: ['./resizable-card-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ResizableCardItemComponent implements OnDestroy, FocusableOption {
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
    stepChange: any;

    @Output()
    resizing: any;

    @Output()
    resized: any;

    @Output()
    dropped: any;

    @Output()
    miniHeaderReached: any;

    @Output()
    miniContentReached: any;

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

    private verticalHandleSub: Subscription = Subscription.EMPTY;
    private horizontalHandleSub: Subscription = Subscription.EMPTY;

    private _config: ResizableCardItemConfig;
    private _prevX: number;
    private _prevY: number;
    private _resize = false;
    private _resizeDirection: ResizeDirection;

    constructor(private _changeDetectorRef: ChangeDetectorRef, private _elementRef: ElementRef) {}

    ngOnDestroy(): void {
        this.verticalHandleSub.unsubscribe();
        this.horizontalHandleSub.unsubscribe();
    }

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
        this._resizeDirection = resizeDirection;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        if (!this._resize) {
            return;
        }
        this.zIndex = 1;

        if (this._resizeDirection === 'both') {
            this.cardWidth = this.cardWidth - (this._prevX - event.clientX);
            this.cardHeight = this.cardHeight - (this._prevY - event.clientY);
        } else if (this._resizeDirection === 'horizontal') {
            this.cardWidth = this.cardWidth - (this._prevX - event.clientX);
        } else {
            this.cardHeight = this.cardHeight - (this._prevY - event.clientY);
        }
        this._prevX = event.clientX;
        this._prevY = event.clientY;
    }

    onMouseUp(event: MouseEvent, resizeDirection: ResizeDirection): void {
        this._resize = false;
        this.zIndex = 0;
        this.showBorder = false;
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
}
