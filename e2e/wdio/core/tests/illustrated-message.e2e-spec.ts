import { IllustratedMessagePo } from '../pages/illustrated-message.po';
import {checkElementScreenshot, 
    click, 
    mouseHoverElement, 
    saveElementScreenshot, 
    isElementClickable, 
    elementDisplayed,
    pause,
    doesItExist} from '../../driver/wdio';

describe('Illistrated-message tests', function() {
    const illustratedMessagePage = new IllustratedMessagePo();
    const {sceneFirstBtn, 
        sceneSecondBtn, 
        spotBtn, 
        buttonDialog, 
        dialogPopup,
        closePopupButtonHeader,
        closePopupButton} = illustratedMessagePage;

    beforeAll(()=>{
        illustratedMessagePage.open();                              
    },1);

    it('should check RTL and LTR orientation', () => {              
        illustratedMessagePage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        illustratedMessagePage.saveExampleBaselineScreenshot();
        expect(illustratedMessagePage.compareWithBaseline()).toBeLessThan(1);
    });

    it('should check is button clickable', () => {
        expect(isElementClickable(sceneFirstBtn)).toBeTruthy();
        expect(isElementClickable(sceneSecondBtn)).toBeTruthy();
        expect(isElementClickable(spotBtn)).toBeTruthy();
    });

    it('should open dialog popup illustrated Message', () => {
        click(buttonDialog);
        pause(100);
        expect(elementDisplayed(dialogPopup)).toBeTruthy();
    });

    it('should close dialog popup illustrated Message "closePopupButtonHeader"', () => {
        click(closePopupButtonHeader);
        expect(doesItExist(dialogPopup)).toBeFalsy();
    });

    it('should close dialog popup illustrated Message "closePopupButton"', () => {
        click(buttonDialog);
        click(closePopupButton);
        expect(doesItExist(dialogPopup)).toBeFalsy();
    });

    describe('verify buttons hover and focus', function() {
        it('should check button hover state', () => {
            checkButtonHoverState(sceneFirstBtn, 'button','sceneFirstBtn');
        });

        it('should check button focus state', () => {
            checkButtonFocusState(sceneFirstBtn, 'button','sceneFirstBtn');
        });

        it('should check button hover state', () => {
            checkButtonHoverState(sceneSecondBtn, 'button','sceneSecondBtn');
        });

        it('should check button focus state', () => {
            checkButtonFocusState(sceneSecondBtn, 'button','sceneSecondBtn');
        });

        it('should check button hover state', () => {
            checkButtonHoverState(spotBtn, 'button', 'spotBtn');
        });

        it('should check button focus state', () => {
            checkButtonFocusState(spotBtn, 'button', 'spotBtn');
        });
    });

    function checkButtonHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(101, `${btnName} button hover state mismatch`);
    }

    function checkButtonFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        click(selector, index);
        saveElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, illustratedMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(101, `${btnName} button focus state mismatch`);
    }
});