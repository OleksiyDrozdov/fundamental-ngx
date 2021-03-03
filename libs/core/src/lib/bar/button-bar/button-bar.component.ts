import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    ViewChild
} from '@angular/core';
import { BaseButton, ButtonType } from '../../button/base-button';
import { ButtonComponent } from '../../button/button.component';
import { Subscription } from 'rxjs';
import { ContentDensityService } from '../../utils/public_api';

@Component({
  selector: 'fd-button-bar',
  template: `
      <button fd-button
              [type]="type"
              [glyphPosition]="glyphPosition"
              [glyph]="glyph"
              [compact]="compact"
              [fdType]="fdType"
              [label]="label"
              [fdMenu]="fdMenu"
              [disabled]="disabled"
      >
          <ng-content></ng-content>
      </button>
  `
})
export class ButtonBarComponent extends BaseButton implements OnInit, OnDestroy {
    /** Whether the element should take the whole width of the container. */
    @Input()
    @HostBinding('class.fd-bar__element--full-width')
    fullWidth = false;

    /** Whether to apply compact mode to the button. */
    @Input()
    compact: boolean = null;

    /** The type of the button. Types include:
     * 'standard' | 'positive' | 'negative' | 'attention' | 'half' | 'ghost' | 'transparent' | 'emphasized' | 'menu'.
     * Default value is set to 'transparent'
     */
    @Input()
    fdType: ButtonType = 'transparent';

    /** @hidden */
    @HostBinding('class.fd-bar__element')
    _barElement = true;

    /** @hidden */
    @ViewChild(ButtonComponent)
    _buttonComponent: ButtonComponent;

    /** @hidden */
    private _subscriptions = new Subscription();

    constructor(@Optional() private _contentDensityService: ContentDensityService, private _cdRef: ChangeDetectorRef) {
        super();
    }

    /** @hidden */
    ngOnInit(): void {
        if (this.compact === null && this._contentDensityService) {
            this._subscriptions.add(this._contentDensityService.contentDensity.subscribe(density => {
                this.compact = density === 'compact';
                this._cdRef.detectChanges();
            }));
        }
    }

    /** @hidden */
    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
