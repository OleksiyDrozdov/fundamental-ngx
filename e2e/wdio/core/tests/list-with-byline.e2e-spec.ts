import { ListWithBylinePo } from '../pages/list-with-byline.po';
import { checkElementScreenshot, 
    mouseHoverElement, 
    saveElementScreenshot, 
    addIsActiveClass,
    getElementArrayLength, 
    focusElement, 
    getAttributeByName,
    clickNextElement,
    getAttributeByNameArr } from '../../driver/wdio';
import { checkElArrIsClickable, checkElementText } from '../../helper/assertion-helper';

describe('List-with-byline tests', function() {
    const listWithBylinePage = new ListWithBylinePo();

    const { listItems, checkboxSelectors, radiobuttonSelectors, bylineButtons } = listWithBylinePage;

    beforeAll(() => {
        listWithBylinePage.open();                              
    }, 1);

    it('should check RTL and LTR orientation', () => {
        listWithBylinePage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        listWithBylinePage.saveExampleBaselineScreenshot();
        expect(listWithBylinePage.compareWithBaseline()).toBeLessThan(1);
    });

    it('should check interaction and content', () => {
        checkElArrIsClickable(listItems);
        checkElementText(listItems);
    });

    it('should SET/UNSET the box', () => {
        const checkboxesArrLength = getElementArrayLength(checkboxSelectors);
        for (let i = 0; i < checkboxesArrLength; i++) {
            checkMarkingCheckbox(checkboxSelectors, i);
        }
    });

    it('should SET/UNSET radio buttons', () => {
        const checkboxesArrLength = getElementArrayLength(radiobuttonSelectors);
        for (let i = 0; i < checkboxesArrLength; i++) {
            checkMarkingRadiobutton(radiobuttonSelectors, i, checkboxesArrLength);
        }
    });

    describe('verify Edit and Close buttons hover, focus, active state', function() {
        it('should check button state', () => {
            const buttonsArrLength = getElementArrayLength(bylineButtons);
            for (let i = 0; i < buttonsArrLength; i++) {
                checkElementStates(bylineButtons, 'Butto'+ '-' + i, listItems, i);
            }
        });
    });

    function checkElementHoverState(selector: string, tag: string, btnName: string, index: number = 0): void {
        mouseHoverElement(selector, index);
        saveElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} hover state mismatch`);
    }

    function checkElementFocusState(selector: string, tag: string, btnName: string, index: number = 0): void {
        focusElement(selector, index);
        saveElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} focus state mismatch`);
    }

    function checkElementActiveState(selector: string, tag: string, btnName: string, index: number = 0): void {
        addIsActiveClass(selector, index);
        saveElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index);
        expect(checkElementScreenshot(selector, tag, listWithBylinePage.getScreenshotFolder(), index))
            .toBeLessThan(2, `${btnName} button item ${index} active state mismatch`);
    }

    function checkElementStates(selector: string, tag: string, elementName: string, index: number = 0): void {
        checkElementHoverState(selector, tag + 'hover-state-', elementName, index);
        checkElementFocusState(selector, tag + 'focus-state-', elementName, index);
        checkElementActiveState(selector, tag + 'active-state-', elementName, index);
    }

    function checkMarkingCheckbox(selector: string, index: number): void {
        const beforeClicking = getAttributeByName(selector, 'aria-checked', index);
        clickNextElement(selector, index);
        const afterClickingOnce = getAttributeByName(selector, 'aria-checked', index);
        clickNextElement(selector, index);
        const afterClickingTwice = getAttributeByName(selector, 'aria-checked', index);
        expect(beforeClicking).not.toEqual(afterClickingOnce);
        expect(afterClickingTwice).toEqual(beforeClicking);
    }

    function checkMarkingRadiobutton(selector: string, index: number, arrLength: number): void {
        const beforeClicking = getAttributeByName(selector, 'aria-checked', index);
        clickNextElement(selector, index);
        const afterClicking = getAttributeByName(selector, 'aria-checked', index);
        expect(beforeClicking).not.toEqual(afterClicking);
        const arrRadiobuttons = getAttributeByNameArr(selector, 'aria-checked').filter(radio => radio === 'true');
        expect(arrRadiobuttons.length).toBe(1, `should be only one element with index - ${index}`);
    }
});
