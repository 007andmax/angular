import {
    Directive,
    ElementRef,
    Renderer,
    Input
} from '@angular/core';
@Directive({
    selector: '[sales-item-value]',
})
export class SalesItemValueDirective {

    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener(
            'click',
            (event) => {

                if (event.target.value === "0") {
                    event.target.value = "";
                }
                event.target.onkeyup = (e: any) => {
                    if (event.target.classList.contains('grp')) {

                        if (!Number(e.target.value)) {

                            e.target.value = "";
                        }
                    }
                    else {
                        if (!e.target.value) {
                            e.target.value = "";
                        }
                    }

                }
                event.target.onblur = (e: any) => {
                    if (e.target.value === "") {
                        e.target.value = 0;
                    }
                    if (!Number(e.target.value)) {

                        e.target.value = 0;
                    }
                    e.target.value = (e.target.value < 0) ? 0 : e.target.value;


                }

            }, false);
    }
}