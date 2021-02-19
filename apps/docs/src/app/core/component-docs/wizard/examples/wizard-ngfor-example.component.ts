import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { WizardComponent, WizardStepStatus } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-wizard-ngfor-example',
    templateUrl: './wizard-ngfor-example.component.html',
    styleUrls: ['./wizard-example.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'fd-wizard-example'
    }
})
export class WizardNgForExampleComponent {

    @ViewChild('wizard')
    wizardComponent: WizardComponent;

    /**
     * documentation related property
     * provides access to the HTML element with "overlay" reference
     */
    @ViewChild('overlay')
    overlay: ElementRef<HTMLElement>;

    /**
     * documentation related property
     * specifies if the doc example is rendered in fullscreen or not
     */
    fullscreen = false;

    name = '';

    steps = [
        {
            status: 'current',
            label: 'Product Type',
            glyph: 'product',
            messageStrip:
                'The Wizard control is supposed to break down large tasks, into smaller steps, easier for the user to work with.',
            contentText:
                'Sed fermentum, mi et tristique ullamcorper, sapien sapien faucibus sem, quis pretium nibh lorem'
        },
        {
            status: 'upcoming',
            label: 'Customer Information',
            glyph: 'user-edit',
            messageStrip:
                'This is the second step of this particular wizard example.',
            contentText:
                'Cras tellus leo, volutpat vitae ullamcorper eu, posuere malesuada nisl.'
        },
        {
            status: 'upcoming',
            label: 'Additional Information',
            glyph: 'paid-leave',
            messageStrip:
                'This wizard uses ngFor to iterate over an array to build steps',
            contentText:
                'Integer pellentesque leo sit amet dui vehicula, quis ullamcorper est pulvinar.'
        }
    ];

    /**
     * documentation related function
     * opens the example in full screen
     */
    enterFullscreenExample(): void {
        this.wizardComponent.goToStep(1);
        this.fullscreen = true;
        this.overlay.nativeElement.style.width = '100%';
    }

    /**
     * documentation related function
     * exits the full screen mode of the example
     */
    exitFullscreenExample(event: Event): void {
        event.stopPropagation();
        this.fullscreen = false;
        this.overlay.nativeElement.style.width = '0%';
    }
}
