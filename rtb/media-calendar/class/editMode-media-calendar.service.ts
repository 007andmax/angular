import { MediaCalendar } from "../services/media-calendar.service";

export class EditModeMediaCalendar {
    enabledAddFlightDate: boolean;
    currentDate: Date;
    daysMonth: Array<any>;
    flightDateIndex: number;
    start: number;
    end: number;
    year: number;
    productIndex: number;
    campaignsIndex: number;
    days: number = 0;
    defaultValEditDate: { targetBudget: Number, start: Number, end: Number, showProcent: boolean, addDate: boolean }
    constructor() {
        this.enabledAddFlightDate = false;
        this.currentDate = new Date();
        this.daysMonth = [];
        this.flightDateIndex = 0;
        this.start = 0;
        this.end = 0;
        this.year = 0;
        this.productIndex = 0;
        this.campaignsIndex = 0;
        this.defaultValEditDate = { targetBudget: 0, start: 0, end: 0, showProcent: false, addDate: false };

    }
    
    public SelecteFlightDate(e){
        if (this.enabledAddFlightDate) {
            if (this.start > $(e.target).index()) {
                for (let i = 0; i < this.daysMonth.length; i++) {
                    if (i !== this.start && this.daysMonth[i].selected !== 'no-hover') {
                        this.daysMonth[i].selected = '';
                    }
                }
                return;
            }
            if (this.start <= $(e.target).index() && this.daysMonth[$(e.target).index()].selected !== 'no-hover') {
                for (let i = 0; i < this.daysMonth.length; i++) {
                    if (i >= (this.start + 1) && i < $(e.target).index()) {
                        this.daysMonth[i].selected = 'select-between';
                    }
                    else {
                        if (i !== this.start && i !== $(e.target).index() && this.daysMonth[i].selected !== 'no-hover') {
                            this.daysMonth[i].selected = '';
                        }
                    }
                }
                this.daysMonth[$(e.target).index()].selected = 'select-date';
            }

        }
    }
    public SelectNewDate (i:number) {
        if (!this.enabledAddFlightDate) {
            this.start = i;
            this.defaultValEditDate.start = (i - 1);
            this.enabledAddFlightDate = true;
        }
        else {
            if (this.start > i) return;
            this.end = i;
            this.defaultValEditDate.end = (i - 1);
            this.enabledAddFlightDate = false;
            this.daysMonth[i].selected = 'select-date';
        }
    }
    public  EditFlightDate(i: number, u: number, d: number, event: any,nativeElement:any,listMedia:any,actions:MediaCalendar) {
        this.daysMonth = [];
        this.flightDateIndex = d;
        this.productIndex = i;
        this.campaignsIndex = u;
        let parent = actions.getParentElement(event.target, 'flightDate-info');
        parent.querySelector('.dates').classList.add('current-dates-edit');
        this.defaultValEditDate.start = listMedia[i].campaigns[u].flightDate[d].start.day;
        this.defaultValEditDate.end = listMedia[i].campaigns[u].flightDate[d].end.day;
        this.defaultValEditDate.targetBudget = (listMedia[i].campaigns[u].flightDate[d].targetBudget === 0) ? "" : listMedia[i].campaigns[u].flightDate[d].targetBudget;
       
        var childTop = event.target.offsetTop;
        let container:HTMLElement = nativeElement.querySelector('.expense-body');
        let modal:HTMLElement = nativeElement.querySelector('.edit-flight-date-modal');

        if (container.scrollTop > childTop) {
            container.scrollTo(0, container.scrollTop - 35);
            modal.style.top = `170px`;
        }
        else {
            modal.style.top = `${(((childTop - container.scrollTop) + 370) > container.offsetHeight) ? (container.offsetHeight + 170 - 370) : (170 + (childTop - container.scrollTop))}px`;
        }
        let modaloffsetTop = Number((<HTMLElement>nativeElement.querySelector('.edit-flight-date-modal')).style.top.replace('px', ''));
        (<HTMLElement>nativeElement.querySelector('.cursore-modal')).style.top = `${(childTop - modaloffsetTop) + 7}px`;
        (<HTMLElement>nativeElement.querySelector('.modal-edit-mask')).style.display = 'block';
        (<HTMLElement>nativeElement.querySelector('.edit-flight-date-modal')).style.display = 'block';
        this.currentDate.setDate(1);
        let dayWeek: number = (this.currentDate.getDay() !== 0) ? this.currentDate.getDay() : 7;
        if (dayWeek !== 1) {
            for (let u = 1; u < dayWeek; u++) {
                this.daysMonth.push({ label: '', selected: 'no-hover' });
            }
        }
        for (let h = 1; h <= this.days; h++) {

            this.daysMonth.push({ label: h, selected: (listMedia[i].campaigns[u].flightDate[d].start.day === h || listMedia[i].campaigns[u].flightDate[d].end.day === h) ? 'select-date' : (listMedia[i].campaigns[u].flightDate[d].start.day < h && listMedia[i].campaigns[u].flightDate[d].end.day > h) ? 'select-between' : '' });
        }
        this.currentDate.setDate(this.days);
        dayWeek = (this.currentDate.getDay() !== 0) ? this.currentDate.getDay() : 7;
        if (dayWeek !== 7) {
            for (let g = dayWeek; g < 7; g++) {
                this.daysMonth.push({ label: '', selected: 'no-hover' });
            }
        }
    }

}