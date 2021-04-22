import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class MenuPo extends CoreBaseComponentPo {
    url = '/menu';
    root = '#page-content';
    menuButtonsArr = '.docs-tile__content .fd-button.fd-button--standard';
    menuItemsArr = '.fd-menu__item';
    btnMobileMenu = 'fd-menu-mobile-example button';
    dialogMobileMenu = 'div[role="dialog"]';
    closeDialogMobileMenu = 'fd-bar-element button';
    dialogMenuItemsArr = 'fd-dialog-body li';
    dialogMenuAddonArr = 'div .fd-menu__addon-after';
    dialogBtnBack = '#menu-mobile-navigate-back';

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }
    
    saveExampleBaselineScreenshot(specName: string = 'menu'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'menu'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
