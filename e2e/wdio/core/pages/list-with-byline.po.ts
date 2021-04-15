import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class ListWithBylinePo extends CoreBaseComponentPo {
    url = '/list-byline';
    root = '#page-content';

    listItems = '.fd-list__item';
    checkboxSelectors = '.fd-checkbox';
    radiobuttonSelectors = '.fd-radio';
    bylineButtons = '.fd-list__item .fd-button';

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }
    
    saveExampleBaselineScreenshot(specName: string = 'list-with-byline'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'list-with-byline'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
