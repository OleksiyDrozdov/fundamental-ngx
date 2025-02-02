import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { FormGeneratorService } from '../form-generator.service';
import { DynamicFormItem, DynamicFormValue } from '../interfaces/dynamic-form-item';
import { DynamicFormControl } from '../dynamic-form-control';

/**
 * @description Form Generator component represents a high-level component
 * which includes @see FormGroup inside.
 */
@Component({
    selector: 'fdp-form-generator',
    templateUrl: './form-generator.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGeneratorComponent implements OnDestroy {

    /**
     * @description Renderer for the custom html code passed into the component.
     */
    @ViewChild('renderer', { static: false })
    renderer: TemplateRef<any>;

    /**
     * @description List of @see DynamicFormItem representing the list of items
     * to be rendered in the form.
     */
    @Input()
    get formItems(): DynamicFormItem[] {
        return this._formItems;
    };

    set formItems(formItems: DynamicFormItem[]) {
        this._formItems = formItems.map(i => ({...i}));

        this._generateForm();
    }

    /**
     * @description Form main title.
     */
    @Input() mainTitle: string;

    /**
     * @description Specify the column layout in the format `XLn-Ln-Mn-Sn`
     * where n is the number of columns and can be different for each size.
     * eg: XL2-L2-M2-S1 would create 2-column layouts for XL, L,
     * and M sizes and single-column layout for S size.
     */
    @Input() columnLayout: string;

    /**
     * @description Event which notifies parent component that the form has been successfuly created
     * and all controls are in place.
     */
    @Output()
    formCreated = new EventEmitter<FormGroup>();

    /**
     * @description Event which notifies parent component that the form has been successfuly validated
     * and submitted.
     */
    @Output()
    formSubmitted = new EventEmitter<DynamicFormValue>();

    /**
     * @description Represents the form instance. @see NgForm
     */
    @ViewChild(NgForm) ngForm: NgForm;

    /**
     * @description Dynamically generated form. @see FormGeneratorService
     */
    form: FormGroup;
    /**
     * @description List of the form controls.
     */
    formControlItems: DynamicFormControl[];

    /**
     * Set of flags representing if particular form item should be visible to the user.
     */
    shouldShowFields: {[key: string]: boolean} = {};

    /**
     * Flag representing that form is loading
     */
    formLoading = true;

    /**
     * @hidden
     */
    private _allowSubscribe = true;

    /**
     * @hidden
     */
    private _formItems: DynamicFormItem[];

    /**
     * @hidden
     */
    private _formValueSubscription: Subscription;

    constructor(
        private _fgService: FormGeneratorService,
        private _cd: ChangeDetectorRef
    ) {
    }

    /**
     * @hidden
     */
    ngOnDestroy(): void {
        this._allowSubscribe = false;
    }

    /**
     * @hidden
     */
    async _onSubmit(): Promise<void> {

        this.form.markAllAsTouched();
        this._cd.markForCheck();

        // stop here if form is invalid
        if (this.form.invalid || this.form.pending) {
            return;
        }

        const formValue = await this._fgService.getFormValue(this.form);

        this.formSubmitted.emit(formValue);

        this.form.markAsPristine();
    }

    /**
     * @hidden
     */
    _getErrors(errors: {[key: string]: any}): {type: string; value: any}[] {
        return Object.entries(errors).map(e => {
            const errorType = e[0];
            let errorValue = e[1];

            const defaultErrorValue = this._fgService.getValidationErrorHints(errorType);

            if (defaultErrorValue) {
                errorValue = defaultErrorValue;
            }
            return {type: errorType, value: errorValue};
        });
    }

    /**
     * @hidden
     */
    private async _generateForm(): Promise<void> {

        this.formLoading = true;

        const form = await this._fgService.generateForm(this.formItems);

        this._formValueSubscription?.unsubscribe();

        this.form = form;

        this.formControlItems = Object.values(this.form.controls) as DynamicFormControl[];

        this.shouldShowFields = await this._fgService.checkVisibleFormItems(this.form);

        this._formValueSubscription = this.form.valueChanges
        .pipe(takeWhile(() => this._allowSubscribe), debounceTime(50))
        .subscribe(async () => {
            this.shouldShowFields = await this._fgService.checkVisibleFormItems(this.form);
            this._cd.markForCheck();
        });

        this.formLoading = false;

        this._cd.detectChanges();

        this.formCreated.emit(this.form);
    }

    /**
     *
     * @hidden
     */
    _trackFn(index: number, value: DynamicFormControl): string {
        return `${index}_${value.formItem.name}`;
    }

    /**
     *
     * @description Programmatically submit form.
     * This method also calls validation for the form items.
     */
    submit(): void {
        this.ngForm.ngSubmit.emit();
    }
}
