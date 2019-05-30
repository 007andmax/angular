import { ExpenseService } from "../services/info.component.service";
import { showEditMode } from "app/components/class/info-expense/show-edit-mode";
import { CategoryDirectory } from "app/components/class/directory/category";
import { Category } from "app/components/class/category/category";
import { IndexExpense } from "app/components/class/index-expense";
import { Settings } from "app/components/class/setting";
import { DayMonth } from "./day-month";
import { Product } from "app/components/class/product/product";
import { UploadFiles } from "app/components/interfaces/expense/upload-files";

export class EditModeInfoExpense {
    enabledAddFlightDate: boolean;
    currentDate: Date;
    daysMonth: Array<DayMonth>;
    flightDateIndex: number;
    start: number;
    end: number; 
    dataId: IndexExpense;
    year: number;
    listIdExpenses: Array<any>;
    counterExpenses: number;
    settings: Settings;
    productsLen: number;
    Command: string = "";
    product: any;//Product
    preloader: boolean;
    uploadFileData: UploadFiles;
    oauthToken: string;
    pickerApiLoaded: boolean;
    API_KEY: string; CLIENT_ID: string;
    serviceAccount: string;
    SCOPES: ['https://www.googleapis.com/auth/drive'];
    categori: any;//CategoryDirectory | Category
    error: Boolean;
    showMediaCategory: boolean;
    blockEditMedia: boolean;
    scrollFlightDate: boolean;
    add_comapin:boolean;
    productCategoryId:string;
    productId:string;
    days:number = 0;
    isMedia:boolean = false;
    showProcent: boolean = false;
    currentLine:HTMLElement;
    defaultValEditDate: { targetBudget: number, start: number, end: number, showProcent: boolean, addDate: boolean, currentLine: HTMLElement, isMedia: boolean }
    constructor() {
        this.enabledAddFlightDate = false;
        this.currentDate = new Date();
        this.daysMonth = [];
        this.flightDateIndex = 0;
        this.start = 0;
        this.end = 0;
        this.dataId = null;
        this.add_comapin = false;
        this.showProcent = false;
        this.year = 0;
        this.days = 0;
        this.listIdExpenses = [];
        this.counterExpenses = 0;
        this.productId = '';
        this.settings = null;
        this.productsLen = 0;
        this.Command = "";
        this.product = null;
        this.preloader = false;
        this.uploadFileData = { count: 0, length: 0, complete: false };
        this.oauthToken = "";
        this.pickerApiLoaded = false;
        this.API_KEY = '';
        this.CLIENT_ID = '';
        this.serviceAccount = '';
        this.SCOPES = ['https://www.googleapis.com/auth/drive'];
        this.categori = null;
        this.error = false;
        this.showMediaCategory = false;
        this.blockEditMedia = false;
        this.scrollFlightDate = false;
        this.productCategoryId ='';
        this.defaultValEditDate = { targetBudget: 0, start: 0, end: 0, showProcent: false, addDate: false, currentLine: null, isMedia: false };

    }
    public EditFlightDate(index: number,nativeElement:any,listExpenses:any,expenseIndex:number) {
       
        ///
        this.daysMonth = [];
        this.flightDateIndex = index;
        this.defaultValEditDate.start = listExpenses[expenseIndex].flightDate[index].start.day;
        this.defaultValEditDate.end = listExpenses[expenseIndex].flightDate[index].end.day;
        this.defaultValEditDate.targetBudget = (listExpenses[expenseIndex].flightDate[index].targetBudget === 0) ? "" : listExpenses[expenseIndex].flightDate[index].targetBudget;
        let elements: any = document.querySelectorAll('.flight-date-item');
        var childTop = (this.defaultValEditDate.addDate === true) ? elements[this.getIndex(expenseIndex, index - 1,listExpenses[expenseIndex])].offsetTop : elements[this.getIndex(expenseIndex, index,listExpenses)].offsetTop;
        let container = nativeElement.querySelector('.info-fon-flightdates-body');
        var parentTop = container.offsetTop;
        var childOffset = (childTop - parentTop);
    
        if (this.defaultValEditDate.addDate === false) {
            if ((index + 1) === listExpenses[expenseIndex].flightDate.length) {
                container.scrollTo(0, container.scrollHeight);
            }
            nativeElement.querySelector('.cursore-modal').style.top = `${childOffset + 6 - container.scrollTop}px`; // 10
        }
        if (this.defaultValEditDate.addDate === true) {
            nativeElement.querySelector('.cursore-modal').style.top = `${((index < 4 ? index : 4) * 36) + 6}px`; // 10

            container.scrollTo(0, container.scrollHeight);
        }
        nativeElement.querySelector('.modal-edit-mask').style.display = 'block';
        nativeElement.querySelector('.edit-flight-date-modal').style.display = 'block';
    
        if (this.settings.viewType === 'monthsOfQuarter' || this.settings.viewType === 'monthsOfYear') {
            this.currentDate = new Date(this.year, listExpenses[expenseIndex].flightDate[index].start.month - 1, 1);
            this.days = 32 - new Date(this.year, listExpenses[expenseIndex].flightDate[index].start.month - 1, 32).getDate();
        }
        this.currentDate.setDate(1);
        let dayWeek: number = (this.currentDate.getDay() !== 0) ? this.currentDate.getDay() : 7;
        if (dayWeek !== 1) {
            for (let u = 1; u < dayWeek; u++) {
                this.daysMonth.push( new DayMonth ("","no-hover"));
            }
        }
        for (let i = 1; i <= this.days; i++) {

            this.daysMonth.push( new DayMonth (i, (listExpenses[expenseIndex].flightDate[index].start.day === i || listExpenses[expenseIndex].flightDate[index].end.day === i) ? 'select-date' : (listExpenses[expenseIndex].flightDate[index].start.day < i && listExpenses[expenseIndex].flightDate[index].end.day > i) ? 'select-between' : '' ));
        }
        this.currentDate.setDate(this.days);
        dayWeek = (this.currentDate.getDay() !== 0) ? this.currentDate.getDay() : 7;
        if (dayWeek !== 7) {
            for (let g = dayWeek; g < 7; g++) {
                this.daysMonth.push(new DayMonth ("","no-hover"));
            }
        }
    }
    getIndex(i: number, u: number,listExpenses:any): number {
        if (i === 0) return u;
        return (i * listExpenses[i - 1].flightDate.length + u);
    }
    public onInitFlightDate(e) {
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
   public resetEditFlightDate(index: number,action:ExpenseService) {
        this.enabledAddFlightDate = false;
        this.daysMonth = action.resetdaysMonth(this.daysMonth, index);
    }
    public SelectNewDate (i: number,listExpenses:any,expenseIndex:number,action:ExpenseService) {
        if (this.daysMonth[i].selected === 'no-hover') return;
        if (!this.enabledAddFlightDate) {
            this.resetEditFlightDate(i,action);
            this.start = i;
            this.defaultValEditDate.start = (i - 1);
            this.enabledAddFlightDate = true;

            if (this.defaultValEditDate.addDate) {
                let elements: any = document.querySelectorAll('.flight-date-item');
                elements[this.getIndex(expenseIndex, this.flightDateIndex,listExpenses)].querySelector('.end-flight').classList.remove('disabled-end-flight');
            }
        }
        else {
            if (this.start > i) return;
            this.end = i;
            this.defaultValEditDate.end = (i - 1);
            this.enabledAddFlightDate = false;
            this.daysMonth[i].selected = 'select-date';
        }
    } 
    public show (data:showEditMode) {
        this.Command = data.action;
        this.dataId = data.dataId;
        this.product = data.product;
        this.settings = data.settings;
        this.categori = data.categori;
        this.productCategoryId = String(data.productCategoryId);
        this.currentDate = new Date(this.settings.year, Number(this.settings.month) - 1, 1);
    }
    public update (data,mediaCategories) {
        this.productId = data.productId;
        this.productCategoryId = data.productCategoryId;
        (<HTMLElement>document.body.querySelector('.clients-list')).style.display = 'none';
        (<HTMLElement>document.body.querySelector('.settings-file')).style.display = 'none';
        document.body.querySelector('.header').classList.add('m--fixed');
        (<HTMLElement>document.body.querySelector('.header')).style.height = "80px";
        this.isMedia = (mediaCategories.findIndex(item => item === data.productCategoryId) === (-1)) ? false : true;
        this.flightDateIndex = Number(data.index);
        this.Command = data.action;
        this.product = data.product;
        this.productsLen = data.productsLen;
        this.year = data.year;
        this.uploadFileData.count = 0;
        this.uploadFileData.length = 0;
        this.error = false;
        this.currentDate = new Date(data.year, data.month, 1);
        this.dataId = data.dataId;
        this.currentLine = data.currentLine;
    }
    public callOnLastIterationFlightDate(nativeElement:HTMLElement) {
        if (!this.scrollFlightDate) return;
        let container = nativeElement.querySelector('.info-fon-flightdates-body');

        if (this.defaultValEditDate.addDate === true && container.scrollHeight > 210) {
            container.scrollTo(0, container.scrollHeight);

        }
        this.scrollFlightDate = false;
    }

}