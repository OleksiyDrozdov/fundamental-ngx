import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

export type ResizeDirection = 'vertical' | 'horizontal' | 'both';

@Component({
    selector: 'fd-resizable-card-item',
    templateUrl: 'resizable-card-item.component.html',
    styleUrls: ['./resizable-card-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizableCardItemComponent implements OnInit, AfterViewInit, OnDestroy, FocusableOption {
    @Input()
    id: string;

    @Input()
    forceRender = false;

    @Input()
    resizable = true;

    @Input()
    resizeBoth = true;

    @Input()
    resizeHorizontal = false;

    @Input()
    resizeVertical = false;

    @HostBinding('style.left')
    left = 0;

    @HostBinding('style.top')
    top = 0;

    @HostBinding('style.z-index')
    zIndex = 0;

    @HostBinding('style.position')
    position = 'absolute';

    @ViewChild('cornerHandle')
    cornerHandle: ElementRef;

    @ViewChild('horizontalHandle')
    horizontalHandle: ElementRef;

    @ViewChild('verticalHandle')
    verticalHandle: ElementRef;

    @ViewChild('resizeCard')
    cardElementRef: ElementRef;

    
    showResizeIcon = true;
    cardWidth: number;
    cardHeight: number;
    showBorder = false;

    private verticalHandleSub: Subscription = Subscription.EMPTY;
    private horizontalHandleSub: Subscription = Subscription.EMPTY;

    private _prevX: number;
    private _prevY: number;
    private _resize = false;
    private _resizeDirection: ResizeDirection;

    constructor(private _changeDetectorRef: ChangeDetectorRef, private _elementRef: ElementRef) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this.verticalHandleSub.unsubscribe();
        this.horizontalHandleSub.unsubscribe();
    }

    onMouseDown(event: MouseEvent, resizeDirection: ResizeDirection): void {
        event.preventDefault();
        this.showBorder = true;
        this._resize = true;
        this._prevX = event.clientX;
        this._prevY = event.clientY;
        this.cardWidth = this.cardElementRef.nativeElement.getBoundingClientRect().width;
        this.cardHeight = this.cardElementRef.nativeElement.getBoundingClientRect().height;
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
        console.log('onMouseUp resizeDirection: ', resizeDirection);
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
}
