/**
 * Created by Макс on 16.10.2017.
 */
import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { SingService } from '../../service/sing.service';
import { ActionsCategories } from './services/ActionsCategories.service';
import { TableHeader } from './services/table-header.service';
import { TableData } from '../../class/table-data';
import { CountExpense } from '../class/count-expense';
import { Color } from './class/color';
import { Rights } from 'app/components/class/rights';
import { updateCategories } from 'app/components/class/broadcaster/update-categories';
import { DataPeriod } from 'app/components/class/rtb/table/data-period';
import { updateInfoItem } from 'app/components/class/broadcaster/update-info-item';
import { setWidthParams } from 'app/components/class/broadcaster/info-expense/set-width-params';
import { CategoryDirectory } from 'app/components/class/directory/category';
import { toggleCategory } from 'app/components/class/broadcaster/toggle-category';
import { Category } from 'app/components/class/category/category';
import { Subscription } from 'rxjs';

@Component({
    selector: 'table-comp',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.min.css', 'table.component.css'], //left-menu/app.component.css
    providers: [ActionsCategories, TableHeader]
})
export class TableComponent {

    public color: string = '#000000';
    sub: any;
    colors:Color = new Color();
    weeks: any = [];
    viewTable: number = 0;
    tableData: TableData = new TableData();
    infoMode: boolean = false;
    cellWidth: number = 50;
    daysArray: any = [];
    days: number = 0;
    rights: Rights;
    Table = {
        categories: []
    };
    ListProducts: any;
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    Auth: boolean = false;
    group: number = 0;
    titlesHeader: any;
    mediaCategories: any = [];
    blockEditMedia: boolean = false;
   
    constructor(
        private broadcaster: Broadcaster,
        private elRef: ElementRef,
        private httpService: SingService,
        private Actions: ActionsCategories,
        private Titles: TableHeader,
        private ref: ChangeDetectorRef,
        private router: Router,
        private route: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        if (this.httpService.getAuthData().loggedIn === "") return;
        this.rights = this.httpService.getAuthData().identity.rights;
      
            this.buildTable();

            this.Actions.setRights(this.httpService.getAuthData().identity.rights);
            let updateTableData:Subscription = this.broadcaster.on<any>('updateTableData').subscribe(data => {
                this.buildTableHead();
            });
            this.Actions.subBroadcaster.add(updateTableData);
           let updateMediaCategories:Subscription = this.broadcaster.on<any>('updateMediaCategories').subscribe((data:Array<string>) => {

                this.mediaCategories = data;
            });
            this.Actions.subBroadcaster.add(updateMediaCategories);
            let settDefaultColorCatForAdd:Subscription = this.broadcaster.on<any>('settDefaultColorCatForAdd').subscribe(data => {

                this.colors.list[0] = data.color;
                this.colors.color = data.color.replace('#','');
                this.colors.selectItem = 0;
            });
            this.Actions.subBroadcaster.add(settDefaultColorCatForAdd);
            let setListProducts:Subscription = this.broadcaster.on<any>('setListProducts').subscribe((list:Array<CategoryDirectory>) => {
                this.ListProducts = list;
            });
            this.Actions.subBroadcaster.add(setListProducts);
            let toggleCategory:Subscription = this.broadcaster.on<any>('toggleCategory').subscribe((data:toggleCategory) => {
                let index:number = this.Table.categories.findIndex(item => String(item.id).split('categories-').join('') === String(data.id).split('categories-').join(''));
                this.Table.categories[index].open = data.open;
             
            });
            this.Actions.subBroadcaster.add(toggleCategory);
            let updateSettings:Subscription = this.broadcaster.on<any>('updateSettings').subscribe((data:TableData) => {
                this.tableData.setData(data.settings);
                this.viewTable = (this.tableData.settings.viewType === 'daysOfMonth') ? 0 : (this.tableData.settings.viewType === 'monthsOfQuarter') ? 1 : 2;
                this.titlesHeader = [];
                this.weeks = [];
                this.buildTableHead();
            });
            this.Actions.subBroadcaster.add(updateSettings);
            let setBlockMediaCategory:Subscription = this.broadcaster.on<boolean>('setBlockMediaCategory').subscribe(data => {
                this.blockEditMedia = data;
            });
            this.Actions.subBroadcaster.add(setBlockMediaCategory);
            let updateCategoriesEasy:Subscription = this.broadcaster.on<any>('updateCategoriesEasy').subscribe((data:Array<Category>) => {
                if (data !== null) {
                 
                    let countExpense:CountExpense = new CountExpense();
                    countExpense.updateCounts(data);
                    this.Table.categories = data;
                    this.broadcaster.broadcast('updateCountExpenses', countExpense);
                    this.ref.detectChanges();
                }
            });
            this.Actions.subBroadcaster.add(updateCategoriesEasy);
            let updateCategories:Subscription = this.broadcaster.on<any>('updateCategories').subscribe((data:updateCategories) => {

                if (data.weeks !== undefined) {
                    this.weeks = this.Actions.getWeeks(data.weeks);
                }
                if (data.categories !== null) {
                    if (this.tableData.settings.viewType === 'daysOfMonth') {
                        this.days = 32 - new Date(this.tableData.settings.year, this.tableData.settings.month - 1, 32).getDate();
                        this.daysArray = this.getNumber(this.days);
                    }
                    if (this.tableData.settings.viewType === 'monthsOfQuarter') {
                        this.days = this.weeks.length;
                        this.daysArray = this.getNumber(this.days);
                    }
                    if (this.tableData.settings.viewType === 'monthsOfYear') {
                        this.days = 12;
                        this.daysArray = this.getNumber(this.days);
                    }

                    this.cellWidth = ((document.body.clientWidth - 350) / this.days);
                    this.colors.margin = (this.cellWidth / 2);
                   
                    this.Actions.setWidth(this.cellWidth);
                    this.Actions.setwidthTable(this.days);
                    let result: any = this.Actions.updateCategories(data, this.tableData, this.cellWidth, this.tableData.settings.viewType, this.days, this.mediaCategories);
                    this.Table.categories = result.categories;
                    let countExpense = new CountExpense();
                    countExpense.updateCounts(data);
                    this.broadcaster.broadcast('updateCountExpenses', countExpense);
                    this.broadcaster.broadcast('setWidthParams', new setWidthParams(this.days,this.cellWidth ));

                    this.ref.detectChanges();

                }
            });
            this.Actions.subBroadcaster.add(updateCategories);
            this.buildTableHead();
     
        
      /*  this.broadcaster.on<any>('updateInfoItem').subscribe((data:updateInfoItem) => {
            if (data.id === null) {
                this.infoMode = false;
            }
        });*/
 
        $('body').on('click', '.table_object', (e) => {
            let currentLine: any;
            if (e.target.getAttribute('dataobjectid') === null) {
                if ($(e.target).parents('.table_object').attr('dataobjectid') === undefined) {
                    return
                }
                else {
                    currentLine = $(e.target).parents('.table_object')[0];
                }
            }
            else {
                currentLine = e.target;
            }
console.log('currentLine',currentLine);
            let parentId = currentLine.getAttribute('parent-data-line');
            console.log('parentId',parentId);
            let parent = this.elRef.nativeElement.querySelector(`.main_table__row[data-line='${parentId}']`);
            let menuParent = document.body.querySelector(`.js-table-line[data-line='${this.Table.categories[Number(parent.getAttribute('categories-id'))].id}']`);
            if (menuParent.classList.contains('menu-line-no-click')) return;
            if (this.infoMode) {
                this.Actions.RemoveClassnoActiveProducts('.menu-line', ['menu-line-disabled', 'menu-line-selected']);
                this.Actions.RemoveClassnoActiveProducts('.product-line', ['product-line-disabled', 'product-line-selected']);
                this.Actions.RemoveClassnoActiveProducts('.main_table__row', ['main_table__row-disabled']);
                this.Actions.RemoveClassnoActiveProducts('.table_object', ['table_object-selected']);
            }
            this.Actions.RemoveClassTableObjectSelect(parent);
            this.Actions.setDisabledProducts(parentId, parent.getAttribute('categories-id'));
            document.body.querySelector(`.js-table-line[data-line='${parentId}'] .menu-line`).classList.add('menu-line-selected');
            if (document.body.querySelector(`.js-table-line[data-line='${parentId}'] .product-line`) !== null) {
                document.body.querySelector(`.js-table-line[data-line='${parentId}'] .product-line`).classList.add('product-line-selected');
            }
            parent.classList.add('main_table__row-selected');
            this.Actions.setTableLineDisabled(parentId);
            let dataId = { i: parseInt(parent.getAttribute('categories-id')), u: parseInt(parent.getAttribute('products-id')), g: parseInt(parent.getAttribute('subproducts-id')) }
            let dataPeriod: DataPeriod;
            document.body.querySelector(".table_control-edit-pannel").classList.add("info-expense-enabled");
            if (this.tableData.settings.viewType === 'monthsOfQuarter' || this.tableData.settings.viewType === 'monthsOfYear') {
                dataPeriod = this.Actions.getDataPeriod(currentLine, this.Table, this.weeks, this.tableData.settings, dataId);

            }
            this.router.navigate(['expense'], { relativeTo: this.route });
            this.broadcaster.broadcast('updateInfoItem', new updateInfoItem( {
                id: currentLine.getAttribute('dataobjectid'),
                index: currentLine.getAttribute('flightDate-index'),
                currentLine: currentLine,
                month: Number(this.tableData.settings.month) - 1,
                parentId: parentId,
                year: this.tableData.settings.year,
                dataId: dataId,
                productCategoryId: (this.Table.categories[dataId.i].id).split('categories-').join(''),
                dataPeriod: dataPeriod,
                settings: this.tableData.settings,
                productId: (this.Table.categories[dataId.i].products[dataId.u].id).split('products-').join(''),
                product: (dataId.g === (-1)) ? this.Table.categories[dataId.i].products[dataId.u] : this.Table.categories[dataId.i].products[dataId.u].subproducts[dataId.g],
                productTitle: this.Table.categories[dataId.i].products[dataId.u].title,
                action: (dataId.g === (-1) ? 'edit-product' : 'edit'),
                productsLen: (dataId.g === (-1) ? this.Table.categories[dataId.i].products[dataId.u].length : this.Table.categories[dataId.i].products[dataId.u].subproducts.length)


            }));
            currentLine.classList.add("table_object-selected");
            this.infoMode = true;
        });
        

      


        this.elRef.nativeElement.querySelector('.information').addEventListener(
            'mouseenter',
            (event) => {
                this.elRef.nativeElement.querySelector('.information-mask .information-body').style.display = 'block';
            }, false);
        this.elRef.nativeElement.querySelector('.information').addEventListener(
            'mouseleave',
            (event) => {
                this.elRef.nativeElement.querySelector('.information-mask .information-body').style.display = 'none';
            }, false);

           let ClosedAddCategory:Subscription = this.broadcaster.on<any>('ClosedAddCategory').subscribe(data => {
this.colors = new Color();
this.colors.margin = (this.cellWidth / 2);
                });
                this.Actions.subBroadcaster.add(ClosedAddCategory);
                
    }
  
    SelectColor(index: number) {
        this.colors.selectItem = index;
        this.color = this.colors.list[index];
        this.colors.color = this.color.substring(1, this.color.length);
      
        this.broadcaster.broadcast('setColorCatefori', {
            color: this.color
        });

    }

    onChangeColor(color: string) {
       
        this.colors.color = color.substring(1, color.length);
    }
    trackById(index, item) {
        return item.id;
    }
    trackByIndex(index, item) {
        return index;
    }
    getCurrentDate() {
        if (this.tableData.settings.viewType === 'daysOfMonth') return `${this.months[this.tableData.settings.month - 1]} ${this.tableData.settings.year}`;
        if (this.tableData.settings.viewType === 'monthsOfQuarter') return `${this.Titles.quarters[this.tableData.settings.quarter - 1]}${String(this.tableData.settings.year).substring(2, 4)}`;
        if (this.tableData.settings.viewType === 'monthsOfYear') return `${this.tableData.settings.year}`;

    }

    cpToggleChange(open: boolean) {
       
        if (!open) {
            this.colors.list.unshift(`#${this.colors.color}`);
            this.colors.list.splice(this.colors.list.length - 1, 1);
         
            this.colors.selectItem = 0;
            this.ref.detectChanges();

            this.broadcaster.broadcast('setColorCatefori', {
                color: `#${this.colors.color}`
            });
        }
    }
    ngOnDestroy() {
       // this.sub.unsubscribe();
       this.Actions.subBroadcaster.unsubscribe();
       window.removeEventListener('resize', this.onResize);
    }

    buildTableHead(): void {

        if (this.tableData.settings.viewType === 'daysOfMonth') {
            this.days = 32 - new Date(this.tableData.settings.year, this.tableData.settings.month - 1, 32).getDate();
            this.daysArray = this.getNumber(this.days);
            this.titlesHeader = this.Titles.getTitles(this.days, this.tableData.settings.year, this.tableData.settings.month);
        }
        if (this.tableData.settings.viewType === 'monthsOfQuarter') {
            this.days = this.weeks.length;
            this.daysArray = this.getNumber(this.days);
        }
        if (this.tableData.settings.viewType === 'monthsOfYear') {
            this.days = 12;
            this.daysArray = this.getNumber(this.days);
            this.titlesHeader = this.Actions.getYears(this.tableData.settings.month, this.tableData.settings.year);
        }

    }
    getNumber(num): any {
        return Array.apply(null, { length: num }).map(Number.call, Number);
    }


    buildTable() {
        this.Actions.myChart = (<HTMLElement>document.querySelector("#myChart"));
        this.Actions.myTrends = (<HTMLElement>document.querySelector("#myTrends"));
        let updateInfoItem:Subscription = this.broadcaster.on<any>('updateInfoItem').subscribe((data:updateInfoItem) => {
            if (data.id === null) 
            {
                this.infoMode = false;
                let chart = document.body.querySelectorAll(".chart");
                if (chart.length !== 0)
                {
                    this.Actions.myChart.style.width = `${(<HTMLElement>chart[0]).offsetWidth + 23}px`;
                    this.Actions.myTrends.style.width = `${(<HTMLElement>chart[1]).offsetWidth + 23}px`;
                }
              
            }
            
        });
        this.Actions.subBroadcaster.add(updateInfoItem);
        window.addEventListener('resize', this.onResize);
    }
    onResize = () => {
        this.cellWidth = ((document.body.clientWidth - 350) / this.days);
        this.colors.margin = (this.cellWidth / 2);
        this.Actions.setWidth(this.cellWidth);
        this.Actions.setwidthTable(this.days);
        let chart = document.body.querySelectorAll(".chart");
        if (chart.length !== 0)
        {
            this.Actions.myChart.style.width = `${(<HTMLElement>chart[0]).offsetWidth + 23}px`;
            this.Actions.myTrends.style.width = `${(<HTMLElement>chart[1]).offsetWidth + 23}px`;
        }
    }
  
}
