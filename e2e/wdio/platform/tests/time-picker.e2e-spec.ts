import {
    checkElementScreenshot,
    click,
    doesItExist,
    getAttributeByName,
    getElementArrayLength, getImageTagBrowserPlatform,
    getText,
    getValue,
    refreshPage, saveElementScreenshot,
    scrollIntoView,
    sendKeys, isEnabled,
    setValue,
    waitForElDisplayed,
    waitForPresent
} from '../../driver/wdio';
import { time, text, defaultValidTime} from '../fixtures/testData/time-picker';
import { TimePickerPO } from '../pages/time-picker.po';
import { checkElementActiveState, checkElementFocusState, checkElementHoverState } from '../../helper/assertion-helper';
import {
    disabledTimePickerActiveState,
    disabledTimePickerExample,
    disabledTimePickerFocusState,
    disabledTimePickerHoverState,
    expandButtonActiveState,
    expandButtonExample,
    expandButtonFocusState,
    expandButtonHoverState,
    inputFieldActiveState,
    inputFieldExample,
    inputFieldFocusState,
    inputFieldHoverState,
    notValidInputFieldExample,
    notValidInputFieldState,
    setToNullButtonActiveState,
    setToNullButtonExample,
    setToNullButtonFocusState,
    setToNullButtonHoverState,
    setValidTimeButtonActiveState,
    setValidTimeButtonExample,
    setValidTimeButtonFocusState,
    setValidTimeButtonHoverState
} from '../fixtures/testData/time-picker-tags';
import {
    disabledPicker,
    expandButton,
    inputField,
    setNullButton,
    setValidButton
} from '../fixtures/appData/time-picker-contents';

describe('Time picker suite', function() {
    const timePickerPage = new TimePickerPO();
    const {
        activeTimePickerInput, timePickerInput, timerExpanded,
        activeTimePickerButton, errorBorder, selectedPeriod,
        selectedHours, selectedMinutes, disabledInput, disabledButton,
        navigationDownArrowButton, timeItem, setToNullButton, setValidTimeButton,
        invalidTimePickerInput, disabledTimePicker
    } = timePickerPage;

    beforeAll(() => {
        timePickerPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(timePickerInput);
    }, 1);

    it('Verify on click on the time picker button', () => {
        const activeButtonsCount = getElementArrayLength(activeTimePickerButton);
        for (let i = 1; i < activeButtonsCount; i++) {
            sendKeys(['Escape']);
            scrollIntoView(activeTimePickerButton, i);
            click(activeTimePickerButton, i);
            waitForElDisplayed(timerExpanded);
            click(activeTimePickerButton, i);
        }
    });

    it('Verify disabled inputs for time pickers', () => {
        const disabledInputsCount = getElementArrayLength(disabledInput);
        for (let i = 1; i < disabledInputsCount; i++) {
            scrollIntoView(disabledInput, i);
            expect(isEnabled(disabledInput, i)).toBe(false);
        }
    });

    it('Verify disabled buttons for time pickers', () => {
        const disabledButtonsCount = getElementArrayLength(disabledButton);
        for (let i = 1; i < disabledButtonsCount; i++) {
            scrollIntoView(disabledButton, i);
            expect(isEnabled(disabledButton, i)).toBe(false);
        }
    });

    it('Verify input field have placeholder', () => {
        const inputsCount = getElementArrayLength(activeTimePickerInput);
        for (let i = 0; i < inputsCount; i++) {
            expect(['', null]).not.toContain(getAttributeByName(activeTimePickerInput, 'placeholder', i));
        }
    });

    it('Verify on click on the input field ', () => {
        const activeInputsCount = getElementArrayLength(activeTimePickerInput);
        for (let i = 0; i < activeInputsCount; i++) {
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
            expect(doesItExist(timerExpanded)).toBe(false);
            expect(getValue(activeTimePickerInput, i)).toBe(time);
        }
    });

    it('Verify null validity for basic time picker ', () => {
        scrollIntoView(activeTimePickerButton, 4);
        expect(doesItExist(errorBorder)).toBe(false);
        click(setToNullButton);
        expect(doesItExist(errorBorder)).toBe(true);
        click(setValidTimeButton);
        expect(doesItExist(errorBorder)).toBe(false);
        expect(getValue(activeTimePickerInput, 4)).toBe(defaultValidTime);
    });

    // skipped due to https://github.com/SAP/fundamental-ngx/issues/4853
    xit('Verify null validity for time picker with reactive form', () => {
        scrollIntoView(activeTimePickerButton, 9);
        expect(doesItExist(errorBorder)).toBe(false);
        click(setToNullButton, 1);
        expect(doesItExist(errorBorder)).toBe(true);
        click(setValidTimeButton, 1);
        expect(doesItExist(errorBorder)).toBe(false);
        expect(getValue(activeTimePickerInput, 9)).toBe(defaultValidTime);
    });

    it('Verify null validity for time picker with template form', () => {
        scrollIntoView(activeTimePickerButton, 14);
        expect(doesItExist(errorBorder)).toBe(false);
        click(setToNullButton, 2);
        expect(doesItExist(errorBorder)).toBe(true);
        click(setValidTimeButton, 2);
        expect(doesItExist(errorBorder)).toBe(false);
        expect(getValue(activeTimePickerInput, 14)).toBe(defaultValidTime);
    });

    it('Verify LTR / RTL switcher', () => {
        timePickerPage.checkRtlSwitch();
    });

    describe('Check visual regression', function() {
        it('should check examples visual regression', () => {
            timePickerPage.saveExampleBaselineScreenshot('time-picker');
            expect(timePickerPage.compareWithBaseline('time-picker')).toBeLessThan(1);
        });

        it('should check examples visual regression', () => {
            scrollIntoView(activeTimePickerButton);
            click(activeTimePickerButton);
            waitForElDisplayed(timerExpanded);
            saveElementScreenshot(timerExpanded, `time-picker-expanded-example-platform-${getImageTagBrowserPlatform()}`, {}, );
            checkElementScreenshot(timerExpanded, `time-picker-expanded-example-platform-${getImageTagBrowserPlatform()}`, {}, )
        });

        it('should check examples visual regression', () => {
            scrollIntoView(activeTimePickerButton);
            click(activeTimePickerButton);
            waitForElDisplayed(timerExpanded);
            saveElementScreenshot(timerExpanded, `time-picker-expanded-example-platform-${getImageTagBrowserPlatform()}`, {}, );
            checkElementScreenshot(timerExpanded, `time-picker-expanded-example-platform-${getImageTagBrowserPlatform()}`, {}, );
        });

        it('should check expand button hover state', () => {
            const expandButtonLength = getElementArrayLength(activeTimePickerButton);
            for (let i = 0; i < expandButtonLength; i++) {
                scrollIntoView(activeTimePickerButton, i);
                checkElementHoverState(activeTimePickerButton, expandButtonExample + expandButtonHoverState + '-' + i, expandButton, i);
            }
        });

        it('should check expand button focus state', () => {
            const expandButtonLength = getElementArrayLength(activeTimePickerButton);
            for (let i = 0; i < expandButtonLength; i++) {
                scrollIntoView(activeTimePickerButton, i);
                checkElementFocusState(activeTimePickerButton, expandButtonExample + expandButtonFocusState + '-' + i, expandButton, i);
                click(activeTimePickerButton, i);
            }
        });

        it('should check expand button active state', () => {
            const expandButtonLength = getElementArrayLength(activeTimePickerButton);
            for (let i = 0; i < expandButtonLength; i++) {
                scrollIntoView(activeTimePickerButton, i);
                checkElementActiveState(activeTimePickerButton, expandButtonExample + expandButtonActiveState + '-' + i, expandButton , i);
            }
        });

        it('should check input field hover state', () => {
            const inputFieldLength = getElementArrayLength(activeTimePickerInput);
            for (let i = 0; i < inputFieldLength; i++) {
                scrollIntoView(activeTimePickerInput, i);
                checkElementHoverState(activeTimePickerInput, inputFieldExample + inputFieldHoverState + '-' + i, inputField, i);
            }
        });

        it('should check input field focus state', () => {
            const inputFieldLength = getElementArrayLength(activeTimePickerInput);
            for (let i = 0; i < inputFieldLength; i++) {
                scrollIntoView(activeTimePickerInput, i);
                checkElementFocusState(activeTimePickerInput, inputFieldExample + inputFieldFocusState + '-' + i, inputField, i);
            }
        });

        it('should check input field active state', () => {
            const inputFieldLength = getElementArrayLength(activeTimePickerInput);
            for (let i = 0; i < inputFieldLength; i++) {
                scrollIntoView(activeTimePickerInput, i);
                checkElementActiveState(activeTimePickerInput, inputFieldExample + inputFieldActiveState + '-' + i, inputField, i);
            }
        });

        it('should check set to null button hover state', () => {
            const setToNullButtonsLength = getElementArrayLength(setToNullButton);
            for (let i = 0; i < setToNullButtonsLength; i++) {
                scrollIntoView(setToNullButton, i);
                checkElementHoverState(setToNullButton, setToNullButtonExample + setToNullButtonHoverState + '-' + i, setNullButton, i);
            }
        });

        it('should check set to null button focus state', () => {
            const setToNullButtonsLength = getElementArrayLength(setToNullButton);
            for (let i = 0; i < setToNullButtonsLength; i++) {
                scrollIntoView(setToNullButton, i);
                checkElementFocusState(setToNullButton, setToNullButtonExample + setToNullButtonFocusState + '-' + i, setNullButton, i);
            }
        });

        it('should check set to null button active state', () => {
            const setToNullButtonsLength = getElementArrayLength(setToNullButton);
            for (let i = 0; i < setToNullButtonsLength; i++) {
                scrollIntoView(setToNullButton, i);
                checkElementActiveState(setToNullButton, setToNullButtonExample + setToNullButtonActiveState + '-' + i, setNullButton, i);
            }
        });

        it('should check set valid button hover state', () => {
            const setValidTimeButtonsLength = getElementArrayLength(setValidTimeButton);
            for (let i = 0; i < setValidTimeButtonsLength; i++) {
                scrollIntoView(setValidTimeButton, i);
                checkElementHoverState(setValidTimeButton, setValidTimeButtonExample + setValidTimeButtonHoverState + '-' + i,
                    setValidButton, i);
            }
        });

        it('should check set valid button focus state', () => {
            const setValidTimeButtonsLength = getElementArrayLength(setValidTimeButton);
            for (let i = 0; i < setValidTimeButtonsLength; i++) {
                scrollIntoView(setValidTimeButton, i);
                checkElementFocusState(setValidTimeButton, setValidTimeButtonExample + setValidTimeButtonFocusState + '-' + i,
                    setValidButton, i);
            }
        });

        it('should check set valid button active state', () => {
            const setValidTimeButtonsLength = getElementArrayLength(setValidTimeButton);
            for (let i = 0; i < setValidTimeButtonsLength; i++) {
                scrollIntoView(setValidTimeButton, i);
                checkElementActiveState(setValidTimeButton, setValidTimeButtonExample + setValidTimeButtonActiveState + '-' + i,
                    setValidButton, i);
            }
        });

        it('should check not valid input field for basic time picker', () => {
            scrollIntoView(setToNullButton);
            click(setToNullButton);
            expect(doesItExist(errorBorder)).toBe(true);
            scrollIntoView(invalidTimePickerInput);
            saveElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-basic-time-picker', {});
            checkElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-basic-time-picker', {});
        });

        //skipped due to https://github.com/SAP/fundamental-ngx/issues/4853
        xit('should check not valid input field for time picker with reactive form', () => {
            scrollIntoView(setToNullButton);
            click(setToNullButton, 1);
            expect(doesItExist(errorBorder)).toBe(true);
            scrollIntoView(invalidTimePickerInput);
            saveElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-with-reactive-form', {});
            checkElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-with-reactive-form', {});
        });

        it('should check not valid input field state for time picker with template form', () => {
            scrollIntoView(setToNullButton);
            click(setToNullButton, 2);
            expect(doesItExist(errorBorder)).toBe(true);
            scrollIntoView(invalidTimePickerInput);
            saveElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-with-template-form', {});
            checkElementScreenshot(invalidTimePickerInput, notValidInputFieldExample + notValidInputFieldState + '-with-template-form', {});
        });

        it('should check disabled time picker hover state', () => {
            const disabledTimePickersLength = getElementArrayLength(disabledTimePicker);
            for (let i = 0; i < disabledTimePickersLength; i++) {
                scrollIntoView(disabledTimePicker, i);
                checkElementHoverState(disabledTimePicker, disabledTimePickerExample + disabledTimePickerHoverState + '-' + i,
                    disabledPicker, i);
            }
        });

        it('should check disabled time picker focus state', () => {
            const disabledTimePickersLength = getElementArrayLength(disabledTimePicker);
            for (let i = 0; i < disabledTimePickersLength; i++) {
                scrollIntoView(disabledTimePicker, i);
                checkElementFocusState(disabledTimePicker, disabledTimePickerExample + disabledTimePickerFocusState + '-' + i,
                    disabledPicker, i);
            }
        });

        it('should check disabled time picker active state', () => {
            const disabledTimePickersLength = getElementArrayLength(disabledTimePicker);
            for (let i = 0; i < disabledTimePickersLength; i++) {
                scrollIntoView(disabledTimePicker, i);
                checkElementActiveState(disabledTimePicker, disabledTimePickerExample + disabledTimePickerActiveState + '-' + i,
                    disabledPicker, i);
            }
        });

    });

    function selectHoursAndMinutes(hour: number = 1, minute: number = 1, day_time: string = ' PM '): void {
        while (getText(selectedHours) !== hour.toString()) {
            click(navigationDownArrowButton);
        }
        click(timeItem, 1);
        while (getText(selectedMinutes) !== minute.toString()) {
            click(navigationDownArrowButton);
        }

        while (getText(selectedMinutes) !== minute.toString()) {
            click(navigationDownArrowButton);
        }
        click(timeItem, 2);
        while ($(selectedPeriod).getText() !== day_time) {
            click(navigationDownArrowButton);
        }}
});

