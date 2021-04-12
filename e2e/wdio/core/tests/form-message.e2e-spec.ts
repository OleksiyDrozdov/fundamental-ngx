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

    it('should check tooltip visual regression for "Message With Input" when you click in input', () => {
        click(inputMessageField);
        checkState(areaContainer, 'exampleAreaContainersArr');
    });

    it('should check tooltip visual regression for "Message With InputGroup - Changed Programmatically" when you click button', () => {
        click(toggleMessageButton);
        checkState(areaContainer, 'toggleMessageButton');
    });

    it('should check tooltip visual regression for "Message With InputGroup - Hover" when you hover input', () => {
        scrollIntoView(areaContainer);
        mouseHoverElement(inputGroupHover);
        checkState(areaContainer, 'inputGroupHover');
    });

    it('should check tooltip visual regression for "Message With Textarea" when you click in textarea', () => {
        scrollIntoView(areaContainer);
        click(textAreaMessage);
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
        it('should check button state', () => {
            const buttonsArrLength = getElementArrayLength(formMessageButtons);
            for (let i = 0; buttonsArrLength > i; i++) {
                checkElementStates(formMessageButtons, 'Button'+ '-' + i, formMessageButtons, i);
            }
        });
    });

    function checkState(selector: string, tag: string, index: number = 0): void {
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${tag} state mismatch`);
        refreshPage();
    }

    function checkElementHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} hover state mismatch`);
    }

    function checkElementFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        focusElement(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} focus state mismatch`);
    }

    function checkElementActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, formMessagePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }

    function checkElementStates(selector: string, tag: string, elementName: string, index: number = 0): void {
        checkElementHoverState(selector, tag + 'hover-state-', elementName, index);
        checkElementFocusState(selector, tag + 'focus-state-', elementName, index);
        checkElementActiveState(selector, tag + 'active-state-', elementName, index);
    }
});
