import { IllustratedMessagePo } from '../pages/illustrated-message.po';
import {checkElementScreenshot, 
    click, 
    mouseHoverElement, 
    saveElementScreenshot, 
    isElementClickable, 
    elementDisplayed,
    doesItExist,
    addIsActiveClass,
    getElementArrayLength,
    waitForElDisplayed} from '../../driver/wdio';

describe('Illistrated-message tests', function() {
    const illustratedMessagePage = new IllustratedMessagePo();
    const {sceneAndSpotButtons, 
        buttonDialog, 
        dialogPopup,
        closePopupSignButton,
        closePopupButton} = illustratedMessagePage;

    beforeAll(()=>{
        illustratedMessagePage.open();                              
    },1);

    describe('verify buttons hover, focus and active state', function() {
        it('should check back button hover state', () => {
            const buttonsArrLength = getElementArrayLength(sceneAndSpotButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonHoverState(sceneAndSpotButtons, 'HoverState'+ '-' + i, sceneAndSpotButtons, i);
            }
        });
        it('should check back button focus state', () => {
            const buttonsArrLength = getElementArrayLength(sceneAndSpotButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonFocusState(sceneAndSpotButtons, 'FocusState'+ '-' + i, sceneAndSpotButtons, i);
            }
        });
        it('should check back button active state', () => {
            const buttonsArrLength = getElementArrayLength(sceneAndSpotButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonActiveState(sceneAndSpotButtons, 'ActiveState'+ '-' + i, sceneAndSpotButtons, i);
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

    it('should open dialog popup illustrated message', () => {
        click(buttonDialog);
        waitForElDisplayed(dialogPopup);
        expect(elementDisplayed(dialogPopup)).toBeTruthy();
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

    function checkButtonHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button hover state mismatch`);
    }

    function checkButtonFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        click(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button focus state mismatch`);
    }

    function checkButtonActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }
});