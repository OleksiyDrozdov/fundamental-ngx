import {
    click, getAttributeByNameArr,
    getElementArrayLength,
    getText,
    refreshPage,
    scrollIntoView,
    setValue,
    waitForElDisplayed,
    sendKeys, getAttributeByName, browserIsIEorSafari
} from '../../driver/wdio';
import {placeholderValue} from '../fixtures/appData/file-uploader.page-content';
import { MultiInputPo } from '../pages/multi-input.po';

describe('Combobox test suite', function() {
    const multiInputPage: MultiInputPo = new MultiInputPo();

    beforeAll(() => {
        multiInputPage.open();
    });

    afterEach(() => {
        refreshPage();
    });

    it('Verify multi input allows user to enter multiple values', () => {
        if (!browserIsIEorSafari()) {
            const activeButtonsQuantity = getElementArrayLength(multiInputPage.activeDropDownButtons);
            for (let i = 0; i < activeButtonsQuantity; i++) {
                if (i !== activeButtonsQuantity - 2) {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    multiInputPage.selectOption(optionsArr[1]);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[1]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[0]).toBe(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[1]).toBe(optionsArr[1]);
                } else {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    multiInputPage.selectOption(optionsArr[1]);
                    click(multiInputPage.approveButton);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[1]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[0]).toBe(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[1]).toBe(optionsArr[1]);
                }
            }
        }
    });

    it('Check RTL/LTR orientation', () => {
        multiInputPage.checkRtlSwitch();
    });

    it('Verify group headers are not interactive', () => {
        const headersQuantity = getElementArrayLength(multiInputPage.groupHeader);
        multiInputPage.expandDropdown(multiInputPage.groupDropdown);
        for (let i = 0; i < headersQuantity; i++) {
            scrollIntoView(multiInputPage.groupHeader, i);
            click(multiInputPage.groupHeader, i);
            waitForElDisplayed(multiInputPage.expandedDropdown);
        }
    });

    it('Verify A token can be added using suggestions or value help.', () => {
        const inputQuantity = getElementArrayLength(multiInputPage.activeInputs);
        for (let i = 0; i < inputQuantity - 2; i++) {
            multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
            const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
            setValue(multiInputPage.activeInputs, optionsArr[0].substring(0, 2), i);
            multiInputPage.selectOption(optionsArr[0]);
            expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
        }
    });

    it('Verify The user can deselect an item by clicking its delete icon[X].', () => {
        if (!browserIsIEorSafari()) {
            const activeButtonsQuantity = getElementArrayLength(multiInputPage.activeDropDownButtons);
            for (let i = 0; i < activeButtonsQuantity; i++) {
                if (i !== activeButtonsQuantity - 2) {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    scrollIntoView(multiInputPage.crossButton(optionsArr[0]));
                    click(multiInputPage.crossButton(optionsArr[0]));
                    expect(multiInputPage.crossButton(optionsArr[0])).not.toBeDisplayed();
                } else {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    click(multiInputPage.approveButton);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    scrollIntoView(multiInputPage.crossButton(optionsArr[0]));
                    click(multiInputPage.crossButton(optionsArr[0]));
                    expect(multiInputPage.crossButton(optionsArr[0])).not.toBeDisplayed();
                }
            }
        }
    });

    it('Verify When the user starts typing in the input field, the list is filtered', () => {
        if (!browserIsIEorSafari()) {
            const activeButtonsQuantity = getElementArrayLength(multiInputPage.activeDropDownButtons);
            console.log(activeButtonsQuantity);
            multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, 1);
            const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
            click(multiInputPage.activeDropDownButtons, 1);
            setValue(multiInputPage.activeInputs, optionsArr[1].substring(0, 3), 1);
            let filteredOptions = getElementArrayLength(multiInputPage.dropdownOption);
            for (let j = 0; j < filteredOptions; j++) {
                const dropdownOption = getText(multiInputPage.dropdownOptionTextValueHelp, j);
                expect(dropdownOption).toContain(optionsArr[1].substring(0, 3));
            }
            scrollIntoView(multiInputPage.activeInputs, 0);
            multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, 0);
            setValue(multiInputPage.activeInputs, optionsArr[0].substring(0, 3), 0);
            filteredOptions = getElementArrayLength(multiInputPage.dropdownOption);
            for (let j = 0; j < filteredOptions; j++) {
                const dropdownOption = getText(multiInputPage.dropdownOptionText, j);
                expect(dropdownOption).toContain(optionsArr[0].substring(0, 3));
            }
            multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, 4);
            setValue(multiInputPage.mobileInput, optionsArr[4].substring(0, 3));
            filteredOptions = getElementArrayLength(multiInputPage.dropdownOption);
            for (let j = 0; j < filteredOptions; j++) {
                const dropdownOption = getText(multiInputPage.dropdownOptionTextValueHelp, j);
                expect(dropdownOption).toContain(optionsArr[4].substring(0, 3));
            }
        }
    });

    it('Verify user can delete the token using backspace and delete key', () => {
        if (!browserIsIEorSafari()) {
            const activeButtonsQuantity = getElementArrayLength(multiInputPage.activeDropDownButtons);
            for (let i = 0; i < activeButtonsQuantity; i++) {
                if (i !== activeButtonsQuantity - 2) {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[0]).toBe(optionsArr[0]);
                    click(multiInputPage.selectedToken);
                    sendKeys(['Backspace']);
                    sendKeys(['Backspace']);
                    expect(multiInputPage.selectedToken).not.toBeDisplayed();
                } else {
                    multiInputPage.expandDropdown(multiInputPage.activeDropDownButtons, i);
                    const optionsArr = getAttributeByNameArr(multiInputPage.options, 'ng-reflect-title');
                    multiInputPage.selectOption(optionsArr[0]);
                    click(multiInputPage.approveButton);
                    expect(getText(multiInputPage.filledInput, i)).toContain(optionsArr[0]);
                    expect(getText(multiInputPage.filledInput, i).split('\n')[0]).toBe(optionsArr[0]);
                    click(multiInputPage.selectedToken);
                    sendKeys(['Backspace']);
                    sendKeys(['Backspace']);
                    expect(multiInputPage.selectedToken).not.toBeDisplayed();
                }
            }
        }
    });

    it('Verify inputs should have placeholder', () => {
        const activeInputsQuantity = getElementArrayLength(multiInputPage.activeInputs);
        for (let i = 0; i < activeInputsQuantity; i++) {
            expect(placeholderValue).toContain(getAttributeByName
            (multiInputPage.activeInputs, 'placeholder', i));
        }
    });
})
;
