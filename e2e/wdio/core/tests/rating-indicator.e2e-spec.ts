import { RatingIndicatorPo } from '../pages/rating-indicator.po';
import { click, 
    mouseHoverElement, 
    isElementClickable, 
    doesItExist,
    getElementArrayLength,
    refreshPage,
    getText,
    scrollIntoView,
    setValue } from '../../driver/wdio';

describe('Rating-indicator tests', function() {
    const ratingIndicatorPage = new RatingIndicatorPo();
    const { starsRatingExamples, 
        starsRatingWithSize,
        textRate,
        starsRatingWithHalves,
        sizeRatingIndicator,
        starsRatingDisplayMode,
        starsRatingDynamicChanges,
        containerDynamicChanges,
        inputsDynamicChanges } = ratingIndicatorPage;

    beforeAll(() => {
        ratingIndicatorPage.open();                              
    }, 1);

    describe('test rating indicator: examples, with all sizes and allowHalves, with predefined ratings object', function() {
        it('should verify that amount of stars is 5', () => {
            const lengthOfStars = getElementArrayLength(starsRatingExamples) - 1;
            expect(lengthOfStars).toBe(5,'amount of stars is not correct');
        });

        it('should verify that it is posible to change number of stars using Arrow key right and left', () => {
            const lengthOfStars = getElementArrayLength(starsRatingWithSize);
            for(let i = 1; i<lengthOfStars; i++){
                setValue(starsRatingWithSize, 'ArrowRight', i);
                const text = getText(textRate, 0);
                expect(text[text.length-1]).toBe(`${i}`, `${starsRatingWithSize} the numbers of stars do not match with rate when you press Arrow key`);
            }
            for(let i = lengthOfStars-1; i>0; i--){
                setValue(starsRatingWithSize, 'ArrowLeft', i);
                const text = getText(textRate, 0);
                expect(text[text.length-1]).toBe(`${i}`, `${starsRatingWithSize} the number of stars do not match with rate when you press Arrow key`);
            }
        });

        it('should verify that rate changed after clicking to stars', () => {
            const lengthOfStars = getElementArrayLength(starsRatingWithSize);
            for(let i = 1; i<lengthOfStars; i++){
                click(starsRatingWithSize, i);
                const text = getText(textRate, 0);
                expect(text[text.length-1]).toBe(`${i}`, `${starsRatingWithSize} the number of stars do not match with rate`);
            }
        });

        it('should verify that it is allowed to select half of star', () => {
            const lengthOfStars = getElementArrayLength(starsRatingWithHalves);
            let num = 0;
            for(let i = 1; i<lengthOfStars; i++){
                if(i % 2){
                    click(starsRatingWithHalves, i);   
                    const text = getText(textRate, 1);
                    expect(text.substring(text.length-3)).toBe(`${num}.5`, `${starsRatingWithHalves+i} the number of stars do not match with rate`);
                    num++;
                }
            }
        });

        it('should verify that popover is shown after hover over the mouse', () => {
            const length = getElementArrayLength(sizeRatingIndicator);
            for(let i = 0; i<length; i++){
                scrollIntoView(sizeRatingIndicator, i);
                mouseHoverElement(sizeRatingIndicator, i);
                expect(doesItExist(starsRatingDisplayMode)).toBe(true, `Size rating ${i} does not have popover`);
                refreshPage();
            }
        });

        it('should verify that star is disabled', () => {
            const lengthOfStars = getElementArrayLength(starsRatingDisplayMode);
            for(let i = 1; i<lengthOfStars; i++){
                expect(isElementClickable(starsRatingDisplayMode, i)).toBe(false, `${starsRatingDisplayMode} sould not be clickable`);
            }
        });
    });

    describe('test dynamic changes', function() {
        it('should verify that amount of stars changed', () => {
            let numOfSize = 7;
            setValue(inputsDynamicChanges, numOfSize+"");
            let lengthOfStars = getElementArrayLength(starsRatingDynamicChanges)-1;
            expect(lengthOfStars).toBe(numOfSize, 'stars amount was not changed');
        });

        it('should verify that it is allowed to select half of star', () => {
            const lengthOfStarsBeforChanges = getElementArrayLength(starsRatingDynamicChanges)-1;
            click(inputsDynamicChanges);
            const lengthOfStarsAfterChanges = getElementArrayLength(starsRatingDynamicChanges)-1;
            expect(lengthOfStarsBeforChanges*2).toBe(lengthOfStarsAfterChanges, 'it is not allowed to select half of star');
        });

        it('should verify that star is disabled', () => {
            click(inputsDynamicChanges);
            expect(isElementClickable(starsRatingDynamicChanges)).toBe(false, `${starsRatingDynamicChanges} sould not be clickable`);
        });

        it('should verify that stars are in display mode', () => {
            click(inputsDynamicChanges);
            expect(getElementArrayLength(containerDynamicChanges)).toBe(2, `${starsRatingDisplayMode} stars are not in display mode`);
        });
    });

    it('should check visual regression for all examples', () => {
        refreshPage();
        ratingIndicatorPage.saveExampleBaselineScreenshot();
        expect(ratingIndicatorPage.compareWithBaseline()).toBeLessThan(5);
    }); 

    it('should check RTL and LTR orientation', () => {
        ratingIndicatorPage.checkRtlSwitch();
    });
});
