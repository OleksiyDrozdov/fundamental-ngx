import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { DynamicSideContentSideComponent } from './dynamic-side-content-side.component';
import { DYNAMIC_SIDE_CONTENT_CLASS_NAME } from './constants';

describe('DynamicSideContentSideComponent', () => {
    let fixture: ComponentFixture<DynamicSideContentSideComponent>;
    let component: DynamicSideContentSideComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [DynamicSideContentSideComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicSideContentSideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture).toBeTruthy();
    });

    it('should add className to host', () => {
        expect(fixture.debugElement.classes[DYNAMIC_SIDE_CONTENT_CLASS_NAME.side]).toBeTrue();
    });
});
