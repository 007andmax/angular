import {
    Directive,
    ElementRef,
    Renderer,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
@Directive({
    selector: '[textarea-info-expense]',
})

export class TextareaInfoExpenseDirective {
    content = null;
    TextArea: HTMLTextAreaElement;
    @Input("text") text: string = '';
    @Input("label") label: string = '';
    hover: boolean = false;
    hiddenContent: HTMLElement;
    @Input("canManageOwnBudgets") canManageOwnBudgets: number = 1;
    @Output() onValueText: EventEmitter<any> = new EventEmitter();
    p: HTMLTextAreaElement;
    edit: boolean = false;
    constructor(private element: ElementRef, private renderer: Renderer) { }
    ngOnInit() {
        let parent = this.getParentElement(this.element.nativeElement);//event.target;
        this.TextArea = (<HTMLTextAreaElement>parent.querySelector('.edit-velue'));

        this.checkText();
        autosize(this.TextArea);
        //  autosize(this.TextArea);
        // this.p = this.element.nativeElement.querySelector('p');

        this.element.nativeElement.addEventListener(
            'click',
            (event) => {

                if (this.canManageOwnBudgets === 0 || this.edit === true) return;
                this.edit = true;
                // let parent = this.getParentElement(event.target);//event.target;
                //console.log("parent", parent);
                autosize(this.TextArea);
                //   let input = parent.querySelector('.edit-velue');
                //  this.p = input;
                this.TextArea.value = this.text;
                //  let p = parent.querySelector('p');


                //   p.style.display = 'none';

                parent.classList.add('info-fon-details-select');
                if (parent.classList.contains('info-fon-details-down-item') && parent.classList.contains('no-text')) {
                    parent.classList.remove('no-text');
                }
                if (parent.classList.contains('info-fon-details-down-item')) {
                    autosize.update(this.TextArea);
                }
                this.TextArea.focus();//input.focus();
                this.TextArea.onblur = () => {
                   
                    parent.classList.remove('info-fon-details-select');
                    this.onValueText.emit({ label: this.label, text: this.TextArea.value, element: this.TextArea });
                    autosize.update(this.TextArea);
                    this.edit = false;
                    this.checkText();
                    // autosize.update(this.TextArea);

                };

                /*     p.addEventListener(
                         'keydown', (e) => {
     
                             if (e.keyCode === 13) {
                                 p.style.display = 'block';
                                   input.style.display = 'none';
                                 parent.classList.remove('info-fon-details-select');
     
     
                             }
     
     
                         });*/

            },
            false
        );
        parent.addEventListener(
            'mouseenter',
            (event) => {
                if (this.edit) return;
                this.TextArea.value = this.text;
                autosize.update(this.TextArea);
                this.hover = true;
            },
            false
        );

        parent.addEventListener(
            'mouseleave',
            (event) => {
                if (this.edit) return;
                if (this.text.length > 332) {
                    this.TextArea.value = this.text.substring(0, 320) + '… '; //<span style="font-family: ProximaNova-Italic;color: #b3b3b3;">Read more</span>
                }
                else {
                    this.TextArea.value = this.text;
                }
                autosize.update(this.TextArea);
                this.hover = false;
            },
            false
        );


    }
    private getParentElement(p) {
        let parent = p;
        while (!parent.classList.contains('info-fon-val-item')) {

            parent = parent.parentNode;
            //  console.log("parent", parent);
        }
        return parent;
    }
    checkText() {
        if (this.TextArea && this.edit === false) {
            //   console.log("this.text.length", this.text.length);
            if (this.text.length > 332) {
                this.TextArea.value = this.text.substring(0, 320) + '… '; //<span style="font-family: ProximaNova-Italic;color: #b3b3b3;">Read more</span>
            }
            else {
                this.TextArea.value = this.text;
            }
            autosize.update(this.TextArea);

            if (this.text.length === 0 && !this.element.nativeElement.classList.contains('no-text')) {
                this.element.nativeElement.classList.add('no-text');
            }
            if (this.text.length > 0 && this.element.nativeElement.classList.contains('no-text')) {
                this.element.nativeElement.classList.remove('no-text');
            }
        }
        /* else {
             this.p = this.element.nativeElement.querySelector('p');
         }*/
    }
    ngDoCheck() {
        // console.log("ngDoCheck");
        if (this.hover) return;

        this.checkText();

        /*  if (this.text.length === 0 && this.element.nativeElement.style.display === 'block' || this.text.length === 0 && this.element.nativeElement.style.display === '') {
              this.element.nativeElement.parentNode.classList.add('no-text');
          }*/

    }

}
