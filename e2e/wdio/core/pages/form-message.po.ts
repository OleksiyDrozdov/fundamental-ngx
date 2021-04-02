import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class FormMessagePo extends CoreBaseComponentPo {
    url = '/form-message';
    root = '#page-content';

    inputMessageField = '#input-message';
    toggleMessageButton = 'fd-popover-control button';
    inputGroupHover = '#group-message input';
    textAreaMessage = '#textarea-message';
    formMessageInputs = 'fd-popover-control input';
    areaContainer = '.docs-tile-content-example';
    formMessageButtons = '.fd-doc-component .fd-button';

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }
}