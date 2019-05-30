/**
 * Created by Макс on 27.10.2017.
 */
import {
    Directive,
    ElementRef,
    Renderer,
    EventEmitter,
    Output, Input
} from '@angular/core';

@Directive({
    selector: '[graphic]',
})
export class GraphicDirective {

    @Output() sendMsgEvent: EventEmitter<any> = new EventEmitter();
    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {


        this.element.nativeElement.addEventListener(
            'mouseenter',
            (event) => {
                if (event.target.classList.contains('m--active')) return;

                this.OutMessage({
                    data: event.target.getAttribute('data'),
                    hover: true,
                });
            },
            false
        );

        this.element.nativeElement.addEventListener(
            'mouseleave',
            (event) => {
                // highlight the mouseenter target
                if (event.target.classList.contains('m--active')) return;

                this.OutMessage({
                    data: event.target.getAttribute('data'),
                    hover: false,
                });
            },
            false
        );
    }
    OutMessage(data: any) {
        this.sendMsgEvent.emit(data);
    }

}
