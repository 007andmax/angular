import { Directive, ElementRef, Renderer, Input } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { toggleCategory } from 'app/components/class/broadcaster/toggle-category';

@Directive({
    selector: '[menu-item]',

})
export class MenuItemDirective {
    charts: any = [];
    @Input("enabledClick") enabledClick: boolean = false;
    @Input("color") color: string;
    @Input("parentId") parentId: string;
    constructor(private element: ElementRef, private renderer: Renderer, private broadcaster: Broadcaster) { }
    ngOnInit() {


        this.element.nativeElement.addEventListener(
            'mouseenter',
            (event) => {
                event.target.parentNode.querySelector(
                    '.menu-line',
                ).style.width =
                    '10px';
                event.target.parentNode.querySelector(
                    '.menu-line',
                ).style.zIndex = 10;


                if (event.target.parentNode.querySelector('.tc__title') && event.target.parentNode.querySelector('.tc__title').classList.contains('have-short-title')) {
                    event.target.parentNode.querySelector('.tc__price').style.visibility = 'hidden';
                }

            },
            false,
        );

        this.element.nativeElement.addEventListener(
            'mouseleave',
            (event) => {

                event.target.parentNode.querySelector(
                    '.menu-line',
                ).style.width =
                    '5px';
                event.target.parentNode.querySelector(
                    '.menu-line',
                ).style.zIndex = 9;
                if (event.target.parentNode.querySelector('.tc__title') && event.target.parentNode.querySelector('.tc__title').classList.contains('have-short-title')) {
                    event.target.parentNode.querySelector('.tc__price').style.visibility = 'visible';
                }
            },
            false,
        );
        this.element.nativeElement.addEventListener(
            'click',
            (event) => {
               
                let hiden: boolean = false;
                let arraId: any;

                if (!this.enabledClick) return;

                let parent = this.getParentElement(event.target);

                if (
                    parent.getAttribute('lenproducts') === undefined ||
                    parent.getAttribute('lenproducts') === null
                ) {
                    parent = parent.parentNode;

                }
                if (parent.classList.contains('menu-line-no-click')) return;
                if (
                    parent.getAttribute('parent') === 'subparent' ||
                    parent.getAttribute('parent') === 'parent'
                ) {
                    parent.classList.toggle('m--hidden');
                    if (parent.getAttribute('parent') === 'subparent') {
                        let list = document.body.querySelectorAll(`.main_table__row[data-line="${this.parentId}"]`);
                        let index: number = (list.length - 1);
                        if (!parent.classList.contains('m--hidden') && $(`.main_table__row[data-line="${this.parentId}"]`).eq(index).find(".table_object_container_fon").css('display') === 'none') {
                            $(list[index].querySelectorAll('.table_object_container_fon')).slideToggle(150);

                        }
                        if (parent.classList.contains('m--hidden') && $(`.main_table__row[data-line="${this.parentId}"]`).eq(index).find(".table_object_container_fon").css('display') === 'block') {
                            $(list[index].querySelectorAll('.table_object_container_fon')).slideToggle(150);

                        }
                    }
                    if (parent.getAttribute('parent') === 'parent') {

                        if (parent.classList.contains('m--hidden')) {
                            parent.querySelector('.menu-line').style.height =
                                '102px';
                            parent.querySelector('.parent-price span').style.fontSize =
                                "18px";
                            parent.querySelector('.parent-price p').style.fontSize =
                                "18px";
                            let parent_title = parent.querySelectorAll('.parent-title span');
                            for (let i = 0; i < parent_title.length; i++) {
                                parent_title[i].style.fontSize = "18px";
                            }


                            hiden = false;
                        } else {
                            parent.querySelector('.menu-line').style.height =
                                '52px';
                            parent.querySelector('.parent-price span').style.fontSize =
                                "13px";
                            parent.querySelector('.parent-price p').style.fontSize =
                                "13px";
                            let parent_title = parent.querySelectorAll('.parent-title span');
                            for (let i = 0; i < parent_title.length; i++) {
                                parent_title[i].style.fontSize = "13px";
                            }

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

                 
                }
                if (parent.getAttribute('parent') === 'parent') {
                    this.broadcaster.broadcast('toggleCategory', new toggleCategory (this.parentId,hiden));
                }
                else
                {
                    for (let u = 0; u < arraId.length; u++) {
                        $(`.main_table__row[data-line="${arraId[u].getAttribute('data-line')}"]`).slideToggle(150);
                       
                    }
                }
            },
            false
        );
    }
    private getParentElement(p) {
        let parent = p;
        while (!parent.classList.contains('js-table-line')) {

            parent = parent.parentNode;

        }

        return parent;
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