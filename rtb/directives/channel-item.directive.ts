import {
    Directive,
    ElementRef,
    Renderer,
    Output,
    EventEmitter,
    Input,
} from '@angular/core';
@Directive({
    selector: '[channel-item]',
})
export class ChannelItemDirective {
    @Output() sendMsgEvent: EventEmitter<Number> = new EventEmitter();

    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener(
            'click',
            (event) => {
                if (event.target.getAttribute('data') === null) {
                    this.setChannel(event.target.parentNode.getAttribute('data'));
                }
                else {
                    this.setChannel(event.target.getAttribute('data'));
                }

            },
            false
        );
    }
    setChannel(id: number) {
        this.sendMsgEvent.emit(id);
    }
}
