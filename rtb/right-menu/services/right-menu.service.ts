
import { ElementRef, Injectable } from '@angular/core';
import { Broadcaster } from 'app/components/service/Broadcaster';
import { SingService } from 'app/components/service/sing.service';
import { Cookie } from 'app/components/app/class/cookie';
import { updateInfoItem } from 'app/components/class/broadcaster/update-info-item';
import { Subscription } from 'rxjs';

@Injectable()
export class RightMenu {
    subBroadcaster:Subscription = new Subscription();
    constructor(private elRef: ElementRef,private broadcaster: Broadcaster, private httpService: SingService) {
      
    }
    title = [];
    months = ['Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    weeksText = ['Su', 'M', 'Tu', 'We', 'Th', 'F', 'Sa'];
    quarters = ['1st Quarter ’',

        '2nd Quarter ’',

        '3rd Quarter ’',

        '4th Quarter ’'];
    public DefaultChannelsTrends(): any {

        return {
            sessions: false,
            leads: false,
            sales: false,
            cpl: false,
            cps: false,
        }

    }
  
    public hideTrands(switchViewGraph:boolean) {
        this.elRef.nativeElement.querySelector('.default-graph').style.display = 'block';
        this.elRef.nativeElement.querySelector('.trends').style.display = 'none';
       
        this.elRef.nativeElement.querySelector('.trends-mask').style.display = 'none';
        document.body.querySelector('.left-main').classList.remove('blur-all');
        document.body.querySelector('.main_table__wrap').classList.remove('blur-all');

      
        let myChart: any = document.querySelector("#myChart");
        myChart.style.width = `${(<HTMLElement>document.body.querySelectorAll(".chart")[0]).offsetWidth + 23}px`;
        if (!switchViewGraph) {
            (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "74px";
            (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "148px";
        }
        else {
            (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "120px";
            (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "219px";
        }
    }
    public showTrands () {
        this.elRef.nativeElement.querySelector('.default-graph').style.display = 'none';
        this.elRef.nativeElement.querySelector('.trends').style.display = 'table-cell';
      
        this.elRef.nativeElement.querySelector('.trends-mask').style.display = 'block';

        document.body.querySelector('.left-main').classList.add('blur-all');
        document.body.querySelector('.main_table__wrap').classList.add('blur-all');
    }
    public enlargementParamsLeftMenu() {

        let listLabels = document.body.querySelectorAll('.left-main .labels__item');
        let listGraphs = document.body.querySelectorAll('.left-main .giagramm');
        let tableEditFon = document.body.querySelector('.left-main .table_control-up');
        let tableEdit = document.body.querySelector('.left-main .table_control-up-first');
        let infoExpenses = document.body.querySelector('.left-main .info-expenses');

        (<HTMLElement>infoExpenses).style.height = '50px';
        (<HTMLElement>infoExpenses).style.display = 'flex';
        (<HTMLElement>tableEditFon).style.height = '149px';
        (<HTMLElement>tableEdit).style.height = '100px';
        for (let i = 0; i < listLabels.length; i++) {
            (<HTMLElement>listGraphs[i]).style.height = '60px';
            (<HTMLElement>listLabels[i]).style.height = '100px';
        }

    }
    public enlargementParamsHead() {
        let head = document.body.querySelector('.header');
        let content = document.body.querySelector('.content');
        (<HTMLElement>content).style.paddingTop = "79px";
        (<HTMLElement>head).style.height = '80px';
        (<HTMLElement>head).classList.remove('m--fixed');

    }
    public enlargementParamsTimeLine() {
        let weeks = document.body.querySelector('.time-line .table_weeks');
        let confirm = document.body.querySelector('.time-line .confirm-switch');
        if ((<HTMLElement>weeks)) {
            (<HTMLElement>weeks).style.height = '50px';
        }
        if ((<HTMLElement>confirm)) {
            (<HTMLElement>confirm).style.display = 'block';
        }


    }
    public enlargementParamsRightMenu() {
        let graph = document.body.querySelector('.default-graph .chart');
        let currentDay = document.body.querySelector('.default-graph .main-current-day');
        let graphBody = document.body.querySelector('.default-graph .chart__wrap');
        let chartFon = document.body.querySelector('.default-graph .chart-fon');
        let corvas = document.body.querySelector('.default-graph #myChart');
        (<HTMLElement>graph).style.paddingTop = '95px';
        (<HTMLElement>graphBody).style.height = '300px';
        (<HTMLElement>corvas).style.height = '220px';
        (<HTMLElement>chartFon).style.height = '220px';
        (<HTMLElement>currentDay).style.display = 'flex';
        (<HTMLElement>currentDay).style.height = '50px';
        (<HTMLElement>graph).style.height = '320px';
    }
    public decreaseParamsHead() {
        let head = document.body.querySelector('.header');
        (<HTMLElement>document.body.querySelector('.content')).style.paddingTop = "50px";
        (<HTMLElement>head).style.height = '50px';
        if (!document.body.querySelector('.header').classList.contains('m--fixed')) {
            document.body.querySelector('.header').classList.add('m--fixed');
        }

    }
    public decreaseParamsLeftMenu() {

        let listLabels = document.body.querySelectorAll('.left-main .labels__item');
        let listGraphs = document.body.querySelectorAll('.left-main .giagramm');
        let tableEditFon = document.body.querySelector('.left-main .table_control-up');
        let tableEdit = document.body.querySelector('.left-main .table_control-up-first');
        let infoExpenses = document.body.querySelector('.left-main .info-expenses');
        (<HTMLElement>infoExpenses).style.height = '0px';
        (<HTMLElement>infoExpenses).style.display = 'none';
        (<HTMLElement>tableEditFon).style.height = '50px';
        (<HTMLElement>tableEdit).style.height = '50px';
        for (let i = 0; i < listLabels.length; i++) {
            (<HTMLElement>listGraphs[i]).style.height = '30px';
            (<HTMLElement>listLabels[i]).style.height = '75px';
        }

    }
    public decreaseParamsTimeLine() {
        let weeks = document.body.querySelector('.time-line .table_weeks');
        let confirm = document.body.querySelector('.time-line .confirm-switch');
        if ((<HTMLElement>weeks)) {
            (<HTMLElement>weeks).style.height = '0px';
        }
        if ((<HTMLElement>confirm)) {
            (<HTMLElement>confirm).style.display = 'none';
        }

    }
    public decreaseParamsRightMenu() {
        let graph = document.body.querySelector('.default-graph .chart');
        let currentDay = document.body.querySelector('.default-graph .main-current-day');
        let graphBody = document.body.querySelector('.default-graph .chart__wrap');
        let chartFon = document.body.querySelector('.default-graph .chart-fon');
        let corvas = document.body.querySelector('.default-graph #myChart');
        (<HTMLElement>graphBody).style.height = '225px';
        (<HTMLElement>graph).style.paddingTop = '70px';
        (<HTMLElement>currentDay).style.height = '0px';
        (<HTMLElement>currentDay).style.display = 'none';
        (<HTMLElement>graph).style.height = '225px';
        (<HTMLElement>corvas).style.height = '175px';
        (<HTMLElement>chartFon).style.height = '175px';
    }
    public getPrice(x: number): string {
        if (x > 10000) {
            let newX: number = Math.round(x / 1000);
            let parts = String(newX).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".") + "K";
        }
        else {
            let parts = String(x).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    }

    public getYears(month: number, year: number): any {
        let MonthDay: any = [];
        let count: number = 1;

        for (let i = 0; i < this.months.length; i++) {
            if (i === 0 || i === 3 || i === 6 || i === 9) {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: ((i + 1) === Number(month) && new Date().getFullYear() === year) ? 'current_quarter' : '', quarter: `${count}Q` });
                count++;
            }
            else {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: ((i + 1) === Number(month) && new Date().getFullYear() === year) ? 'current_quarter' : '', quarter: '' });
            }

        }
        return MonthDay;
    }
    public getWeeks(weeks: any): any {
        let outWeeks: any = [];
        let currentDate: Date = new Date();
        for (let i = 0; i < weeks.length; i++) {
            let start: Date = new Date(weeks[i].start);
            let end: Date = new Date(weeks[i].end);
            outWeeks.push({ start: weeks[i].start, end: weeks[i].end, label: weeks[i].label, days: weeks[i].days, month: weeks[i].month, class: (currentDate.getTime() >= start.getTime() && currentDate.getTime() <= end.getTime()) ? 'current-day' : '' });
        }
        return outWeeks;
    }
    public getWeeksWithInfoExpense(weeks: any, start: number, end: number): any {
        let outWeeks: any = [];
        for (let i = 0; i < weeks.length; i++) {
            if (i >= start && i <= end) {

                outWeeks.push({ start: weeks[i].start, end: weeks[i].end, label: weeks[i].label, days: weeks[i].days, month: weeks[i].month, class: 'current-day' });
            }
            else {
                outWeeks.push({ start: weeks[i].start, end: weeks[i].end, label: weeks[i].label, days: weeks[i].days, month: weeks[i].month, class: '' });
            }

        }
        return outWeeks;
    }
    public getMonthsWithInfoExpense(month: number, year: number, start: number, end: number): any {
        let MonthDay: any = [];
        let count: number = 1;

        for (let i = 0; i < this.months.length; i++) {
            if (i === 0 || i === 3 || i === 6 || i === 9) {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: (i >= start && i <= end) ? 'current_quarter' : '', quarter: `${count}Q` });
                count++;
            }
            else {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: (i >= start && i <= end) ? 'current_quarter' : '', quarter: '' });
            }

        }
        return MonthDay;

    }
    public getTitlesWithInfoExpense(days: number, year: number, month: number, start: number, end: number): any {
        this.title = [];

        let currentDate: Date = new Date(year, Number(month) - 1, 1);
        for (let i = 1; i <= days; i++) {
            currentDate.setDate(i);
            if (i >= start && i <= end) {
                this.title.push({ label: i, class: 'current-day', week: this.weeksText[currentDate.getDay()] });
            }
            else {
                this.title.push({ label: i, class: '', week: this.weeksText[currentDate.getDay()] });
            }


        }
        return this.title;
    }
    public getTitles(days: number, year: number, month: number): any {
        this.title = [];
        let currentDate: Date = new Date(year, Number(month) - 1, 1);
        for (let i = 1; i <= days; i++) {
            currentDate.setDate(i);
            if (new Date().getFullYear() === year && currentDate.getMonth() === new Date().getMonth()) {
                this.title.push({ label: i, class: (new Date().getDate() === i) ? 'current-day' : '', week: this.weeksText[currentDate.getDay()] });
            }
            else {
                this.title.push({ label: i, class: '', week: this.weeksText[currentDate.getDay()] });
            }

        }
        return this.title;
    }
public onChangeGraphView(switchViewGraph:boolean,switchGraph:boolean) {
   
    
    window.localStorage.setItem('viewCompactStatus', (switchViewGraph) ? '0' : '1');
    if (!switchViewGraph) {
        (<HTMLElement>document.body.querySelector('.page-actions')).style.display = 'none';
        document.body.querySelector('.left-main').classList.add('scroll-fixed-left');
        document.body.querySelector('.right-main').classList.add('scroll-fixed-right');
        if (!switchGraph) {
            document.body.querySelector('.time-line').classList.add('time-line-scroll-fixed');
            if (document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed-without-graph')) {

                document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed-without-graph');
            }
        }
        else {
            document.body.querySelector('.left-main').classList.add('scroll-fixed-left-without-graph');
            document.body.querySelector('.left-main').classList.remove('scroll-fixed-left-without-graph-start');
            document.body.querySelector('.time-line').classList.add('time-line-scroll-fixed-without-graph');

            document.body.querySelector('.right-main').classList.remove('scroll-fixed-right-without-graph-start');

        }

        (<HTMLElement>document.body.querySelector('.channels')).style.display = 'none';

        this.decreaseParamsHead();
        this.decreaseParamsLeftMenu();
        this.decreaseParamsTimeLine();
        this.decreaseParamsRightMenu();
        (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "74px";
        (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "148px";
        (<HTMLElement>document.body.querySelector('.main-current-day')).style.display = 'none';
        this.broadcaster.broadcast('setblockScrollEvent', true);
        (<HTMLElement>document.body.querySelector('.header .logo-img')).style.display = "none";
        (<HTMLElement>document.body.querySelector('.header .rooftops-in-head')).style.display = "flex";

    }
    else {
        (<HTMLElement>document.body.querySelector('.page-actions')).style.display = 'block';
        if (!switchGraph) {
            document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed-without-graph');
            document.body.querySelector('.right-main').classList.remove('scroll-fixed-right');
            document.body.querySelector('.left-main').classList.remove('scroll-fixed-left');
            this.enlargementParamsLeftMenu();
            this.enlargementParamsHead();
            this.enlargementParamsTimeLine();
            this.enlargementParamsRightMenu();
            if (document.body.querySelector('.left-main').classList.contains('scroll-fixed-left-without-graph-start')) {
                document.body.querySelector('.left-main').classList.remove('scroll-fixed-left-without-graph-start');
            }
            if (document.body.querySelector('.right-main').classList.contains('scroll-fixed-right-without-graph-start')) {
                document.body.querySelector('.right-main').classList.remove('scroll-fixed-right-without-graph-start');


            }
            if (document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed')) {
                document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed');
            }

            (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "120px";
            (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "219px";

            (<HTMLElement>document.body.querySelector('.channels')).style.display = 'block';
        }
        this.broadcaster.broadcast('setblockScrollEvent', false);
        if (switchGraph) {
            this.enlargementParamsHead();
            if (document.body.querySelector('.left-main').classList.contains('scroll-fixed-left-without-graph')) {
                document.body.querySelector('.left-main').classList.remove('scroll-fixed-left-without-graph');
            }
            if (document.body.querySelector('.left-main').classList.contains('scroll-fixed-left')) {
                document.body.querySelector('.left-main').classList.remove('scroll-fixed-left');
            }
            if (document.body.querySelector('.right-main').classList.contains('scroll-fixed-right')) {
                document.body.querySelector('.right-main').classList.remove('scroll-fixed-right');
            }
            if (document.body.querySelector('.time-line') && document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed-without-graph')) {
                document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed-without-graph');
            }
            if (document.body.querySelector('.left-main') && !document.body.querySelector('.left-main').classList.contains('scroll-fixed-left-without-graph-start')) {
                document.body.querySelector('.left-main').classList.add('scroll-fixed-left-without-graph-start');
            }
            document.body.querySelector('.right-main').classList.add('scroll-fixed-right-without-graph', 'scroll-fixed-right-without-graph-start');

        }
        if (window.pageYOffset >= 80) {

            (<HTMLElement>document.body.querySelector('.header .logo-img')).style.display = "none";
            (<HTMLElement>document.body.querySelector('.header .rooftops-in-head')).style.display = "flex";

        }
        else {
            (<HTMLElement>document.body.querySelector('.header .logo-img')).style.display = "block";
            (<HTMLElement>document.body.querySelector('.header .rooftops-in-head')).style.display = "none";
        }

    }

}
public onInitEditBudget (budget:number,input:HTMLInputElement) {
    
    this.elRef.nativeElement.querySelector('.edit-data-budget span').style.display = 'none';
    this.elRef.nativeElement.querySelector('.edit-data-budget').style.margin = '0px';
    
    input.style.display = 'inline-block';
    
    if (budget === null || budget === 0) {
        input.value = "";
    } else {
        input.value = budget.toString();
    }
   
   setTimeout(function() {input.focus(); }, 1);
  //  input.focus();
    input.onblur = () => {
        
        this.elRef.nativeElement.querySelector('.edit-data-budget span').style.display = 'inline-block';
        input.style.display = 'none';
        this.elRef.nativeElement.querySelector('.edit-data-budget').style.margin = '0px 30px 0px 0px';
        input.onblur = null;
    };
}
public ToggleGraphsShow (switchGraph:boolean,status:number) {
    this.elRef.nativeElement.querySelector('.default-graph .chart__wrap').style.display = 'block';
    (<HTMLElement>document.body.querySelector('.labels')).style.display = 'block';
   

    document.body.querySelector('.left-main').classList.remove('scroll-fixed-left-without-graph');
    document.body.querySelector('.right-main').classList.remove('scroll-fixed-right-without-graph');
    if (switchGraph) {
        this.broadcaster.broadcast('updateInfoItem', new updateInfoItem({
            id: null,
        }));
    }
    if (!document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed')) {
        document.body.querySelector('.time-line').classList.add('time-line-scroll-fixed');
    }
    if (document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed-without-graph')) {

        document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed-without-graph');
    }
    if (switchGraph) {
        if (window.pageYOffset >= 80) {

            if (window.pageYOffset === 80) {
                document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed-without-graph');
                document.body.querySelector('.right-main').classList.remove('scroll-fixed-right');
                document.body.querySelector('.left-main').classList.remove('scroll-fixed-left');
                this.enlargementParamsLeftMenu();
                this.enlargementParamsHead();
                this.enlargementParamsTimeLine();
                this.enlargementParamsRightMenu();
            }
            else {
                this.decreaseParamsHead();
                this.decreaseParamsLeftMenu();
                this.decreaseParamsTimeLine();
                this.decreaseParamsRightMenu();
            }
            (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "74px";
            (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "148px";

        }
        else {
            this.enlargementParamsLeftMenu();
            this.enlargementParamsHead();
            this.enlargementParamsTimeLine();
            this.enlargementParamsRightMenu();
            if (document.body.querySelector('.left-main').classList.contains('scroll-fixed-left-without-graph-start')) {
                document.body.querySelector('.left-main').classList.remove('scroll-fixed-left-without-graph-start');
            }
            if (document.body.querySelector('.right-main').classList.contains('scroll-fixed-right-without-graph-start')) {
                document.body.querySelector('.right-main').classList.remove('scroll-fixed-right-without-graph-start');


            }
            if (document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed')) {
                document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed');
            }

            (<HTMLElement>document.body.querySelector('.chart-val-one')).style.bottom = "120px";
            (<HTMLElement>document.body.querySelector('.chart-val-two')).style.bottom = "219px";

            (<HTMLElement>document.body.querySelector('.channels')).style.display = 'block';


        }
    }
    window.localStorage.setItem('graphStatus', String(status));
}
public ToggleGraphsHidde (status:number) {
    this.elRef.nativeElement.querySelector('.default-graph .chart__wrap').style.display = 'none';
    (<HTMLElement>document.body.querySelector('.labels')).style.display = 'none';
   
    document.body.querySelector('.right-main').classList.add('scroll-fixed-right-without-graph');
    if (window.pageYOffset < 80) {
        document.body.querySelector('.left-main').classList.add('scroll-fixed-left-without-graph-start');
        document.body.querySelector('.right-main').classList.add('scroll-fixed-right-without-graph-start');
       
    }
    if (document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed')) {
        document.body.querySelector('.time-line').classList.remove('time-line-scroll-fixed');
    }

    if (window.pageYOffset >= 80) {
        this.decreaseParamsHead();
        this.decreaseParamsLeftMenu();
        this.decreaseParamsTimeLine();
        this.decreaseParamsRightMenu();
        if (window.pageYOffset === 80) {
            document.body.querySelector('.left-main').classList.add('scroll-fixed-left-without-graph');
            document.body.querySelector('.left-main').classList.add('scroll-fixed-left');
            document.body.querySelector('.right-main').classList.add('scroll-fixed-right');
            document.body.querySelector('.time-line').classList.add('time-line-scroll-fixed-without-graph');
        }
        else {

            document.body.querySelector('.left-main').classList.add('scroll-fixed-left-without-graph');
            document.body.querySelector('.left-main').classList.add('scroll-fixed-left');
            document.body.querySelector('.right-main').classList.add('scroll-fixed-right');
            if (!document.body.querySelector('.time-line').classList.contains('time-line-scroll-fixed-without-graph')) {

                document.body.querySelector('.time-line').classList.add('time-line-scroll-fixed-without-graph');
            }
        }
    }
    (<HTMLElement>document.body.querySelector('.info-expenses')).style.display = 'none';
    (<HTMLElement>document.body.querySelector('.main-current-day')).style.display = 'none';
    (<HTMLElement>document.body.querySelector('.time-line .confirm-switch')).style.display = 'none';
    window.localStorage.setItem('graphStatus', String(status));
    document.body.classList.remove('stop-scrolling');
}
}