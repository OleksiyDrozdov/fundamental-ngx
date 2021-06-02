import { TimePo } from '../pages/time.po';
import { click, 
    getElementArrayLength,
    refreshPage, 
    getText, 
    doesItExist } from '../../driver/wdio';

describe('Time tests', function() {
    const timePage = new TimePo();
    const { btnUpArrow,
        btnDownArrow,
        time24Hours, 
        time24HoursCol,
        time24HoursNumbers,
        time12Hours, 
        time12HoursCol,
        time12HoursNumbers,
        timeNoSpinners, 
        timeNoSpinnersCol, 
        timeNoSpennersNumbers,
        timeProgExampleBtn,
        timeProgExampleNumbers,
        timeDigitsExample,
        timeDigitsExampleNumbers } = timePage;

    beforeAll(() => {
        timePage.open();                              
    }, 1);

    describe('24-Hour Clock', function() {
        it('should verify possibility to change time by pressing arrow up', () => {
            checkTimeAfterClick(time24HoursCol, time24HoursNumbers, btnUpArrow);
        });
        
        it('should verify possibility to change time by pressing arrow down', () => {
            checkTimeAfterClick(time24HoursCol, time24HoursNumbers, btnDownArrow);
        });
        
        it('should check values in hours, minutes, seconds columns', () => {
            const lengthOfTimeCollumn = getElementArrayLength(time24HoursCol);
            for(let i = 0; i<lengthOfTimeCollumn; i++){
                if(i === 0){
                    checkTimeCollunmLength(time24HoursCol, time24HoursNumbers, 24, i);
                } else {
                    checkTimeCollunmLength(time24HoursCol, time24HoursNumbers, 60, i);
                }    
            }
        });

        it('should check Selected Time', () => {
            const lengthOfTimeCollumn = getElementArrayLength(time24HoursCol);
            for(let i = 0; i<lengthOfTimeCollumn; i++){
                click(time24HoursCol, i);
                if(i === 0){
                    checkTime(time24Hours, time24HoursNumbers, 8, 6);
                } else if(i === 1) {
                    checkTime(time24Hours, time24HoursNumbers, 5, 3);
                } else {
                    checkTime(time24Hours, time24HoursNumbers, 2, 0);
                }
            }
        });
    });

    describe('12-Hour Clock', function() {
        it('should check columns presence', () => {
            const collumnsLength = getElementArrayLength(time12HoursCol);
            expect(collumnsLength).toBe(4, 'Incorrect number of columns');
        });

        it('should check possibility to change time from PM to AM', () => {
            let currentNum = getSelectedTime(time12HoursNumbers);
            let timeHours = getTextFromTime(time12Hours, 9, 7);
            expect(parseInt(currentNum, 10)).toBe(parseInt(timeHours, 10), 'Selected time is not correct');
            click(time12HoursCol, 3);
            click(time12Hours+btnDownArrow);
            timeHours = getTextFromTime(time12Hours, 9, 7);
            currentNum = currentNum === '12' ? currentNum = 0: parseInt(currentNum, 10) + 12;
            expect(currentNum).toBe(parseInt(timeHours, 10), 'Selected time is not correct');
        });
    });

    describe('No Spinner', function() { 
        it('should verify that there is no spinners', () => {
            const lengthOfTimeCollumn = getElementArrayLength(timeNoSpinnersCol);
            for(let i = 0; i<lengthOfTimeCollumn; i++){
                expect(doesItExist(timeNoSpinners+btnDownArrow)).toBe(false, 'spinner should not exist');
                expect(doesItExist(timeNoSpinners+btnUpArrow)).toBe(false, 'spinner should not exist');
            }    
        });

        it('should check selected time when clicking on not selected value in time picker', () => {
            const beforeClickNum = getSelectedTime(timeNoSpennersNumbers);
            click(timeNoSpennersNumbers, parseInt(beforeClickNum, 10));
            const afterClickNum = getSelectedTime(timeNoSpennersNumbers);
            expect(beforeClickNum).not.toBe(afterClickNum, 'incorrect time displayed');
        });
    });

    describe('Programmatically Changed Time', function() { 
        it('should verify that time set to 11 when user presses "Set hours to 11"', () => {
            const setHoursBtnTxt = getTextFromTime(timeProgExampleBtn, 2);
            let txtFromCollumn = getSelectedTime(timeProgExampleNumbers);
            expect(setHoursBtnTxt).not.toBe(txtFromCollumn, 'time set to 11');
            click(timeProgExampleBtn);
            txtFromCollumn = getSelectedTime(timeProgExampleNumbers);
            expect(setHoursBtnTxt).toBe(txtFromCollumn, 'time shoul be set to 11');
        });
    });

    describe('Time With Two Digits', function() { 
        it('should verify that time has 2 digits when selected value less then 10', () => {
            const lengthCollumn = getElementArrayLength(timeDigitsExampleNumbers);
            for(let i = 0; i<lengthCollumn; i++){
                click(timeDigitsExample+btnUpArrow);
                const txtLength = getSelectedTime(timeDigitsExampleNumbers).length;
                expect(txtLength).toBe(2, `${timeDigitsExampleNumbers} with index ${i} should have 2 digits`);
            }
        });
    });

    it('should check visual regression for all examples', () => {
        refreshPage();
        timePage.saveExampleBaselineScreenshot();
        expect(timePage.compareWithBaseline()).toBeLessThan(5);
    }); 

    it('should check RTL and LTR orientation', () => {
        timePage.checkRtlSwitch();
    });

    function getSelectedTime(selector: string): any{
        const length = getElementArrayLength(selector);
        const selectedItem = getText(selector, length/2-1);
        return selectedItem;
    }

    function getTextFromTime(selector: string, startIndex: number, endIndex: number = 0): string{
        const timeTxtLength = getText(selector);
        return timeTxtLength.substring(timeTxtLength.length-startIndex, timeTxtLength.length-endIndex);
    }

    function checkTimeAfterClick(selectorCol: string, selectorNum: string, selectorBtn: string, index: number = 0): void{
        const lengthOfTimeCollumn = getElementArrayLength(selectorCol);
        for(let i = 0; i<lengthOfTimeCollumn; i++){
            click(selectorCol, i);
            const beforeClickNum = getSelectedTime(selectorNum);
            click(selectorBtn, index);
            const afterClickNum = getSelectedTime(selectorNum);
            expect(beforeClickNum).not.toBe(afterClickNum,`${selectorNum} in collumn ${selectorCol} value was not changed`);
        }
    }

    function checkTimeCollunmLength(selectorCol: string, selectorNum: string, timeNum: number, index: number = 0): void{
        click(selectorCol, index);
        const lengthOfNum = getElementArrayLength(selectorNum);
        expect(lengthOfNum).toBe(timeNum, `Collumn ${selectorCol} with index ${index} does not have correct length`); 
    }

    function checkTime(selectorSection: string, selectorNum: string, startIndex: number, endIndex: number): void{
        const currentNum = getSelectedTime(selectorNum);
        const timeNum = getTextFromTime(selectorSection, startIndex, endIndex);
        expect(parseInt(timeNum, 10)).toBe(parseInt(currentNum, 10), `${selectorSection} time ${timeNum} is not correct`);
    }
});
