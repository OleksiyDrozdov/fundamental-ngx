import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class FormMessagePo extends CoreBaseComponentPo {
    url = '/form-message';
    root = '#page-content';

    autocompleteInputLabel = 'fdp-platform-input-auto-complete-validation-example label';

    arrOfFields = [
        {fieldSelector: '#input-message'},
        {fieldSelector: '#background-ex0 div:nth-child(2) input'},
        {fieldSelector: '#background-ex0 div:nth-child(3) input'},
        {fieldSelector: '#textarea-message'}
    ];

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }
}