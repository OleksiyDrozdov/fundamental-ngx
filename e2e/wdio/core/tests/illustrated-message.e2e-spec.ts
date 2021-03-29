import { IllustratedMessagePo } from '../pages/illustrated-message.po';
import {click} from '../../driver/wdio';

describe('Illistrated-message tests', function() {
    const illustratedMessagePage = new IllustratedMessagePo();
    const {illustratedMessageButtons, buttonDialog, dialogPopup, popupCloseButtons} = illustratedMessagePage;

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

    for (let btn of illustratedMessageButtons) {
        it('should check is button clickable', () => {
            click(btn.selectorBtn);
            const el = $(btn.selectorBtn);
            const isClickable = el.isClickable();
            expect(isClickable).toBeTruthy();
        });
    };
        
    it('should open dialog popup illustrated Message', () => {
        click(buttonDialog);
        browser.pause(100);
        const el = $(dialogPopup);
        const isDisplayed = el.isDisplayed();
        expect(isDisplayed).toBeTruthy();
    });

    for (let btn of popupCloseButtons) {
        it('should close dialog popup illustrated Message', () => {
            click(buttonDialog);
            click(btn.selectorBtn);
            const el = $(dialogPopup);
            const isDisplayed = el.isDisplayed();
            expect(isDisplayed).toBeFalsy();
        });
    };
});