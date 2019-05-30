import { Directive, ElementRef, Renderer, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[edit-mode-item]',
})
export class EditModeItemDirective {
    @Output() sendMsgEvent: EventEmitter<string> = new EventEmitter();
    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener(
            'click',
            (event) => {

                this.OutMessage({
                    action: event.target.getAttribute('action'), i: event.target.getAttribute('categories-id'),
                    u: event.target.getAttribute('products-id'), g: event.target.getAttribute('subproducts-id')
                });
            },
            false,
        );
    }
    OutMessage(data: any) {
        this.sendMsgEvent.emit(data);
    }
}
