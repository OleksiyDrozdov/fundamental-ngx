import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class TimePo extends CoreBaseComponentPo {
    url = '/time';
    root = '#page-content';  
    
    btnUpArrow = 'button[glyph="navigation-up-arrow"]';  
    btnDownArrow = 'button[glyph="navigation-down-arrow"]';  
    time24Hours = 'fd-time-example ';
    time24HoursCol = `${this.time24Hours}fd-time-column.fd-time__col`;
    time24HoursNumbers = `${this.time24Hours}[ng-reflect-active="true"] li span`;
    time12Hours = 'fd-time-12-example ';
    time12HoursCol = `${this.time12Hours}fd-time-column.fd-time__col`;
    time12HoursNumbers = `${this.time12Hours}[ng-reflect-active="true"] li span`;
    timeNoSpinners = 'fd-time-no-spinners-example ';
    timeNoSpinnersCol = `${this.timeNoSpinners}fd-time-column.fd-time__col`;
    timeNoSpennersNumbers = `${this.timeNoSpinners}[ng-reflect-active="true"] li span`;
    timeProgExample = 'fd-time-programmatically-example ';
    timeProgExampleBtn = `${this.timeProgExample}.fd-button--standard span`;
    timeProgExampleNumbers = `${this.timeProgExample}[ng-reflect-active="true"] li span`;
    timeDigitsExample = 'fd-time-two-digits-example ';
    timeDigitsExampleNumbers = `${this.timeDigitsExample}[ng-reflect-active="true"] li span`;
    
    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }
    
    saveExampleBaselineScreenshot(specName: string = 'time'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'time'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
