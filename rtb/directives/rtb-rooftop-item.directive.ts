import {
    Directive,
    ElementRef,
    Renderer,
    Output,
    EventEmitter,
} from '@angular/core';
@Directive({
    selector: '[rtb-rooftop-item]',
})
export class RtbRooftopItemDirective {
    @Output() sendMsgEvent: EventEmitter<Number> = new EventEmitter();

    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {
        let stage = this;
        this.element.nativeElement.addEventListener(
            'click',
            function (event) {
               
                event.preventDefault();
                let rows: any = document.querySelectorAll(".main_table__row");
                for (let u = 0; u < rows.length; u++) {
                    if (rows[u].querySelectorAll(".table_object_container").length !== 0) {

                        rows[u].style.display = 'none';
                    }
                    if (rows[u].querySelectorAll(".table_categories").length !== 0) {
                        if (!rows[u].classList.contains("m--hidden")) {
                            rows[u].classList.add("m--hidden");
                            let table_categories = rows[u].querySelectorAll(".table_categories");
                            for (let i = 0; i < table_categories.length; i++) {
                                table_categories[i].style.display = 'block'
                            }

                        }
                    }
                    if (rows[u].querySelectorAll(".table_object_container").length === 0 && rows[u].querySelectorAll(".table_categories").length === 0) {
                        if (!rows[u].classList.contains("js-table-days")) {
                            rows[u].style.display = 'none';
                        }

                    }
                }
                let table_object_product: any = document.querySelectorAll('.table_object_product');
                for (let s = 0; s < table_object_product.length; s++) {
                    table_object_product[s].style.display = 'none'
                }
                stage.selectRooftop(Number(event.target.getAttribute('index')));

            },
            false
        );
    }

    selectRooftop(index: number) {
        this.sendMsgEvent.emit(index);
    }
}
