import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent} from '../../driver/wdio';

export class IllustratedMessagePo extends CoreBaseComponentPo {
    url = '/illustrated-message';
    root = '#page-content';

    illustratedMessageButtons = [
        {selectorBtn: '#fd-illustrated-message-0 .fd-button:first-child'},  
        {selectorBtn: '#fd-illustrated-message-0 .fd-button+button'},  
        {selectorBtn: '#fd-card-id-0 .fd-button'},  
    ];

    dialogPopup = '[role="dialog"]';

    popupCloseButtons = [
        {selectorBtn: '.fd-dialog__header .fd-button'},
        {selectorBtn: '.fd-dialog__footer [label="Close"]>button'},
    ];

    buttonDialog = '#background-ex1 .fd-button';

    buttonClose = `${this.dialogPopup} .fd-button`;

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }

    saveExampleBaselineScreenshot(specName: string = 'illustrated-message'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'illustrated-message'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}