import { TextPo } from '../pages/text.po';
import { checkElementScreenshot, click, getElementArrayLength, getText, pause } from '../../driver/wdio';

describe('Text component test', function() {
    const textPage = new TextPo();
    const { linksExpandable, textExpandableExample } = textPage;
    
    beforeAll(() => {
        textPage.open();
    }, 1);

    it('should check RTL and LTR orientation', () => {
        textPage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        textPage.saveExampleBaselineScreenshot();
        expect(textPage.compareWithBaseline()).toBeLessThan(1);
    });

    describe('verify links' , function() {
        it('should be clickable and display MORE/LESS text', () => {
            click(linksExpandable);
            expect(getText(linksExpandable)).toContain('LESS');
            click(linksExpandable);
            expect(getText(linksExpandable)).toContain('MORE');
        });

        it('should display more text when you click "MORE" link', () => {
            const lengthLinks = getElementArrayLength(linksExpandable);
            for(let i = 0; i<lengthLinks; i++){ 
                click(linksExpandable, i);
                expect(checkElementScreenshot(textExpandableExample, 'textExpandableExample' + i, textPage.getScreenshotFolder())).toBeLessThan(1);
            }
        });    
    });
});