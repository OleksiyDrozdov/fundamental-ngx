import { FormMessagePo } from '../pages/form-message.po';
import { 
    text, 
    longLine, 
    number, 
    specialCharacters 
} from '../fixtures/testData/input';
import {
    addValue,
    doesItExist,
    getValue,
    refreshPage,
    setValue,
    waitForElDisplayed
} from '../../driver/wdio';

describe('Form-message Test', function() {
    const formMessagePage = new FormMessagePo();
    const { autocompleteInputLabel, arrOfFields } = formMessagePage;
    
    beforeAll(()=>{
        formMessagePage.open();
    },1);

    describe('Check orientation', function() {
        it('should check RTL and LTR orientation', () => {
            formMessagePage.checkRtlSwitch();
        });

    afterEach(() => {
        refreshPage();
    }, 1);

    arrOfFields.forEach(input =>{
        it('have field without label', () => {
            waitForElDisplayed(input.fieldSelector);
            expect(doesItExist(autocompleteInputLabel)).toBe(false);
        });

        it('be able to type something with keyboard', () => {
            waitForElDisplayed(input.fieldSelector);
            setValue(input.fieldSelector, text);
            expect(getValue(input.fieldSelector)).toBe(text);
        });

        it('by default accept all kinds of input values – alphabet, numerical, special characters', () => {
            waitForElDisplayed(input.fieldSelector);
            setValue(input.fieldSelector, text);
            addValue(input.fieldSelector, number);
            addValue(input.fieldSelector, specialCharacters);
            addValue(input.fieldSelector, longLine);
            expect(getValue(input.fieldSelector))
                .toEqual(text + number + specialCharacters + longLine);
        });
    });
    });
});