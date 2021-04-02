import { FormMessagePo } from '../pages/form-message.po';
import { 
    text, 
    longLine, 
    number, 
    specialCharacters 
} from '../fixtures/testData/input';
import {
    addIsActiveClass,
    addValue,
    checkElementScreenshot,
    click,
    focusElement,
    getElementArrayLength,
    getValue,
    mouseHoverElement,
    refreshPage,
    saveElementScreenshot,
    scrollIntoView,
    setValue,
    waitForElDisplayed
} from '../../driver/wdio';

describe('Form-message Test', function() {
    const formMessagePage = new FormMessagePo();
    const { 
        formMessageInputs, 
        inputGroupHover,
        toggleMessageButton, 
        areaContainer,
        textAreaMessage,
        inputMessageField,
        formMessageButtons } = formMessagePage;
    
    beforeAll(()=>{
        formMessagePage.open();
    }, 1);

    it('should check RTL and LTR orientation', () => {
        formMessagePage.checkRtlSwitch();
    });

    it('should check visual regression for "Input" when you click in input', () => {
        click(inputMessageField);
        checkState(areaContainer, 'exampleAreaContainersArr');
    });

    it('should check visual regression for "InputGroup - Changed Programmatically" when you click button', () => {
        click(toggleMessageButton);
        checkState(areaContainer, 'toggleMessageButton');
    });

    it('should check visual regression for "InputGroup - Hover" when you hover input', () => {
        scrollIntoView(areaContainer);
        mouseHoverElement(inputGroupHover);
        checkState(areaContainer, 'inputGroupHover');
    });

    it('should check visual regression for "Textarea - Try to focus" when you focus in textarea', () => {
        scrollIntoView(areaContainer);
        focusElement(textAreaMessage);
        checkState(areaContainer, 'textAreaMessage');
    });


    it('should by default accept all kinds of input values – alphabet, numerical, special characters', () => {
        const buttonsArrLength = getElementArrayLength(formMessageInputs);
        for (let i = 0; buttonsArrLength > i; i++) {
            waitForElDisplayed(formMessageInputs, i);
            setValue(formMessageInputs, text, i);
            addValue(formMessageInputs, number, i);
            addValue(formMessageInputs, specialCharacters, i);
            addValue(formMessageInputs, longLine, i);
            expect(getValue(formMessageInputs, i))
                .toEqual(text + number + specialCharacters + longLine, `input ${i} is not appropriate`);
        }
    });

    describe('verify buttons hover, focus and active state', function() {
        it('should check back button hover state', () => {
            const buttonsArrLength = getElementArrayLength(formMessageButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonHoverState(formMessageButtons, 'HoverState'+ '-' + i, formMessageButtons, i);
            }
        });

        it('should check back button focus state', () => {
            const buttonsArrLength = getElementArrayLength(formMessageButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonFocusState(formMessageButtons, 'FocusState'+ '-' + i, formMessageButtons, i);
            }
        });
        
        it('should check back button active state', () => {
            const buttonsArrLength = getElementArrayLength(formMessageButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkButtonActiveState(formMessageButtons, 'ActiveState'+ '-' + i, formMessageButtons, i);
            }
        });
    });

    function checkState(selector: string, tag: string, index: number = 0): void {
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${tag} state mismatch`);
        refreshPage();
    }

    function checkButtonHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} hover state mismatch`);
    }

    function checkButtonFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        focusElement(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} focus state mismatch`);
    }

    function checkButtonActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }
});
