import {
    Directive,
    ElementRef,
    Renderer,
    Input
} from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { toggleCategory } from 'app/components/class/broadcaster/toggle-category';
@Directive({
    selector: '[table-item]',
})
export class TableItemDirective {
    index: number = 0;
    @Input("enabledClick") enabledClick: boolean = false;
    @Input("parentId") parentId: string;
    @Input("parent") parent: string;
    constructor(private element: ElementRef, private renderer: Renderer, private broadcaster: Broadcaster) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener(
            'mouseenter',
            (event) => {

                if (event.target.classList.contains('js-table-days')) return;

                let list: any = document.body.querySelectorAll(`.main_table__row[data-line="${event.target.getAttribute('data-line')}"]`);
                this.index = 0;
                if (list.length === 2) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i] === event.target) {

                            this.index = i;
                        }
                    }
                }
let data_line:HTMLElement = <HTMLElement>document.body.querySelectorAll(`.js-table-line[data-line='${event.target.getAttribute('data-line')}']`)[this.index];
if (data_line)
{
    (<HTMLElement>data_line
        .querySelectorAll('.menu-line')[0])
        .style.width = '10px';
    (<HTMLElement>data_line.querySelectorAll('.menu-line')[0]).style.zIndex = '10';
}
               
            },
            false
        );

        this.element.nativeElement.addEventListener(
            'mouseleave',
            (event) => {

                if (event.target.classList.contains('js-table-days')) return;
                //   console.log(document.body.querySelectorAll(`.js-table-line[data-line='${event.target.getAttribute('data-line')}']`));
                if (document.body.querySelectorAll(`.js-table-line[data-line='${event.target.getAttribute('data-line')}']`)) {
                    (<HTMLElement>document.body.querySelectorAll(`.js-table-line[data-line='${event.target.getAttribute('data-line')}']`)[this.index]
                        .querySelectorAll('.menu-line')[0])
                        .style.width = '5px';
                    (<HTMLElement>document.body.querySelectorAll(`.js-table-line[data-line='${event.target.getAttribute('data-line')}']`)[this.index]
                        .querySelectorAll('.menu-line')[0])
                        .style.zIndex = '9';
                }


            },
            false
        );
        this.element.nativeElement.addEventListener(
            'click',
            (event) => {

                let hiden: boolean = false;
                let arraId: any;
              
                if (!this.enabledClick) return;

                let parent = (<HTMLElement>document.body.querySelector(`.js-table-line[data-line="${this.parentId}"]`));

                /* if (
                     parent.getAttribute('lenproducts') === undefined ||
                     parent.getAttribute('lenproducts') === null
                 ) {
                     parent = parent.parentNode;
 
                 }*/
                if (parent.classList.contains('menu-line-no-click')) return;
               
                if (
                    this.parent === 'subparent' ||
                    this.parent === 'parent'
                ) {
                    parent.classList.toggle('m--hidden');
                    if (this.parent === 'subparent') {
                        let list = document.body.querySelectorAll(`.main_table__row[data-line="${this.parentId}"]`);
                        let index: number = (list.length - 1);
                        if (!parent.classList.contains('m--hidden') && $(`.main_table__row[data-line="${this.parentId}"]`).eq(index).find(".table_object_container_fon").css('display') === 'none') {
                            $(list[index].querySelectorAll('.table_object_container_fon')).slideToggle(150);

                        }
                        if (parent.classList.contains('m--hidden') && $(`.main_table__row[data-line="${this.parentId}"]`).eq(index).find(".table_object_container_fon").css('display') === 'block') {
                            $(list[index].querySelectorAll('.table_object_container_fon')).slideToggle(150);

                        }
                    }
                    if (this.parent === 'parent') {

                        if (parent.classList.contains('m--hidden')) {
                            (<HTMLElement>parent.querySelector('.menu-line')).style.height =
                                '102px';
                            (<HTMLElement>parent.querySelector('.parent-price span')).style.fontSize =
                                "18px";
                            (<HTMLElement>parent.querySelector('.parent-price p')).style.fontSize =
                                "18px";
                            (<HTMLElement>parent.querySelector('.parent-title span')).style.fontSize =
                                "18px";


                            hiden = false;
                        } else {
                            (<HTMLElement>parent.querySelector('.menu-line')).style.height =
                                '52px';
                            (<HTMLElement>parent.querySelector('.parent-price span')).style.fontSize =
                                "13px";
                            (<HTMLElement>parent.querySelector('.parent-price p')).style.fontSize =
                                "13px";
                            (<HTMLElement>parent.querySelector('.parent-title span')).style.fontSize =
                                "13px";

                            hiden = true;
                        }
                        for (let i = 0; i < parent.querySelectorAll('.tc__submenu_item').length; i++) {
                            if (!hiden) {
                                parent.querySelectorAll('.tc__submenu_item')[i].classList.remove('m--hidden');
                            }
                            else {
                                parent.querySelectorAll('.tc__submenu_item')[i].classList.add('m--hidden');
                            }

                        }
                        $(`.table_categories[data-line="${parent.getAttribute('data-line')}"]`).slideToggle(150);
                        arraId = parent.querySelectorAll('.js-table-line');

                        for (let i = 0; i < arraId.length; i++) {

                            if (
                                hiden === true &&
                                (<HTMLElement>document.body.querySelector(`.main_table__row[data-line="${arraId[i].getAttribute('data-line')}"]`)).style.display !== 'none'
                            ) {
                                $(`.main_table__row[data-line="${arraId[i].getAttribute('data-line')}"]`).slideToggle(150);
                            }
                            if (arraId[i].getAttribute('parent') === 'subparent' && arraId[i].getAttribute('lenproducts') !== "0") {
                                let list: any = $(`.main_table__row[data-line="${arraId[i].getAttribute('data-line')}"]`);
                                let index: number = (list.length - 1);
                                $(list[index].querySelectorAll(".table_object_container_fon")).hide(150);

                            }
                            if (
                                hiden === false &&
                                (<HTMLElement>document.body.querySelector(`.main_table__row[data-line="${arraId[i].getAttribute('data-line')}"]`)).style.display === 'none'
                            ) {
                                $(`.main_table__row[data-line="${arraId[i].getAttribute('data-line')}"]`).slideToggle(150);
                            }
                        }
                        this.toggleClassTableLine(parent.getAttribute('data-line'));
                        if (hiden) {
                            this.hideTableLine(parent, 'none');

                        } else {
                            this.hideTableLine(parent, 'block');

                        }
                    }
                    $(parent).find('.js-table-line').slideToggle(150);
                    arraId = parent.getElementsByClassName('js-table-line');
                    arraId = this.unique(arraId);

                   
                    if (this.parent === 'parent') {
                    this.broadcaster.broadcast('toggleCategory', new toggleCategory(this.parentId,hiden));
                }else
                {
                    for (let u = 0; u < arraId.length; u++) {
                        $(`.main_table__row[data-line="${arraId[u].getAttribute('data-line')}"]`).slideToggle(150);
                    }
                }
                }
            },
            false
        );
    }
    toggleClassTableLine(id: string) {
        let list = document.body.querySelectorAll(`.main_table__row[data-line="${id}"]`);
        for (let i = 0; i < list.length; i++) {
            list[i].classList.toggle('m--hidden');
        }
    }
    hideTableLine(parent, display: string) {
        let list = parent.querySelectorAll('.js-table-line');
        for (let i = 0; i < list.length; i++) {
            list[i].style.display = display;
        }
    }
    unique(arr) {
        var outArray = Array.from(arr);

        for (var i = 0; i < outArray.length; i++) {
            for (var j = i + 1; j < outArray.length;) {
                if ((<HTMLElement>outArray[i]).getAttribute('data-line') === (<HTMLElement>outArray[j]).getAttribute('data-line')) {
                    outArray.splice(j, 1);
                }
                else {

                    j++;
                }
            }
        }
        return outArray;
    }

}
