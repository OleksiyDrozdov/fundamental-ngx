import { TokenPo } from '../pages/token.po';
import { click, 
    isElementClickable, 
    getElementArrayLength,
    refreshPage } from '../../driver/wdio';

describe('Token tests', function() {
    const tokenPage = new TokenPo();
    const { defaultTokenButtons, 
        tokenizerButtons, 
        compactTokenizerButtons } = tokenPage;

    beforeAll(() => {
        tokenPage.open();                              
    }, 1);

    describe('verification of Token buttons', function() {
        it('should verify that button disappears after clicking "x" into section "Tokenizer"', () => {
            checkButtonsLength(tokenizerButtons);
        });

        it('should verify that button disappears after clicking "x" into section "Compact Tokenizer"', () => {
            checkButtonsLength(compactTokenizerButtons);
        });

        it('should be clicable', () => {
            const lengthOfBtn = getElementArrayLength(defaultTokenButtons);
            for(let i = 0; i<lengthOfBtn; i++){
                expect(isElementClickable(defaultTokenButtons, i)).toBe(true, `${defaultTokenButtons+i} is not clickable`);
            }
        });
    });

    it('should check visual regression for all examples', () => {
        refreshPage();
        tokenPage.saveExampleBaselineScreenshot();
        expect(tokenPage.compareWithBaseline()).toBeLessThan(5);
    }); 

    it('should check RTL and LTR orientation', () => {
        tokenPage.checkRtlSwitch();
    });

    function checkButtonsLength(selector: string): void {
        const lengthOfBtn = getElementArrayLength(selector);
        click(selector, lengthOfBtn-1);
        const curentLength = getElementArrayLength(selector);
        expect(curentLength).not.toBe(lengthOfBtn, `${selector} not correct size`);    
    }
});
