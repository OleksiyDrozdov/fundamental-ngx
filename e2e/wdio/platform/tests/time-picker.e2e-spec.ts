import {
    click,
    doesItExist,
    elementArray,
    getAttributeByName,
    getElementArrayLength,
    getText,
    getValue,
    refreshPage,
    scrollIntoView,
    sendKeys,
    setValue,
    waitForElDisplayed,
    waitForPresent
} from '../../driver/wdio';
import { time, text, defaultValidTime } from '../fixtures/testData/time-picker';
import { TimePicker } from '../pages/time-picker.po';

let timePickerPage: TimePicker;
const {
    activeTimePickerInput, timePickerButton, timePickerInput, timerExpanded,
    activeTimePickerButton, errorBorder,
    selectedHours, selectedMinutes, period,
    navigationDownArrowButton, timeItem, setToNullButton, setValidTimeButton
} = new TimePicker();

describe('Time picker suite', function() {
    timePickerPage = new TimePicker();

    beforeAll(() => {
        timePickerPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(timePickerInput);
    }, 1);

    it('Verify in all the form factor user is able to see the date picker button and input field ', () => {
        const buttons = elementArray(timePickerButton);
        const inputs = elementArray(timePickerInput);
        expect(buttons.length).toEqual(inputs.length);
        for (let i = 1; i < buttons.length; i++) {
            waitForElDisplayed(timePickerButton, i);
            waitForElDisplayed(timePickerInput, i);
        }
    });

    it('Verify on click on the time picker button', () => {
        const activeButtons = elementArray(activeTimePickerButton);
        for (let i = 1; i < activeButtons.length; i++) {
            sendKeys(['Escape']);
            scrollIntoView(activeTimePickerButton, i);
            click(activeTimePickerButton, i);
            waitForElDisplayed(timerExpanded);
        }
    });

    it('Verify input field have placeholder', () => {
        const inputs = elementArray(activeTimePickerInput);
        for (let i = 0; i < inputs.length; i++) {
            expect(['', null]).not.toContain(getAttributeByName(activeTimePickerInput, 'placeholder', i));
        }
    });

    it('Verify on click on the input field ', () => {
        const activeInputs = elementArray(activeTimePickerInput);
        for (let i = 0; i < activeInputs.length; i++) {
            sendKeys(['Escape']);
            scrollIntoView(activeTimePickerInput, i);
            setValue(activeTimePickerInput, text, i);
            expect(getValue(activeTimePickerInput, i)).toBe(text);
            expect(doesItExist(timerExpanded)).toBe(false);
        }
    });

    it('Verify user is able to set time', () => {
        const activeButtonsLength = getElementArrayLength(activeTimePickerButton);
        for (let i = 0; i < activeButtonsLength; i++) {
            scrollIntoView(activeTimePickerButton, i);
            click(activeTimePickerButton, i);
            selectHoursAndMinutes(11);
            sendKeys(['Escape']);
            expect(getValue(activeTimePickerInput, i)).toBe(time);
        }
    });

    it('Verify null validity time picker', () => {
        scrollIntoView(activeTimePickerButton, 4);
        expect(doesItExist(errorBorder)).toBe(false);
        click(setToNullButton);
        expect(doesItExist(errorBorder)).toBe(true);
        click(setValidTimeButton);
        expect(doesItExist(errorBorder)).toBe(false);
        expect(getValue(activeTimePickerInput, 4)).toBe(defaultValidTime);
    });

    it('Verify LTR / RTL switcher', () => {
        timePickerPage.checkRtlSwitch();
    })

    function selectHoursAndMinutes(hour: number = 1, minute: number = 1): void {
        while (getText(selectedHours) !== hour.toString()) {
            click(navigationDownArrowButton);
        }
        click(timeItem, 1);
        while (getText(selectedMinutes) !== minute.toString()) {
            click(navigationDownArrowButton);
        }
        click(timeItem, 2);
        click(period);
    }
});

