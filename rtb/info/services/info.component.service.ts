import { Injectable, ElementRef } from "@angular/core";
import { Broadcaster } from "app/components/service/Broadcaster";
import { CreateProduct } from "../class/create-product";
import { Expense } from "../../../class/expense/expense";
import { DataPeriod } from "app/components/class/rtb/table/data-period";
import { SingService } from "app/components/service/sing.service";
import { setflightDate } from "app/components/class/broadcaster/info-expense/set-flight-date";
import { Coop } from "../class/coop";
import { DeleteFileExpense } from "../class/delete-file-expense";
import { updateTitleTable } from "app/components/class/broadcaster/info-expense/update-title-table";
import { FlightDate } from "app/components/class/expense/flight-date";
import { EditModeInfoExpense } from "../class/editMode-Info-expense";
import { Confirm } from "app/components/class/confirm";
import { DayMonth } from "../class/day-month";
import { Rights } from "app/components/class/rights";
import { FlightDateSave } from "app/components/class/expense/flight-date-save";
import { GeneralService } from "app/components/class/general.service";
import { Subscription } from "rxjs";
@Injectable()
export class ExpenseService {
    dataPeriod: DataPeriod;
    fotoramaInit: boolean = false;
    fotoramaData: any = null;
    OneFileInit: boolean = false;
    parentId: String = "";
    DefaultExpenses: Array<Expense> = [];
    days: number = 0;
    tableIndex: number = 1;
    ErrorDateText: string = "You can not to save the empty flight date budget. Insert the cost, please.";
    ErrorEditMediaCategoryValues: string = "You can not edit this.";
    ErrorFlightDates: string = "The flight dates can not have the same dates.";
    createProduct:CreateProduct;
    Dropzones: any = null;
    mediaCategories: Array<String> = [];
    expense:Expense = new Expense();
    subBroadcaster:Subscription = new Subscription();
    subParams:Subscription;
    constructor(private elRef: ElementRef, private broadcaster: Broadcaster,private httpService: SingService,public generalService: GeneralService) {

    }
    public checkForCliseEditFlightDate(editMode:EditModeInfoExpense,flightDate:FlightDate):boolean {
        if (editMode.defaultValEditDate.start !== flightDate.start.day || editMode.defaultValEditDate.end !== flightDate.end.day || editMode.defaultValEditDate.targetBudget !== flightDate.targetBudget) {
            this.broadcaster.broadcast("Confirm", new Confirm("data","closedEditflightDate"));
            return false;
        }
        return true;

    }
    public onInit () {
        this.elRef.nativeElement.addEventListener(
            "keydown",
            (event) => {
                if (event.which == 9) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                });
        this.elRef.nativeElement.addEventListener(
            "keyup",
            (event) => {
                if (event.which == 9) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.tableIndex !== 6) {
                        this.tableIndex++;
                    }
                    else {
                        this.tableIndex = 0;
                    }
                    this.elRef.nativeElement.querySelectorAll(".info-fon-val-item")[this.tableIndex].click();
                }
            });

            let updateMediaCategories:Subscription =  this.broadcaster.on<any>("updateMediaCategories").subscribe((data:Array<String>) => {

                this.mediaCategories = data;
            });
            this.subBroadcaster.add(updateMediaCategories);
            
    }
    public hideGoodleDiskBtn() {
        this.elRef.nativeElement.querySelector(".google-disk").style.display = "none";
    }
    public showGoodleDiskBtn() {
        this.elRef.nativeElement.querySelector(".google-disk").style.display = "block";
    }
    public  toogleSelectRow(add:boolean) {
        if (add)
        {
            document.body.querySelector(`.main_table__row[data-line="${this.parentId}"]`).classList.add("main_table__row-selected");
        } else {
            document.body.querySelector(`.main_table__row[data-line="${this.parentId}"]`).classList.remove("main_table__row-selected");
        }
      
    }
 public onInitAddFiles() {
    this.elRef.nativeElement.querySelector(".back-after-add-files").style.display = "block";
    this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
    this.elRef.nativeElement.querySelector(".google-disk").style.display = "block";
 } 
    public showPreloader () {
        this.elRef.nativeElement.querySelector(".preloader-mini").style.display = "block";
        this.elRef.nativeElement.querySelector(".info-fon-body").style.display = "none";
    }
    public hidePreloader () {
        this.elRef.nativeElement.querySelector(".preloader-mini").style.display = "none";
                this.elRef.nativeElement.querySelector(".info-fon-body").style.display = "block";
    }
    public getFilesFolderGoogleDrive (id) {
        return  this.httpService.getFilesFolderGoogleDrive(id);
    }
    public getFilePermission (id,oauthToken:String,serviceAccount:String) {
        this.httpService.getFilePermission(id, oauthToken, serviceAccount)
        .subscribe(res => {

        });
    }
    public getExpenseFiles (id:number,folderId:number) {
        return this.httpService.getExpenseFiles(id,folderId);
    }
    public removeFileExpense (fileid:number) {
        return  this.httpService.removeFileExpense(fileid)
    }
    public saveExpense () {
        return this.httpService.saveExpense(this.expense);
    }
    public addExpense () {
        return  this.httpService.addExpense(this.expense);
    }
    public createProductInit (data:CreateProduct) {
        return   this.httpService.createProduct(data);
    }

    public clearData() {
        this.DefaultExpenses = [];
    }
    public onScrollWindow(elem, action: String) {
        if (action !== "add-product" && action !== "add-new-product" && action !== "create-new-product" && action !== "ChangeSumm") {

            if (document.body.querySelector(".left-main").classList.contains("scroll-fixed-left-without-graph-start") || document.body.querySelector(".left-main").classList.contains("scroll-fixed-left-without-graph")) {
                //  if (window.scrollY > 250) return;
                //  document.body.querySelectorAll(".container")[1].classList.add("main-margin");
                document.body.querySelectorAll(".container")[1].classList.add("main-margin");
                /*  if (((window.pageYOffset || document.documentElement.scrollTop) + 810) > this.getCoords(elem).top) {
                      document.body.querySelectorAll(".container")[1].classList.add("main-margin");
                  }*/
                /*          if ((((window.pageYOffset || document.documentElement.scrollTop) + 810) - this.getCoords(elem).top) >= 50 && (((window.pageYOffset || document.documentElement.scrollTop) + 560) - this.getCoords(elem).top) < 250) {
                                 document.body.querySelectorAll(".container")[1].classList.add("main-margin");
                             }*/
            }
            if (((window.pageYOffset || document.documentElement.scrollTop) + 560) > this.getCoords(elem).top) {
                window.scrollTo(0, this.getCoords(elem).top - 560);

            }

        }

        /* if ((window.pageYOffset || document.documentElement.scrollTop) > 80) {
             window.scrollTo(0, 0);
         }*/
    }
    public getAuthData() {
        return this.httpService.getAuthData();
    }
    public getConfGoogle() {
        return  this.httpService.getConfGoogle();
    }
    public checkFlightDates(list: Array<FlightDate>): boolean {
        for (let i = 0; i < list.length; i++) {
            if (list.length > 1) {
                for (let u = (i + 1); u < list.length; u++) {
                    if (list[i].start.day >= list[u].start.day || list[i].end.day >= list[u].end.day || list[i].end.day === list[u].start.day) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    public getExpensePeriod (dataPeriod:DataPeriod) {
        return  this.httpService.getExpensePeriod({
            dealerShipId: dataPeriod.dealerShipId, productCategoryId: dataPeriod.productCategoryId, productId: dataPeriod.productId,
            startDate: dataPeriod.startDate, endDate: dataPeriod.endDate
        })
    }
    public getExpenseData (id:number) {
        return this.httpService.getExpense(id);
    }
    public setCoop (listExpenses:Expense,data:Coop) {
        listExpenses.coop = data.coop;
        if (!data.coopPercent) {
            listExpenses.coopPercent = 0;
        }
        else {
            listExpenses.coopPercent = data.coopPercent;
        }
        if (!listExpenses.targetBudget) {
            listExpenses.targetBudget = 0;
            listExpenses.coopPercent = 0;
            listExpenses.coop = 0;
        }
    }
    public addProductName(name: string) {
        let h = this.elRef.nativeElement.querySelector(".info-fon-details-up h3");
        h.innerHTML = `${name}  |  Campaign:`;
    }

    private getCoords(elem) { // кроме IE8-
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }
  
    public getLenflightDates(data: Array<Expense>): number {
        let len: number = 0;
        for (let i = 0; i < data.length; i++) {
            len += data[i].flightDate.length;

        }
        return len;
    }
    public getAllBudgets(flightDates: Array<FlightDate>): number {
        let budget: number = 0;
        for (let i = 0; i < flightDates.length; i++) {
            budget += flightDates[i].targetBudget;
        }
        return Math.round(budget * 100) / 100;
    }
    public round (val:number,num:number):number {
       return Math.round((val / num) * num) / num;
    }
    public onInitAddProduct (title:String) {
        document.body.querySelector(".header").classList.remove("m--fixed");
        (<HTMLElement>document.body.querySelector(".header")).style.height = "80px";
        this.elRef.nativeElement.querySelector(".info-fon-details-up h3").innerHTML = `${title} | Campaign:`;
    }
    public onInitClosed() {
        if ((<HTMLElement>document.body.querySelector(".page-actions")).style.display === "none") {//block
            (<HTMLElement>document.body.querySelector(".header")).style.height = "50px";
            document.body.querySelector(".header").classList.add("m--fixed");
        }
        this.elRef.nativeElement.querySelector(".info-fon-details").scrollTo(0, 0);
    }
    public resetPercentages(data: Expense): Expense {
        let out = data;
        for (let u = 0; u < out.flightDate.length; u++) {

            out.flightDate[u].percent = (out.targetBudget === 0) ? 0 : Math.round((out.flightDate[u].targetBudget / out.targetBudget) * 1000) / 10;
        }
        if (out.flightDate.length === 1)  out.flightDate[0].percent = 100;
        let coopPercent:number = Number(out.coop / out.targetBudget * 100);
        out.coopPercent = (coopPercent) ? (this.checkInt(coopPercent)) ? coopPercent : this.round(coopPercent,10) : 0;
        return out;
    }
    public getNewFlightDate (editMode:EditModeInfoExpense) :FlightDate {
        return new FlightDate({ start: { year: editMode.currentDate.getFullYear(), month: editMode.currentDate.getMonth() + 1, day: 1 }, end: { year: editMode.currentDate.getFullYear(), month: editMode.currentDate.getMonth() + 1, day: 32 - new Date(editMode.currentDate.getFullYear(), editMode.currentDate.getMonth(), 32).getDate() }, targetBudget: 0 });
    }
    public updateTitleTable(viewType: string, flightDateIndex: number, expenseIndex: number, dataPeriod: DataPeriod) {
        if (viewType === "daysOfMonth") {

            let data: Array<FlightDate> = this.getFlightDateExpense(expenseIndex);
            if (flightDateIndex >= data.length) return;

            this.broadcaster.broadcast("updateTitleTable", new updateTitleTable (data[flightDateIndex].start.day,data[flightDateIndex].end.day) );

        }
        if (viewType === "monthsOfQuarter" || viewType === "monthsOfYear") {
            this.broadcaster.broadcast("updateTitleTable", new updateTitleTable (dataPeriod.start,dataPeriod.end));

        }
    }
    public ClosedMask(flightDateIndex: number) {
        let elements = document.body.querySelectorAll(".flight-date-item");
        elements[flightDateIndex].querySelector(".start-flight").classList.remove("flight-edit", "flight-edit-start");
        elements[flightDateIndex].querySelector(".end-flight").classList.remove("flight-edit");
        this.elRef.nativeElement.querySelector(".modal-edit-mask").style.display = "none";
        this.elRef.nativeElement.querySelector(".edit-flight-date-modal").style.display = "none";
    }
    public resetdaysMonth(daysMonth: Array<DayMonth>, index: number): any {
        let outdaysMonth = daysMonth;
        for (let i = 0; i < outdaysMonth.length; i++) {
            if (outdaysMonth[i].selected !== "no-hover") {
                outdaysMonth[i].selected = (index !== (-1) && index === i) ? "select-date" : "";
            }

        }
        return outdaysMonth;
    }

    public showExpense() {
        (<HTMLElement>document.body.querySelector(".header__right .settings")).style.display = "none";
        (<HTMLElement>document.body.querySelector(".header__right .history")).style.display = "none";
        (<HTMLElement>document.body.querySelector(".closed-info")).style.display = "block";
        (<HTMLElement>document.body.querySelector(".header__notifications")).style.display = "none";
        (<HTMLElement>document.body.querySelector(".header__left")).style.display = "none";
        (<HTMLElement>document.body.querySelector(".header__top-left .border-line")).style.display = "none";


        document.body.querySelector("header").classList.remove("m--fixed");


    }
    public getTableIndex(event):number
    {
        let parent = this.getParentElement(event.target);//event.target;
        let input = parent.querySelector(".edit-velue");
        return Number(input.getAttribute("tabindex"));
    }
    public EditValueExpense(event,expense:Expense,  targetBudget: boolean = false,actualBudget: boolean = false, coop:boolean = false) {
      
        let parent = this.getParentElement(event.target);//event.target;
        let input = parent.querySelector(".edit-velue");
        let p = parent.querySelector("p");
       
       
        p.style.display = "none";
        input.style.display = "block";
        parent.classList.add("info-fon-details-select");
      
        let number = (targetBudget || actualBudget || coop) ? true : false;
        if (number && input.value === "0") {
            input.value = "";
        }
      
        if (parent.classList.contains("info-fon-details-down-item") && parent.classList.contains("no-text")) {
            parent.classList.remove("no-text");
        }

      
        input.focus();
        input.onblur = (e) => {

           
            p.style.display = "block";
            input.style.display = "none";
            parent.classList.remove("info-fon-details-select");
            if (number) {
               
                
                if (!e.target.value || e.target.value === "") {
                    e.target.value = 0;
                }
                expense.coop = (coop) ? Number((Number(input.value) * expense.targetBudget / 100)) : Number((Number(expense.coopPercent) * expense.targetBudget / 100));
                let coopPercent:number =  Number(expense.coop / expense.targetBudget * 100);
                expense.coopPercent = (coop) ? (this.checkInt(coopPercent)) ? coopPercent : this.round(coopPercent,10) : expense.coopPercent;
                if (targetBudget && !expense.targetBudget)
                {
                  expense.targetBudget = 0;
                }
                if (targetBudget && input.value === 0) {

                    expense.coop = 0;
                    expense.coopPercent = 0;
                }
             if (actualBudget && !expense.actualBudget)
              {
                expense.actualBudget = 0;
              }

               this.broadcaster.broadcast("getCoop", new Coop(Number(expense.coop),expense.coopPercent));
            this.broadcaster.broadcast("setflightDate", new setflightDate (expense.flightDate,expense.targetBudget) );

            }

            input.onblur = null;
            $(input).off('keyup');
        };

        if (!parent.classList.contains("info-fon-details-down-item")) {
            input.addEventListener(
                "keyup", (e) => {
                    if (coop) {
                        this.generalService.ValidatePercent(e);
                    } else {
                        this.generalService.ValidateMoney(e);
                    }
                  
                    if (e.keyCode === 13) {
                        p.style.display = "block";
                        input.style.display = "none";
                        parent.classList.remove("info-fon-details-select");
                        if (number) {

                            this.broadcaster.broadcast("setflightDate", new setflightDate (expense.flightDate, expense.targetBudget));

                        }
                        $(input).off('keyup');
                    }

                });
        }

    }
    public checkInt (number):boolean {
        if ( parseInt(number) != number )
        {
return false;
        }
        return true;
    }
    private getParentElement(p) {
        let parent = p;
        while (!parent.classList.contains("info-fon-val-item")) {

            parent = parent.parentNode;

        }

        return parent;
    }
   
    public setWidthParams(widthPhoto: number, result: number) {
        this.elRef.nativeElement.querySelector(".info-fon-photo").style.width = `${widthPhoto}px`;
        this.elRef.nativeElement.querySelector(".info-fon-details").style.width = `${result}px`;
    }
    public getDefaultExpense(settings: any): any {
        return {
            targetBudget: 0,
            flightDate: [{ start: { year: settings.year, month: settings.month, day: 1 }, end: { year: settings.year, month: settings.month, day: 32 - new Date(settings.year, parseInt(settings.month) - 1, 32).getDate() }, targetBudget: 0, percent: 100 }],
            campaign: "",
            strategy: "",
            description: "",
            notes: "",
            coop: 0,
            creativeId: "",
            folders: [],
            coopPercent: 0,
            actualBudget:0

        }
    }
    public ClosedInfoExpense(parentId) {
        this.elRef.nativeElement.querySelector(".preloader-mini").style.display = "none";
        this.elRef.nativeElement.querySelector(".info-fon-body").style.display = "block";
        this.elRef.nativeElement.querySelector(".google-disk").style.display = "none";
        (<HTMLElement>document.body.querySelector(".header__left")).style.display = "block";
        (<HTMLElement>document.body.querySelector(".header__top-left .border-line")).style.display = "block";
        (<HTMLElement>document.body.querySelector(".clients-list")).style.display = "block";
        (<HTMLElement>document.body.querySelector(".settings-file")).style.display = "flex";
        document.body.querySelector(".table_control-edit-pannel").classList.remove("info-expense-enabled");
        if (parentId !== "") {
            let table_object = document.body.querySelector(`.main_table__row[data-line="${parentId}"]`).querySelectorAll(".table_object");
            for (let i = 0; i < table_object.length; i++) {
                table_object[i].classList.remove("table_object-selected");
            }

            document.body.querySelector(`.main_table__row[data-line="${parentId}"]`).classList.remove("main_table__row-selected");

        }
        let menuLine = document.body.querySelectorAll(".menu-line");
        for (let u = 0; u < menuLine.length; u++) {
            menuLine[u].classList.remove("menu-line-disabled", "menu-line-selected");
        }
        let productLine = document.body.querySelectorAll(".product-line");
        for (let s = 0; s < productLine.length; s++) {
            productLine[s].classList.remove("product-line-disabled", "product-line-selected");
        }
        let main_table__row = document.body.querySelectorAll(".main_table__row");
        for (let a = 0; a < main_table__row.length; a++) {
            main_table__row[a].classList.remove("main_table__row-disabled");
        }
        (<HTMLElement>document.body.querySelector(".header__right .settings")).style.display = "inline-block";
        (<HTMLElement>document.body.querySelector(".header__right .history")).style.display = "inline-block";
        (<HTMLElement>document.body.querySelector(".closed-info")).style.display = "none";

        let table_object_all = document.body.querySelectorAll(".table_object");
        for (let d = 0; d < table_object_all.length; d++) {
            table_object_all[d].classList.remove("table_object-selected");
        }
        (<HTMLElement>document.body.querySelector(".header__notifications")).style.display = "block";

        let list = document.body.querySelectorAll(".js-table-line");
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains("menu-line-no-click")) {
                list[i].classList.remove("menu-line-no-click");
            }

        }
        if (document.body.querySelector(".left-main").classList.contains("scroll-fixed-left-without-graph-start") || document.body.querySelector(".left-main").classList.contains("scroll-fixed-left-without-graph")) {
            document.body.querySelectorAll(".container")[1].classList.remove("main-margin");
        }
    }
    public updateTargetBudget(flightDates:Array<FlightDate>, budget: number) {

        let outflightDates: Array<FlightDate> = flightDates;

        for (let i = 0; i < outflightDates.length; i++) {
            outflightDates[i].targetBudget = Math.round(((budget * outflightDates[i].percent) / 100) * 100) / 100;
        }
        return outflightDates;
    }
   
    public setDefaultExpense(data: any) {

        this.DefaultExpenses.push(JSON.parse(JSON.stringify(data)));

    }
    public getDefaultListCreative(len: number) {
        let out = [];
        for (let i = 0; i < len; i++) {
            out.push([]);
        }
        return out;
    }
    public findDifferences(data: any): boolean {

        for (let i = 0; i < this.DefaultExpenses.length; i++) {
            if (this.DefaultExpenses[i].targetBudget !== data[i].targetBudget
                || this.DefaultExpenses[i].campaign !== data[i].campaign
                || this.DefaultExpenses[i].strategy !== data[i].strategy
                || this.DefaultExpenses[i].description !== data[i].description
                || this.DefaultExpenses[i].notes !== data[i].notes
                || this.DefaultExpenses[i].coop !== data[i].coop
                || this.DefaultExpenses[i].creativeId !== data[i].creativeId
                || this.findDifferencesflightDate(this.DefaultExpenses[i].flightDate, data[i].flightDate) === true) {
                    this.broadcaster.broadcast("Confirm", new Confirm("data","closedInfoExpense"));
                return true;
            }
        }
        return false;
    }
    private findDifferencesflightDate(defaultDate: any, currentDate: any): boolean {
        if (defaultDate.length !== currentDate.length) return true;
        for (let i = 0; i < defaultDate.length; i++) {
            if (defaultDate[i].start.day !== currentDate[i].start.day || defaultDate[i].end.day !== currentDate[i].end.day || defaultDate[i].targetBudget !== currentDate[i].targetBudget) return true;
        }
        return false;

    }
    public getFlightDateExpense(index: number): Array<FlightDate> {
        return this.DefaultExpenses[index].flightDate;
    }
    public getExpense(index: number): Expense {
        return this.DefaultExpenses[index];
    }

}