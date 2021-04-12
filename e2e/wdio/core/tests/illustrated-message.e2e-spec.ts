import { IllustratedMessagePo } from '../pages/illustrated-message.po';
import { checkElementScreenshot, 
    click, 
    mouseHoverElement, 
    saveElementScreenshot, 
    isElementClickable, 
    elementDisplayed,
    doesItExist,
    addIsActiveClass,
    getElementArrayLength,
    waitForElDisplayed, 
    focusElement } from '../../driver/wdio';

describe('Illistrated-message tests', function() {
    const illustratedMessagePage = new IllustratedMessagePo();
    const { sceneAndSpotButtons, 
        buttonDialog, 
        dialogPopup,
        closePopupSignButton,
        closePopupButton } = illustratedMessagePage;

    beforeAll(() => {
        illustratedMessagePage.open();                              
    }, 1);

    describe('verify buttons hover, focus and active state', function() {
        it('should check button state', () => {
            const buttonsArrLength = getElementArrayLength(sceneAndSpotButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkElementStates(sceneAndSpotButtons, 'Butto'+ '-' + i, sceneAndSpotButtons, i);
            }
        });
    });

    it('should check RTL and LTR orientation', () => {              
        illustratedMessagePage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        illustratedMessagePage.saveExampleBaselineScreenshot();
        expect(illustratedMessagePage.compareWithBaseline()).toBeLessThan(1);
    });

    it('should check is button clickable', () => {
        const buttonsArrLength = getElementArrayLength(sceneAndSpotButtons);
        for (let i = 0; buttonsArrLength > i; i++) {
            expect(isElementClickable(sceneAndSpotButtons, i)).toBe(true, `Button ${i} is not clickable`);
        }
    });

    describe('check dialog example', function() {
        it('should open dialog popup illustrated message', () => {
            click(buttonDialog);
            waitForElDisplayed(dialogPopup);
            expect(elementDisplayed(dialogPopup)).toBeTruthy();
        });

        it('should check visual regression dialog popup illustrated message', () => {
            expect(checkElementScreenshot(dialogPopup, 'dialogPopup', illustratedMessagePage.getScreenshotFolder()))
                .toBeLessThan(1);
        }); 

        it('should close dialog popup illustrated message by click on "Close sign X" button', () => {
            click(closePopupSignButton);
            expect(doesItExist(dialogPopup)).toBeFalsy();
        });

        it('should close dialog popup illustrated message by click on "Close" button', () => {
            click(buttonDialog);
            click(closePopupButton);
            expect(doesItExist(dialogPopup)).toBeFalsy();
        });
    });

    function checkElementHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} hover state mismatch`);
    }

    function checkElementFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        focusElement(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} focus state mismatch`);
    }

    function checkElementActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }

    function checkElementStates(selector: string, tag: string, elementName: string, index: number = 0): void {
        checkElementHoverState(selector, tag + 'hover-state-', elementName, index);
        checkElementFocusState(selector, tag + 'focus-state-', elementName, index);
        checkElementActiveState(selector, tag + 'active-state-', elementName, index);
    }
});
