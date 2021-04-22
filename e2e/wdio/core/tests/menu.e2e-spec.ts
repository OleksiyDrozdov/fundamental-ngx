import { MenuPo } from '../pages/menu.po';
import { checkElementScreenshot,
    click, 
    mouseHoverElement, 
    saveElementScreenshot, 
    addIsActiveClass,
    focusElement, 
    getElementArrayLength,
    pause,
    waitForElDisplayed,
    elementDisplayed,
    doesItExist} from '../../driver/wdio';

describe('Menu tests', function() {
    const menuPage = new MenuPo();
    const { menuButtonsArr, 
        btnMobileMenu, 
        menuItemsArr, 
        dialogMobileMenu,
        closeDialogMobileMenu,
        dialogMenuAddonArr,
        dialogMenuItemsArr,
        dialogBtnBack } = menuPage;

    beforeAll(() => {
        menuPage.open();                              
    }, 1);

    it('should check RTL and LTR orientation', () => {
        menuPage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        menuPage.saveExampleBaselineScreenshot();
        expect(menuPage.compareWithBaseline()).toBeLessThan(1);
    }); 

    it('should check cascading menu for all buttons', () => {
        const buttonsArrLength = getElementArrayLength(menuButtonsArr);
        for (let i = 0; i < buttonsArrLength; i++) {
            click(menuButtonsArr, i);   
            let menuItemsArrLength = getElementArrayLength(menuItemsArr);
            for (let j = 0; j < menuItemsArrLength; j++) {
                checkElementHoverState(menuItemsArr, 'Button'+'-'+ menuItemsArr + '-' + i +'.'+ j, menuItemsArr, j);
                menuItemsArrLength = getElementArrayLength(menuItemsArr);
            }
        }
    });  

    describe('verify buttons hover, focus and active state', function() {
        it('should check button state', () => {
            const buttonsArrLength = getElementArrayLength(menuButtonsArr);
            for (let i = 0; i < buttonsArrLength; i++) {
                checkElementStates(menuButtonsArr, 'Button'+ menuButtonsArr + '-' + i, menuButtonsArr, i);
            }
        });
    });

    describe('check dialog popup Mobile Menu example', function() {
        it('should open and close dialog popup Mobile Menu', () => {
            click(btnMobileMenu);
            waitForElDisplayed(dialogMobileMenu);
            expect(elementDisplayed(dialogMobileMenu)).toBeTruthy();
            pause(1000);
            click(closeDialogMobileMenu);
            expect(doesItExist(dialogMobileMenu)).toBeFalse();                                        
        });

        it('should check cascading menu for all dialog popup buttons', () => {
            click(btnMobileMenu);
            const dialogMenuItemsArrLength = getElementArrayLength(dialogMenuItemsArr);
            for (let i = 0; i < dialogMenuItemsArrLength; i++) {
                checkElementHoverState(dialogMenuItemsArr, 'Button-dialog'+'-'+ dialogMenuItemsArr + '-' + i, dialogMenuItemsArr, i);
            }
            checkDialogCascadingMenu(dialogMenuItemsArr, dialogMenuAddonArr, dialogBtnBack, dialogMenuItemsArrLength);
        });
    });

    function checkDialogCascadingMenu(selector: string, btnSelector: string, btnBackSelector: string, previousLength: number): void {
        for (let i = 0; i < previousLength; i++) {
            click(btnSelector, i);
            const length = getElementArrayLength(selector);
            const currentLength = length;
            for (let j = 0; j < length; j++) {
                checkElementHoverState(selector, 'Button-dialog-menu'+'-'+ selector + '-' + j + '.' + i, selector, j);
            }
            if (doesItExist(dialogMenuAddonArr)) {
                checkDialogCascadingMenu(selector, btnSelector, btnBackSelector, currentLength);     
            }
            click(dialogBtnBack);
        }
    }

    function checkElementHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index))
            .toBeLessThan(3, `${btnName} button item ${index} hover state mismatch`);
    }

    function checkElementFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        focusElement(selector, index);
        saveElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} focus state mismatch`);
    }

    function checkElementActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, menuPage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }

    function checkElementStates(selector: string, tag: string, elementName: string, index: number = 0): void {
        checkElementHoverState(selector, tag + 'hover-state-', elementName, index);
        checkElementFocusState(selector, tag + 'focus-state-', elementName, index);
        checkElementActiveState(selector, tag + 'active-state-', elementName, index);
    }
});
