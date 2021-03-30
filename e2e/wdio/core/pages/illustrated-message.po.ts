import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent, getImageTagBrowserPlatform} from '../../driver/wdio';

export class IllustratedMessagePo extends CoreBaseComponentPo {
    url = '/illustrated-message';
    root = '#page-content';
    
    sceneFirstBtn = '#fd-illustrated-message-0 .fd-button:first-child';
    sceneSecondBtn = '#fd-illustrated-message-0 .fd-button+button';
    spotBtn = '#fd-card-id-0 .fd-button';
    buttonDialog = '#background-ex1 .fd-button';
    dialogPopup = '[role="dialog"]';
    closePopupButtonHeader = '.fd-dialog__header .fd-button';
    closePopupButton = '.fd-dialog__footer [label="Close"]>button';

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