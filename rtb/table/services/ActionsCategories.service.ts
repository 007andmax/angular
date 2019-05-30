import { ElementRef, Injectable } from '@angular/core';
import { DataPeriod } from 'app/components/class/rtb/table/data-period';

import { Subscription } from 'rxjs';

@Injectable()
export class ActionsCategories {
    cellWidth: number;
    widthTable: string = "";
    weeksText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
    myChart:HTMLElement;
    myTrends:HTMLElement;
    rights: any = { canManageOwnBudgets: 0 };
    colors = { list: ['#000000', '#f7f7f7', '#f7f7f7', '#f7f7f7', '#f7f7f7'], color: '000000', selectItem: 0, margin: 0 };
    subBroadcaster:Subscription = new Subscription();
    constructor(private elRef: ElementRef) {

    }
    public getDefaultColors() {
        return JSON.parse(JSON.stringify(this.colors));
    }
    public setRights(rights: any) {
        this.rights = rights;
    }
    public setTableLineDisabled(parentId: string) {

        let list = this.elRef.nativeElement.querySelectorAll('.main_table__row');
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute('data-line') !== parentId) {
                list[i].classList.add('main_table__row-disabled');
            }
        }
    }
    public setDisabledProducts(parentId: string, index: string) {

        let list = document.body.querySelectorAll('.js-table-line');
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute('data-line') !== parentId) {
                list[i].querySelector('.menu-line').classList.add('menu-line-disabled');
                if (list[i].getAttribute('categories-id') !== index) {
                    list[i].classList.add('menu-line-no-click');
                }
                if (list[i].querySelector('.product-line') !== null) {
                    list[i].querySelector('.product-line').classList.add('product-line-disabled');
                }

            }
            else {
                count++;
            }

        }

    }
    public RemoveClassTableObjectSelect(parent) {
        let list = parent.querySelectorAll('.table_object');
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('table_object-selected');
        }
    }
    public RemoveClassnoActiveProducts(selector: string, clas: Array<string>) {
        let list = document.body.querySelectorAll(selector);
        for (let i = 0; i < list.length; i++) {
            if (clas.length === 1) {
                list[i].classList.remove(clas[0]);
            }
            else {
                list[i].classList.remove(clas[0], clas[1]);
            }

        }
    }
    public setWidth(data: number) {
        this.cellWidth = data;

    }
    private getLenDays(start: string, end: string): number {
        let s: number = Number(String(start).substring(8, 10));
        let e: number = Number(String(end).substring(8, 10));
        return (e - s) + 1;
    }
    public setwidthTable(data: number) {
        let width: number = this.cellWidth * (data - 1);
        this.widthTable = `${String(width)}px`;
    }

    private updateWidthProductQuarter(cellWidth: number, expenses: any): any {
        let start: number = 14;
        let end: number = 0;
        let subproducts: boolean = false;

        for (let i = 0; i < expenses.length; i++) {
            subproducts = (expenses[i].expenses) ? true : false
            if (!subproducts) {
                if (expenses[i].price > 0) {
                    if (start > expenses[i].start) {
                        start = expenses[i].start;

                    }
                    if (end < expenses[i].end) {
                        end = expenses[i].end;
                    }
                }

            }
            else {
                for (let u = 0; u < expenses[i].expenses.length; u++) {
                    if (expenses[i].expenses[u].price > 0) {
                        if (start > expenses[i].expenses[u].start) {
                            start = expenses[i].expenses[u].start;

                        }
                        if (end < expenses[i].expenses[u].end) {
                            end = expenses[i].expenses[u].end;
                        }
                    }

                }
            }

        }

        let result: number = (end - start);
        result++;
        let width: number = this.cellWidth * result;

        if (result === 0) {
            width = this.cellWidth / 2;
        }
        else {
            width -= this.cellWidth / 2;
        }
        return { width: `${String(width)}px`, start: start };
    }
    private updateWidthObjectContainerQuarter(cellWidth: number, start: number, end: number): string {
        let result: number = (end - start);
        result++;
        let width: number = this.cellWidth * result;
        if (result === 0) {
            width = this.cellWidth / 2;
        }
        else {
            width -= this.cellWidth / 2;
        }

        return `${String(width)}px`;
    }
    private updateWidthObjectContainer(data: number, cellWidth: number): string {
        let width: number = this.cellWidth * (data - 1);
        width = (data === 1) ? 10 : width;// width = (width < 90) ? 90 : width
        return `${String(width)}px`;
    }

    private updateWidthObjectLine(day: number): number {
        let width: number = this.cellWidth * (day - 1) / 2;
        width = (width <= 0) ? 0 : width;
        return width;
    }
    private updateMarginObjectQuarter(start: number, cellWidth: number): string {
        let width: number = ((start + 1) * cellWidth) - (cellWidth * 3 / 4);
        width = (start === 0) ? cellWidth / 4 : width;
        return `${String(width)}px`;
    }
    private updateMarginObject(start: number, cellWidth: number): string {
        let width: number = (start * cellWidth) - (cellWidth / 2);
        return `${String(width)}px`;
    }

    public getDataPeriod(currentLine: any, Table: any, weeks: any, settings: any, dataId: any): DataPeriod {
        let flightDateIndex: number = Number(currentLine.getAttribute('flightDate-index'));
        let start: number = (dataId.g === (-1)) ? Table.categories[dataId.i].products[dataId.u].expenses[flightDateIndex].start : Table.categories[dataId.i].products[dataId.u].subproducts[dataId.g].expenses[flightDateIndex].start;
        let end: number = (dataId.g === (-1)) ? Table.categories[dataId.i].products[dataId.u].expenses[flightDateIndex].end : Table.categories[dataId.i].products[dataId.u].subproducts[dataId.g].expenses[flightDateIndex].end;//Table.categories[indexExpense].expenses[flightDateIndex].end;
        let startDate: string = (settings.viewType === 'monthsOfQuarter') ? weeks[start].start : `${settings.year}-${((start + 1) < 10) ? "0" + (start + 1) : (start + 1)}-01`;
        let endDate: string = (settings.viewType === 'monthsOfQuarter') ? weeks[end].end : `${settings.year}-${((end + 1) < 10) ? "0" + (end + 1) : (end + 1)}-${32 - new Date(settings.year, start, 32).getDate()}`;

        return new DataPeriod( {
            dealerShipId: settings.dealerShipId,
            productCategoryId: String(Table.categories[dataId.i].id).split('categories-').join(''),
            productId: String(Table.categories[dataId.i].products[dataId.u].id).split('products-').join(''),
            startDate: startDate, 
            endDate: endDate,
            start: start, 
            end: end
        });
    }



    public getPrice(x: number): string {
        if (x > 100000) {
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

    private UpdateClassHead(item: any, i: number): string {
        let clas: string = '';
        if (i < 4) {
            clas = ` header-products-${i + 1}`;
        }
        else {
            clas = ' header-products-5';
        }

        if (item.products) {
            return `m--hasSubmenu js-table-line ${clas}`;
        } else {
            if (i !== 0) {
                return 'js-table-line';
            } else {
                return '';
            }
        }
    }
    private getLenDaysSubProduct(subproduct: any): any {
        let start: number = 31;
        let startDate: string = "";
        let end: number = 1;
        for (let g = 0; g < subproduct.length; g++) {
            for (let i = 0; i < subproduct[g].expenses.length; i++) {
                for (let u = 0; u < subproduct[g].expenses[i].flightDate.length; u++) {
                    if (start > Number(String(subproduct[g].expenses[i].flightDate[u].start).substring(8, 10))) {
                        start = Number(String(subproduct[g].expenses[i].flightDate[u].start).substring(8, 10));
                    }
                    if (end < Number(String(subproduct[g].expenses[i].flightDate[u].end).substring(8, 10))) {
                        end = Number(String(subproduct[g].expenses[i].flightDate[u].end).substring(8, 10));
                    }
                }

            }
        }

        return { result: (end - start) + 1, start: start };
    }
    private SetShadow(product: any): string {
        if (product.subproducts) return `${product.class}`;
        return `${product.class} ${(this.rights.canManageOwnBudgets === 0) ? 'menu-shadow-down' : ''}`;
    }
    private UpdateClassSub(item: any): string {
        if (item.subproducts) {
            return 'm--hasSubmenu';
        }
        return '';
    }
    private geFlightDateStart(start: string): number {
        return Number(String(start).substring(8, 10));
    }

    /* public setDays(len: number, TebleHead: any, year: number): any {
         let DaysOut: any = [];
 
         for (let i = 1; i <= len; i++) {
             if (i < 10) {
                 DaysOut.push(`${year}${TebleHead.givenDay.format('-MM-')}0${i}`);
             }
             else {
                 DaysOut.push(`${year}${TebleHead.givenDay.format('-MM-')}${i}`);
             }
 
         }
         return DaysOut;
     }*/
    public getYears(month: number, year: number): any {
        let MonthDay: any = [];
        let count: number = 1;

        for (let i = 0; i < this.months.length; i++) {
            if (i === 0 || i === 3 || i === 6 || i === 9) {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: ((i + 1) === Number(month)) ? 'current_quarter' : '', quarter: `${count}Q` });
                count++;
            }
            else {
                MonthDay.push({ header: `${this.months[i]} ‘${String(year).substring(2, 4)}`, class: ((i + 1) === Number(month)) ? 'current_quarter' : '', quarter: '' });
            }

        }
        return MonthDay;
    }

    public getWeeks(data: any): any {
        let weeks: any = [];
        let moth: string = "";
        for (let i = 0; i < data.length; i++) {
            data[i].month = (data[i].label.substring(0, 3) !== moth) ? `${new Date(data[i].start).getMonth() + 1}M` : '';
            moth = data[i].label.substring(0, 3);
            weeks.push(data[i]);
        }
        return weeks;
    }

    public updateCategories(res: any, settings: any, cellWidth: number, viewType: string, weeks: any, mediaCategories: any): any {
        let data: any = res;
        let TableData: any = settings;

        let ColorCategories: any = (window.localStorage.getItem('colors')) ? JSON.parse(window.localStorage.getItem('colors')) : { list: [] };
        let findCategories: number = 0;
        let countForCat: number = 0;
        let countForPro: number = 0;

        let start: number = 0;
        let end: number = 0;
        let startDate: string = "";

        if (data.categories !== null) {
            var coubt = 0;
            for (var i = 0; i < data.categories.length; i++) {

                startDate = "";
                start = 0;
                end = 0;
                countForCat = 0;
                countForPro = 0;
                data.categories[i].categ = true;
                data.categories[i].categId = i;
                data.categories[i].open = (data.categories[i].open && data.categories[i].open === true) ? true : false;
                let indexMediaCalendar: number = mediaCategories.findIndex(item => item === String(data.categories[i].id).split('categories-').join(''));
                data.categories[i].mediaCategorie = (indexMediaCalendar !== (-1)) ? 1 : 0;

                data.categories[i].id = String(data.categories[i].id).split('categories-').join('');
                findCategories = ColorCategories.list.findIndex(element => String(element.id) === String(data.categories[i].id) && element.client === String(TableData.settings.dealerGroupId));



                if (findCategories === (-1)) {
                    data.categories[i].color = '#000';

                }
                else {
                    data.categories[i].color = ColorCategories.list[findCategories].color;

                }
                data.categories[i].id = `categories-${data.categories[i].id}`;
                data.categories[i].width = this.widthTable;
                data.categories[i].titleShort = (data.categories[i].title.length > 20) ? data.categories[i].title.substring(0, 15) + " ..." : null;
                if (viewType === 'daysOfMonth') {
                    start = 31;
                    end = 1;
                }
                if (viewType === 'monthsOfQuarter' || viewType === 'monthsOfYear') {
                    data.categories[i].count = 0;
                    start = 11;
                    end = 0;
                }
                data.categories[i].priceText = this.getPrice(data.categories[i].price);
                data.categories[i].class = this.UpdateClassHead(data.categories[i], i);


                for (
                    var u = 0;
                    u < data.categories[i].products.length;
                    u++
                ) {

                    data.categories[i].products[u].titleShort = (data.categories[i].products[u].title.length > 30) ? data.categories[i].products[u].title.substring(0, 25) + " ..." : null;

                    data.categories[i].products[u].cat = i;
                    data.categories[i].products[u].id = `products-${String(data.categories[i].products[u].id).split('products-').join('')}`;

                    data.categories[i].products[u].class = this.UpdateClassSub(data.categories[i].products[u]);
                    data.categories[i].products[u].priceText = this.getPrice(data.categories[i].products[u].price);
                    if ((u + 1) === data.categories[i].products.length) {
                        data.categories[i].products[u].class = this.SetShadow(data.categories[i].products[u]);
                    }
                    data.categories[i].products[u].color = data.categories[i].color;
                    if (viewType === 'daysOfMonth') {

                        let resultDataLen = (data.categories[i].products[u].subproducts !== undefined) ? this.getLenDaysSubProduct(data.categories[i].products[u].subproducts) : { result: 0, start: 0 };
                        data.categories[i].products[u].dataLength = resultDataLen.result;
                        data.categories[i].products[u].showLine = true;

                        data.categories[i].products[u].widthContainer = this.updateWidthObjectContainer(data.categories[i].products[u].dataLength, cellWidth);
                        data.categories[i].products[u].margin = this.updateMarginObject(resultDataLen.start, cellWidth);

                    }
                    if (viewType === 'monthsOfQuarter' || viewType === 'monthsOfYear') {

                        data.categories[i].products[u].showLine = (data.categories[i].products[u].price > 0) ? true : false;
                        let result: any = this.updateWidthProductQuarter(cellWidth, (data.categories[i].products[u].expenses === undefined) ? data.categories[i].products[u].subproducts : (data.categories[i].products[u].expenses !== undefined && data.categories[i].products[u].subproducts !== undefined) ? data.categories[i].products[u].subproducts : data.categories[i].products[u].expenses);
                        data.categories[i].products[u].widthContainer = result.width;
                        data.categories[i].products[u].count = 0;

                        data.categories[i].products[u].margin = this.updateMarginObjectQuarter(result.start, cellWidth);

                    }

                    if (data.categories[i].products[u].expenses !== undefined) {
                        let priceExpenses: number = 0;
                        for (let s = 0; s < data.categories[i].products[u].expenses.length; s++) {
                            data.categories[i].products[u].expenses[s].color = data.categories[i].color;
                            if (viewType === 'daysOfMonth') {
                                for (let v = 0; v < data.categories[i].products[u].expenses[s].flightDate.length; v++) {
                                    if (data.categories[i].products[u].expenses[s].flightDate[v].targetBudget > 0) {
                                        countForPro++;
                                        countForCat++;
                                    }


                                    data.categories[i].products[u].expenses[s].flightDate[v].margin = this.updateMarginObject(this.geFlightDateStart(data.categories[i].products[u].expenses[s].flightDate[v].start), cellWidth);
                                    data.categories[i].products[u].expenses[s].flightDate[v].dataLength = this.getLenDays(data.categories[i].products[u].expenses[s].flightDate[v].start, data.categories[i].products[u].expenses[s].flightDate[v].end);
                                    data.categories[i].products[u].expenses[s].flightDate[v].showLine = true;
                                    data.categories[i].products[u].expenses[s].flightDate[v].priceText = this.getPrice(data.categories[i].products[u].expenses[s].flightDate[v].targetBudget);
                                    data.categories[i].products[u].expenses[s].flightDate[v].widthContainer = this.updateWidthObjectContainer(data.categories[i].products[u].expenses[s].flightDate[v].dataLength, cellWidth);
                                    if (start > Number(String(data.categories[i].products[u].expenses[s].flightDate[v].start).substring(8, 10))) {
                                        start = Number(String(data.categories[i].products[u].expenses[s].flightDate[v].start).substring(8, 10));
                                        startDate = data.categories[i].products[u].expenses[s].flightDate[v].start;
                                    }
                                    if (end < Number(String(data.categories[i].products[u].expenses[s].flightDate[v].end).substring(8, 10))) {
                                        end = Number(String(data.categories[i].products[u].expenses[s].flightDate[v].end).substring(8, 10));
                                    }
                                }
                            }
                            if (viewType === 'monthsOfQuarter' || viewType === 'monthsOfYear') {
                                if (data.categories[i].products[u].subproducts !== undefined) {
                                    priceExpenses += data.categories[i].products[u].expenses[s].price;
                                }
                                data.categories[i].count += (data.categories[i].products[u].expenses[s].price > 0) ? data.categories[i].products[u].expenses[s].count : 0;
                                data.categories[i].products[u].expenses[s].margin = this.updateMarginObjectQuarter(data.categories[i].products[u].expenses[s].start, cellWidth);
                                data.categories[i].products[u].expenses[s].showLine = (data.categories[i].products[u].expenses[s].price > 0) ? true : false;
                                data.categories[i].products[u].expenses[s].priceText = this.getPrice(data.categories[i].products[u].expenses[s].price);
                                data.categories[i].products[u].expenses[s].widthContainer = this.updateWidthObjectContainerQuarter(cellWidth, data.categories[i].products[u].expenses[s].start, data.categories[i].products[u].expenses[s].end);

                                if (start > data.categories[i].products[u].expenses[s].start) {
                                    start = data.categories[i].products[u].expenses[s].start;

                                }
                                if (end < data.categories[i].products[u].expenses[s].end) {
                                    end = data.categories[i].products[u].expenses[s].end;
                                }



                            }
                        }

                        if (data.categories[i].products[u].subproducts !== undefined) {
                            data.categories[i].products[u].priceExpenses = priceExpenses;
                            data.categories[i].products[u].priceExpensesText = this.getPrice(priceExpenses);

                        }
                    }

                    if (
                        data.categories[i].products[u].subproducts !==
                        undefined
                    ) {
                        for (
                            var g = 0;
                            g <
                            data.categories[i].products[u].subproducts
                                .length;
                            g++
                        ) {
                            data.categories[i].products[u].subproducts[g].titleShort = (data.categories[i].products[u].subproducts[g].title.length > 30) ? data.categories[i].products[u].subproducts[g].title.substring(0, 25) + " ..." : null;

                            data.categories[i].products[u].subproducts[g].cat = i;
                            data.categories[i].products[u].subproducts[g].id = `subproducts-${String(data.categories[i].products[u].subproducts[g].id).split('subproducts-').join('')}`;
                            data.categories[i].products[u].subproducts[g].priceText = this.getPrice(data.categories[i].products[u].subproducts[g].price);
                            data.categories[i].products[u].subproducts[g].class = '';
                            if ((u + 1) === data.categories[i].products.length && (g + 1) === data.categories[i].products[u].subproducts.length) {
                                data.categories[i].products[u].subproducts[g].class = (this.rights.canManageOwnBudgets === 0) ? 'menu-shadow-down' : '';
                            }

                            let priceSubproducts: number = 0;
                            for (let q = 0; q < data.categories[i].products[u].subproducts[g].expenses.length; q++) {

                                data.categories[i].products[u].subproducts[g].expenses[q].color = data.categories[i].color;
                                if (viewType === 'daysOfMonth') {
                                    for (let h = 0; h < data.categories[i].products[u].subproducts[g].expenses[q].flightDate.length; h++) {
                                        if (data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].targetBudget > 0) {
                                            countForPro++;
                                            countForCat++;
                                        }
                                        data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].margin = this.updateMarginObject(this.geFlightDateStart(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].start), cellWidth);
                                        data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].dataLength = this.getLenDays(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].start, data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].end);
                                        data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].showLine = true;
                                        data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].priceText = this.getPrice(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].targetBudget);
                                        data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].widthContainer = this.updateWidthObjectContainer(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].dataLength, cellWidth);
                                        if (start > Number(String(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].start).substring(8, 10))) {
                                            start = Number(String(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].start).substring(8, 10));
                                            startDate = data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].start;
                                        }
                                        if (end < Number(String(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].end).substring(8, 10))) {
                                            end = Number(String(data.categories[i].products[u].subproducts[g].expenses[q].flightDate[h].end).substring(8, 10));
                                        }
                                    }
                                }
                                if (viewType === 'monthsOfQuarter' || viewType === 'monthsOfYear') {
                                    if (data.categories[i].products[u].expenses !== undefined) {
                                        priceSubproducts += data.categories[i].products[u].subproducts[g].expenses[q].price;

                                    }
                                    data.categories[i].products[u].count += (data.categories[i].products[u].subproducts[g].expenses[q].price > 0) ? data.categories[i].products[u].subproducts[g].expenses[q].count : 0;
                                    data.categories[i].count += (data.categories[i].products[u].subproducts[g].expenses[q].price > 0) ? data.categories[i].products[u].subproducts[g].expenses[q].count : 0;
                                    data.categories[i].products[u].subproducts[g].expenses[q].margin = this.updateMarginObjectQuarter(data.categories[i].products[u].subproducts[g].expenses[q].start, cellWidth);
                                    data.categories[i].products[u].subproducts[g].expenses[q].showLine = (data.categories[i].products[u].subproducts[g].expenses[q].price > 0) ? true : false;
                                    data.categories[i].products[u].subproducts[g].expenses[q].priceText = this.getPrice(data.categories[i].products[u].subproducts[g].expenses[q].price);
                                    data.categories[i].products[u].subproducts[g].expenses[q].widthContainer = this.updateWidthObjectContainerQuarter(cellWidth, data.categories[i].products[u].subproducts[g].expenses[q].start, data.categories[i].products[u].subproducts[g].expenses[q].end);
                                    if (start > data.categories[i].products[u].subproducts[g].expenses[q].start) {
                                        start = data.categories[i].products[u].subproducts[g].expenses[q].start;

                                    }
                                    if (end < data.categories[i].products[u].subproducts[g].expenses[q].end) {
                                        end = data.categories[i].products[u].subproducts[g].expenses[q].end;
                                    }


                                }

                            }

                            if (data.categories[i].products[u].expenses !== undefined) {

                                data.categories[i].products[u].priceSubproducts = priceSubproducts;
                                data.categories[i].products[u].priceSubproductsText = this.getPrice(priceSubproducts);

                            }
                        }
                    }
                }
                end = (end === 1 && start === 31) ? 32 - new Date(TableData.settings.year, Number(TableData.settings.month) - 1, 32).getDate() : end;
                start = (start === 31) ? 1 : start;

                data.categories[i].showLine = (this.updateWidthObjectLine((end - start) + 1) > 0) ? true : false;
                if (viewType === 'daysOfMonth') {

                    data.categories[i].width = this.updateWidthObjectContainer((end - start) + 1, cellWidth);
                    data.categories[i].count = countForCat;
                    data.categories[i].start = (startDate === "") ? `${TableData.settings.year}-${Number(TableData.settings.month) < 10 ? "0" + TableData.settings.month : TableData.settings.month}-01` : startDate;
                    data.categories[i].margin = this.updateMarginObject(start, cellWidth);

                }
                if (viewType === 'monthsOfQuarter' || viewType === 'monthsOfYear') {
                    data.categories[i].width = this.updateWidthObjectContainerQuarter(cellWidth, start, end);
                    data.categories[i].margin = this.updateMarginObjectQuarter(start, cellWidth);
                    data.categories[i].start = start;
                }

            }

            window.localStorage.setItem('colors', JSON.stringify(ColorCategories));
        }
        return {
            categories: data.categories
        };
    }

    public getTableData(data: any): any {

        let infoExpenses: any = {
            categories: 0,
            products: 0,
            campaigns: 0
        }

        for (var i = 0; i < data.categories.length; i++) {

            infoExpenses.categories++;
            for (
                var u = 0;
                u < data.categories[i].products.length;
                u++
            ) {
                infoExpenses.products++;
                data.categories[i].products[u].class = this.UpdateClassSub(data.categories[i].products[u]);
                if ((u + 1) === data.categories[i].products.length) {
                    data.categories[i].products[u].class = this.SetShadow(data.categories[i].products[u]);
                }

                if (
                    data.categories[i].products[u].subproducts !==
                    undefined
                ) {
                    for (
                        var g = 0;
                        g <
                        data.categories[i].products[u].subproducts
                            .length;
                        g++
                    ) {

                        data.categories[i].products[u].subproducts[g].class = '';
                        if ((u + 1) === data.categories[i].products.length && (g + 1) === data.categories[i].products[u].subproducts.length) {
                            data.categories[i].products[u].subproducts[g].class = (this.rights.canManageOwnBudgets === 0) ? 'menu-shadow-down' : '';
                        }
                        for (let q = 0; q < data.categories[i].products[u].subproducts[g].expenses.length; q++) {
                            infoExpenses.campaigns++;
                        }

                    }
                }

            }
        }
        return infoExpenses;
    }

}
