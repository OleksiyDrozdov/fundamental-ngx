import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class TokenPo extends CoreBaseComponentPo {
    url = '/token';
    root = '#page-content';      
    tokenizerButtons = 'fd-tokenizer-example span.fd-token__close';
    compactTokenizerButtons = 'fd-tokenizer-compact-example span.fd-token__close';
    defaultTokenButtons = '.fd-doc-component fd-token-example span.fd-token__close';

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }
    
    saveExampleBaselineScreenshot(specName: string = 'token'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'token'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
