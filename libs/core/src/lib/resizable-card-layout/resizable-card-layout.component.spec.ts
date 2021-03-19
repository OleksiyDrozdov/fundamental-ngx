import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { CardModule } from '../card/card.module';
import { ListModule } from '../list/list.module';
import { IconModule } from '../icon/icon.module';
import { ResizableCardLayoutComponent } from './resizable-card-layout.component';
import { ResizableCardItemComponent } from './resizable-card-item/resizable-card-item.component';

@Component({
    template: `
        <fd-resizable-card-layout [layoutSize]="layoutSize">
            <fd-resizable-card-item
                title="card1"
                [rank]="1"
                [cardWidth]="320"
                [cardHeight]="400"
                [miniHeaderHeight]="80"
                [miniContentHeight]="150"
            >
                <fd-card>
                    <fd-card-header>
                        <h2 fd-card-title>Card Title 1</h2>
                    </fd-card-header>
                    <fd-card-content>
                        <ul fd-list [noBorder]="true">
                            <li fd-list-item>
                                <span fd-list-title> item 1 </span>
                            </li>
                        </ul>
                    </fd-card-content>
                </fd-card>
            </fd-resizable-card-item>

            <fd-resizable-card-item
                title="card2"
                [rank]="2"
                [cardWidth]="320"
                [cardHeight]="300"
                [miniHeaderHeight]="80"
                [miniContentHeight]="100"
            >
                <fd-card>
                    <fd-card-header>
                        <h2 fd-card-title>Card Title 2</h2>
                    </fd-card-header>
                    <fd-card-content>
                        <ul fd-list [noBorder]="true">
                            <li fd-list-item>
                                <span fd-list-title> item 1 </span>
                            </li>
                        </ul>
                    </fd-card-content>
                </fd-card>
            </fd-resizable-card-item>

            <fd-resizable-card-item
                title="card3"
                [rank]="3"
                [cardWidth]="640"
                [cardHeight]="225"
                [miniHeaderHeight]="80"
                [miniContentHeight]="100"
            >
                <fd-card>
                    <fd-card-header>
                        <h2 fd-card-title>Card Title 3</h2>
                    </fd-card-header>
                    <fd-card-content>
                        <ul fd-list [noBorder]="true">
                            <li fd-list-item>
                                <span fd-list-title> item 1 </span>
                            </li>
                        </ul>
                    </fd-card-content>
                </fd-card>
            </fd-resizable-card-item>

            <fd-resizable-card-item
                title="card4"
                [rank]="4"
                [cardWidth]="320"
                [cardHeight]="225"
                [miniHeaderHeight]="80"
                [miniContentHeight]="100"
            >
                <fd-card>
                    <fd-card-header>
                        <h2 fd-card-title>Card Title 4</h2>
                    </fd-card-header>
                    <fd-card-content>
                        <ul fd-list [noBorder]="true">
                            <li fd-list-item>
                                <span fd-list-title> item 1 </span>
                            </li>
                        </ul>
                    </fd-card-content>
                </fd-card>
            </fd-resizable-card-item>
        </fd-resizable-card-layout>
    `
})
class TestResizableCardLayout {
    layoutSize = 'lg';

    @ViewChildren(ResizableCardItemComponent)
    cards: QueryList<ResizableCardItemComponent>;
}

describe('ResizableCardLayoutComponent', () => {
    let component: TestResizableCardLayout;
    let fixture: ComponentFixture<TestResizableCardLayout>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResizableCardLayoutComponent, ResizableCardItemComponent, TestResizableCardLayout],
                imports: [CommonModule, CardModule, ListModule, IconModule]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TestResizableCardLayout);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be placed in layout', () => {
        const cards = component.cards.toArray();

        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(328);
        expect(cards[1].top).toEqual(0);

        expect(cards[2].left).toEqual(328);
        expect(cards[2].top).toEqual(300);

        expect(cards[3].left).toEqual(8);
        expect(cards[3].top).toEqual(400);
    });

    it('should layout cards again on changing width of any card 1', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[0];

        // increasing width
        card.onMouseDown(mouseEvent1, 'horizontal');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 200, clientY: 20 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(640);
        expect(card.cardHeight).toEqual(400);

        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(648);
        expect(cards[1].top).toEqual(0);

        expect(cards[2].left).toEqual(8);
        expect(cards[2].top).toEqual(400);

        expect(cards[3].left).toEqual(648);
        expect(cards[3].top).toEqual(300);
    });

    it('should layout cards again on changing width of any card 2', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[1];

        // increase width
        card.onMouseDown(mouseEvent1, 'horizontal');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 440, clientY: 20 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(960);
        expect(card.cardHeight).toEqual(300);

        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(8);
        expect(cards[1].top).toEqual(400);

        expect(cards[2].left).toEqual(8);
        expect(cards[2].top).toEqual(700);

        expect(cards[3].left).toEqual(648);
        expect(cards[3].top).toEqual(700);

        // decrease width

        const mouseEvent3 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card2 = component.cards.toArray()[1];

        // decrease width
        card2.onMouseDown(mouseEvent3, 'horizontal');
        const mouseEvent4 = new MouseEvent('changeWidth', { clientX: 80, clientY: 20 });
        card2.onMouseMove(mouseEvent4);
        card2.onMouseUp(mouseEvent4);

        fixture.detectChanges();
        expect(card.cardWidth).toEqual(640);
        expect(card.cardHeight).toEqual(300);

        // layout should also change
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(328);
        expect(cards[1].top).toEqual(0);

        expect(cards[2].left).toEqual(328);
        expect(cards[2].top).toEqual(300);

        expect(cards[3].left).toEqual(8);
        expect(cards[3].top).toEqual(400);

    });

    it('should layout cards again on changing height of any card', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[1];

        card.onMouseDown(mouseEvent1, 'vertical');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 100, clientY: 90 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(320);
        expect(card.cardHeight).toEqual(384);

        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(328);
        expect(cards[1].top).toEqual(0);

        expect(cards[2].left).toEqual(328);
        expect(cards[2].top).toEqual(384);

        expect(cards[3].left).toEqual(8);
        expect(cards[3].top).toEqual(400);
    });

    it('should layout cards again on changing width and height of any card', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[1];

        card.onMouseDown(mouseEvent1, 'both');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 440, clientY: 90 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(960);
        expect(card.cardHeight).toEqual(384);

        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(8);
        expect(cards[1].top).toEqual(400);

        expect(cards[2].left).toEqual(8);
        expect(cards[2].top).toEqual(784);

        expect(cards[3].left).toEqual(648);
        expect(cards[3].top).toEqual(784);
    });

    it('should not increase width of card more than the layout width capacity', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[1];

        card.onMouseDown(mouseEvent1, 'both');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 440, clientY: 90 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(960);
        expect(card.cardHeight).toEqual(384);

        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(8);
        expect(cards[1].top).toEqual(400);

        expect(cards[2].left).toEqual(8);
        expect(cards[2].top).toEqual(784);

        expect(cards[3].left).toEqual(648);
        expect(cards[3].top).toEqual(784);


        // increase width of card 2 again
        const mouseEvent3 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card2 = component.cards.toArray()[1];

        card2.onMouseDown(mouseEvent3, 'both');
        const mouseEvent4 = new MouseEvent('changeWidth', { clientX: 440, clientY: 30 });
        card2.onMouseMove(mouseEvent4);
        card2.onMouseUp(mouseEvent4);

        fixture.detectChanges();

        // only increment in height. width did not increase
        expect(card.cardWidth).toEqual(960);
        expect(card.cardHeight).toEqual(400);
    });

    it('should not decrease width of card less than 320px', () => {
        const mouseEvent1 = new MouseEvent('changeWidth', { clientX: 100, clientY: 20 });
        const card = component.cards.toArray()[0];

        const cards1 = component.cards.toArray();
        expect(cards1[0].left).toEqual(8);
        expect(cards1[0].top).toEqual(0);

        expect(cards1[1].left).toEqual(328);
        expect(cards1[1].top).toEqual(0);

        expect(cards1[2].left).toEqual(328);
        expect(cards1[2].top).toEqual(300);

        expect(cards1[3].left).toEqual(8);
        expect(cards1[3].top).toEqual(400);

        // decreasing width
        card.onMouseDown(mouseEvent1, 'horizontal');
        const mouseEvent2 = new MouseEvent('changeWidth', { clientX: 8, clientY: 20 });
        card.onMouseMove(mouseEvent2);
        card.onMouseUp(mouseEvent2);

        fixture.detectChanges();

        expect(card.cardWidth).toEqual(320);
        expect(card.cardHeight).toEqual(400);

        // verify no change in layout
        const cards = component.cards.toArray();
        expect(cards[0].left).toEqual(8);
        expect(cards[0].top).toEqual(0);

        expect(cards[1].left).toEqual(328);
        expect(cards[1].top).toEqual(0);

        expect(cards[2].left).toEqual(328);
        expect(cards[2].top).toEqual(300);

        expect(cards[3].left).toEqual(8);
        expect(cards[3].top).toEqual(400);
    });
});
