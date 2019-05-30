import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { SingService } from '../../service/sing.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  DatepickerService } from '../../class/datepicker/datepicker.service';
import { Charts } from '../class/charts.service';
import { LeftMenu } from '../../class/leftmenu.service';
import { TableData } from '../../class/table-data';
import { NewProduct } from './class/new-product';
import { CountExpense } from '../class/count-expense';
import { Stats } from './class/stats';
import { ActiveMenu } from '../class/active-menu';
import { IndexExpense } from 'app/components/class/index-expense';
import { responseRtbData } from 'app/components/class/http/res/response-rtb-data';
import { responseListProduct } from 'app/components/class/http/res/response-list-product';
import { responseRemoveExpense } from 'app/components/class/http/res/response-remove-expense';
import { responseSaveExpense } from 'app/components/class/http/res/response-save-expense';
import { responseAddExpense } from 'app/components/class/http/res/response-add-expense';
import { showAddCampaignMode } from 'app/components/class/broadcaster/add-campaign/show-add-campaign-mode';
import { updateCategories } from 'app/components/class/broadcaster/update-categories';
import { updateData } from 'app/components/class/broadcaster/updateData';
import { UpdateListProducts } from 'app/components/class/broadcaster/update-list-products';
import { updateCategoriesAfterRemoveExpense } from 'app/components/class/broadcaster/add-campaign/update-categories-after-remove-expense';
import { AddCampaignInit } from 'app/components/class/broadcaster/add-campaign/add-campaign-init';
import { updateRooftops } from 'app/components/class/broadcaster/update-rooftops';
import { Alert } from 'app/components/class/alert/alert';
import { renameCategori } from 'app/components/class/broadcaster/rename/rename-categori';
import { renameProduct } from 'app/components/class/broadcaster/rename/rename-product';
import { renameSetCategori } from 'app/components/class/broadcaster/rename/rename-set-categori';
import { renameSetProduct } from 'app/components/class/broadcaster/rename/rename-set-product';
import { ItemMenu } from '../context-menu/class/item-menu';
import { Product } from 'app/components/class/product/product';
import { showEditMode } from 'app/components/class/info-expense/show-edit-mode';
import {  ProductEditMode } from '../info/class/product-edit-mode';
import { CreateNewProduct } from 'app/components/class/broadcaster/info-expense/create-new-product';
import { updateExpense } from 'app/components/class/broadcaster/info-expense/update-expense';
import { DealerShip } from 'app/components/class/dealer-ship';
import { Settings } from 'app/components/class/setting';
import { LeftMenuService } from './services/left-menu.service';
import { Rights } from 'app/components/class/rights';
import { Category } from 'app/components/class/category/category';
import { Datepicker } from 'app/components/class/datepicker/datepicker';
import { responseGetСategory } from 'app/components/class/http/res/response-get-category';
import { requestGetCategory } from 'app/components/class/http/req/request-get-category';
import { requestRtbData } from 'app/components/class/http/req/request-get-rtb-data';
import { toggleCategory } from 'app/components/class/broadcaster/toggle-category';
import {  showMediaCalendar } from 'app/components/class/broadcaster/show-media-calendar';
import {  requestGetStats } from 'app/components/class/http/req/request-get-stats';
import {  responseGetStats } from 'app/components/class/http/res/response-get-stats';
import { AddNewProduct } from 'app/components/class/broadcaster/info-expense/add-new-product';
import { removeItemMenu } from 'app/components/class/broadcaster/left-menu/remove-item-menu';
import { responseUpdateCategory } from 'app/components/class/http/res/response-update-category';
import { ColorCategory } from 'app/components/interfaces/category/color-category';
import {Location, LocationStrategy} from '@angular/common';
import { GeneralService } from 'app/components/class/general.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'left-menu-comp',
    templateUrl: 'html/left-menu.component.html',
    styleUrls: ['css/left-menu.component.min.css', 'css/left-menu.component.css'], 
    providers: [DatepickerService, Charts, LeftMenu,LeftMenuService]
})
export class LeftMenuComponent {
   
    
    categories: Array<Category> = [];
    NewProduct: NewProduct = new NewProduct();
    ActiveMenu:ActiveMenu = new ActiveMenu();
    infoExpenses: CountExpense = new CountExpense();
    tableData: TableData = new TableData();
    datepicker: Datepicker = new Datepicker();
    rights: Rights;
    statsPriceText: Stats = new Stats();

    constructor(
        private broadcaster: Broadcaster,
        private elRef: ElementRef,
        private httpService: SingService,
        private route: ActivatedRoute,
        private datepickerActions: DatepickerService,
        private ChartsMini: Charts,
        private leftMenu: LeftMenu,
        private ref: ChangeDetectorRef,
        private action: LeftMenuService,
        private router:Router,
        private location:Location,
        private locationStrategy:LocationStrategy,
     
      
    ) {


    }

    ngOnInit() {


        if (this.httpService.getAuthData().loggedIn === "") return;
        $('[data-toggle="tooltip"]').tooltip({ animation: true });
      
        this.rights = this.httpService.getAuthData().identity.rights;
        this.datepicker = this.datepickerActions.getDatepicker();
        this.action.sub = this.route.params.subscribe(params => {
           
            this.action.getParams = params;
            
         
            console.log('params',params);
            this.tableData.settings.updateDataWithQueryParams(params);
      //   this.action.generalService.setSettigs(params,this.tableData);
          this.datepicker.updateMonths(this.tableData.settings,this.datepickerActions);
       
         // this.action.generalService.UpdateUrlParams(this.tableData,this.location,this.router,this.locationStrategy);
            this.datepicker.range = this.datepickerActions.updateRange(this.tableData.settings.viewType);
            this.datepicker.val = this.datepickerActions.updateValue(this.tableData.settings);
            
           if (!this.action.ListProducts)
           {
            this.action.getListProducts(this.tableData.settings.dealerGroupId)
            .subscribe((data:responseListProduct) => {
              //  if (data.status === 200) {
                  //  let availableTags = [];
                    this.action.ListProducts = data.categories;
                 //   console.log("this.action.ListProducts", this.action.ListProducts);
                    this.broadcaster.broadcast('setListProducts', this.action.ListProducts);
                    this.action.mediaCategories = this.leftMenu.getMediaCategories(this.action.ListProducts);
                    this.broadcaster.broadcast('updateMediaCategories', this.action.mediaCategories);
                    this.leftMenu.setColorCategories(this.action.ListProducts, this.tableData.settings.dealerGroupId);
                    this.getRtbData();
          //      }
            });
           } else {
            this.getRtbData();
           }
            
            });
           let updateCategoriesAfterMediaCategory:Subscription =  this.broadcaster.on<any>('updateCategoriesAfterMediaCategory').subscribe(data => {
                this.action.getСategory( new requestGetCategory ({
                    id: data.productCategoryId, dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year, month: this.tableData.settings.month
                }), this.tableData.settings.viewType)
                    .subscribe((res:responseGetСategory) => {
                      
                      //  if (res.status === 200) {
                            //this.leftMenu.defaultMenu();
                          //  this.leftMenu.defaultStyles();
                            if (data.remove) {
                                this.categories.splice(data.dataId.i, 1);
                            }
                            else {
                                if (res.category) {
                                    this.categories[data.dataId.i] = this.leftMenu.updateExpense(res.category, data.dataId, this.categories);
                                }
                            }
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            this.broadcaster.broadcast('UpdateListProducts', null);
                            this.action.startEditMode = false;
                      //  }

                    });

            });
            this.action.subBroadcaster.add(updateCategoriesAfterMediaCategory);
          let updateRooftops:Subscription =  this.broadcaster.on<any>('updateRooftops').subscribe((data:updateRooftops) => {
                if (data.rooftops.length > 0) {
                  
                    //this.tableData.settings.dealerShipId = this.action.generalService.getDealerShipId(this.tableData.settings);
             //       this.leftMenu.findGetParamRooftop(data.rooftops, this.action.getParams['rooftop'], this.tableData.settings.dealerGroupId);
             
                }
                this.leftMenu.defaultMenu();
                this.leftMenu.defaultStyles();
            });
            this.action.subBroadcaster.add(updateRooftops);
            let setBlockMediaCategory:Subscription = this.broadcaster.on<boolean>('setBlockMediaCategory').subscribe((data:boolean) => {
                this.action.blockEditMedia = data;
            });
            this.action.subBroadcaster.add(setBlockMediaCategory);
            let updateMediaCategories:Subscription = this.broadcaster.on<any>('updateMediaCategories').subscribe((data:Array<String>) => {
                this.action.mediaCategories = data;
            });
            this.action.subBroadcaster.add(updateMediaCategories);
           let showChangeSumm:Subscription = this.broadcaster.on<any>('showChangeSumm').subscribe((data:IndexExpense) => {
               
                if (data === null) return;
                this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode( {
                    action: "ChangeSumm",
                    product: (this.categories[data.i].products[data.u].subproducts) ? this.categories[data.i].products[data.u].subproducts : [this.categories[data.i].products[data.u]],
                    dataId: new IndexExpense(data.i,data.u,data.g),
                    settings: this.tableData.settings,
                    productId: this.categories[data.i].products[data.u].id.split('products-').join(''),
                    productCategoryId: this.categories[data.i].id.split('categories-').join(''),
                    Parentproduct: this.categories[data.i].products[data.u],
                    productsLen: this.categories[data.i].products.length,
                    categori: this.categories,
                }));

            /*    this.broadcaster.broadcast('showEditMode', {
                    action: 'ChangeSumm',
                    product: this.categories[data.i].products[data.u],
                    productsLen: this.categories[data.i].products.length,
                    categori: this.categories,
                    productId: this.categories[data.i].products[data.u].id.split('products-').join(''),
                    productCategoryId: (this.categories[data.i].id).split('categories-').join(''),
                    settings: this.tableData.settings,
                    dataId: { i: parseInt(data.i), u: parseInt(data.u), g: -1 }
                });*/
            });
            this.action.subBroadcaster.add(showChangeSumm);
            let toggleCategory:Subscription = this.broadcaster.on<any>('toggleCategory').subscribe((data:toggleCategory) => {
                let index: number = this.categories.findIndex(item => String(item.id).split('categories-').join('') === String(data.id).split('categories-').join(''));
                this.categories[index].open = data.open;
            });
            this.action.subBroadcaster.add(toggleCategory);
           let renameGetCategori :Subscription = this.broadcaster.on<any>('renameGetCategori').subscribe((data:IndexExpense) => {

                this.broadcaster.broadcast('renameCategori', new renameCategori (data.i,this.categories[data.i]));
            });
            this.action.subBroadcaster.add(renameGetCategori);
           let setDataMediaCalendar:Subscription = this.broadcaster.on<any>('setDataMediaCalendar').subscribe((data:IndexExpense) => {
                this.broadcaster.broadcast('showMediaCalendar', new showMediaCalendar(this.categories[data.i],data));
            });
            this.action.subBroadcaster.add(setDataMediaCalendar);
           let renameGetProduct:Subscription = this.broadcaster.on<any>('renameGetProduct').subscribe((data:IndexExpense) => {

                this.broadcaster.broadcast('renameProduct', new renameProduct(data.u,data.i,this.categories[data.i].products[data.u]) );
            });
            this.action.subBroadcaster.add(renameGetProduct);
            let renameSetCategori:Subscription = this.broadcaster.on<any>('renameSetCategori').subscribe((data:renameSetCategori) => {

                this.categories[data.indexCat].title = data.name;
                this.categories[data.indexCat].titleShort = (this.categories[data.indexCat].title.length > 20) ? this.categories[data.indexCat].title.substring(0, 15) + " ..." : null;

            });
            this.action.subBroadcaster.add(renameSetCategori);
            let renameSetProduct:Subscription = this.broadcaster.on<any>('renameSetProduct').subscribe((data:renameSetProduct) => {

                this.categories[data.indexCat].products[data.indexProduct].title = data.name;
                this.categories[data.indexCat].products[data.indexProduct].titleShort = (this.categories[data.indexCat].products[data.indexProduct].title.length > 30) ? this.categories[data.indexCat].products[data.indexProduct].title.substring(0, 25) + " ..." : null;

            });
            this.action.subBroadcaster.add(renameSetProduct);
            let setstats:Subscription = this.broadcaster.on<any>('setstats').subscribe(req => {
                this.action
                    .getStats(new requestGetStats ({
                        dealerGroupId: this.tableData.settings.dealerGroupId,
                        dealerShipId: this.tableData.settings.dealerShipId,
                        year: this.tableData.settings.year,
                        month: this.tableData.settings.month,
                        quarter: this.tableData.settings.quarter,
                    }), this.tableData.settings.viewType)
                    .subscribe((data:responseGetStats) => {
                            this.broadcaster.broadcast('updateData', new updateData(data.stats));
                    });
            });
            this.action.subBroadcaster.add(setstats);
            let updateCountExpenses:Subscription = this.broadcaster.on<any>('updateCountExpenses').subscribe((data:CountExpense) => {
                this.infoExpenses = data;
               
            });
            this.action.subBroadcaster.add(updateCountExpenses);
           let AddNewProduct:Subscription = this.broadcaster.on<any>('AddNewProduct').subscribe((data:AddNewProduct) => {
                this.action.getСategory(new requestGetCategory({
                    id: data.productCategoryId, dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year, month: this.tableData.settings.month
                }), this.tableData.settings.viewType)
                    .subscribe((res:responseGetСategory) => {
                      //  if (res.status === 200) {
                            this.categories = this.leftMenu.addProduct(this.categories, this.action.ListProducts, res.category);
                           // this.leftMenu.defaultMenu();
                          //  this.leftMenu.defaultStyles();
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            this.broadcaster.broadcast('UpdateListProducts', null);
                            this.action.startEditMode = false;
                            if (data.add_comapin) {

                                let indexCat: number = this.categories.findIndex(item => String(data.productCategoryId) === String(item.id).split('categories-').join(''));
                                let indexProduct: number = this.categories[indexCat].products.findIndex(item => String(data.productId) === String(item.id).split('products-').join(''));
                                if (indexProduct > (-1)) {
                                    this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode( {
                                        action: "show",
                                        product: (this.categories[indexCat].products[indexProduct].subproducts) ? this.categories[indexCat].products[indexProduct].subproducts : [this.categories[indexCat].products[indexProduct]],
                                        dataId: new IndexExpense(indexCat,indexProduct,(this.categories[indexCat].products[indexProduct].subproducts) ? 0 : -1),
                                        settings: this.tableData.settings,
                                        productId: this.categories[indexCat].products[indexProduct].id.split('products-').join(''),
                                        productCategoryId: this.categories[indexCat].id.split('categories-').join('')
                                    }));
                                }

                            }
                    //    }
                    });
            });
            this.action.subBroadcaster.add(AddNewProduct);
            let AddCampaign:Subscription =  this.broadcaster.on<any>('AddCampaign').subscribe((data:AddCampaignInit) => {
                this.action.getСategory(new requestGetCategory({
                    id: this.categories[data.dataId.i].id.split('categories-').join(''), dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year, month: this.tableData.settings.month
                }), this.tableData.settings.viewType)
                    .subscribe((res:responseGetСategory) => {
                      //  if (res.status === 200) {
                          //  this.leftMenu.defaultMenu();
                          //  this.leftMenu.defaultStyles();

                            this.categories[data.dataId.i] = this.leftMenu.updateExpense(res.category, data.dataId, this.categories);
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            if (data.UpdateListProducts) {
                                this.broadcaster.broadcast('UpdateListProducts', null);
                            }

                            this.action.startEditMode = false;
                            if (data.add_comapin && data.add_comapin === true) {

                                this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode ({
                                    action: "show",
                                    product: (this.categories[data.dataId.i].products[data.dataId.u].subproducts) ? this.categories[data.dataId.i].products[data.dataId.u].subproducts : [this.categories[data.dataId.i].products[data.dataId.u]],
                                    dataId: data.dataId,
                                    settings: this.tableData.settings,
                                    productId: this.categories[data.dataId.i].products[data.dataId.u].id.split('products-').join(''),
                                    productCategoryId: this.categories[data.dataId.i].id.split('categories-').join('')
                                }));


                            }
                     //   }

                    });

            });
            this.action.subBroadcaster.add(AddCampaign);
           let updateExpensePeriod:Subscription = this.broadcaster.on<any>('updateExpensePeriod').subscribe((data:IndexExpense) => {

                let req:requestGetCategory = new requestGetCategory ( {
                    id: this.categories[data.i].id.split('categories-').join(''), dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year, quarter: this.tableData.settings.quarter
                });
                this.action.getСategory(req, this.tableData.settings.viewType)
                    .subscribe((res:responseGetСategory) => {
                       // if (res.status === 200) {

                         //   this.leftMenu.defaultMenu();
                        //    this.leftMenu.defaultStyles();
                            this.categories[data.i] = this.leftMenu.updateExpense(res.category, data, this.categories);
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            this.action.startEditMode = false;
                     //   }

                    });

            });
            this.action.subBroadcaster.add(updateExpensePeriod);
            let setColorCatefori:Subscription = this.broadcaster.on<any>('setColorCatefori').subscribe(data => {
                this.action.color = data.color;
            });
            this.action.subBroadcaster.add(setColorCatefori);
            let updateExpense:Subscription =  this.broadcaster.on<any>('updateExpense').subscribe((data:updateExpense) => {

                this.action.getСategory(new requestGetCategory ({
                    id: this.categories[data.dataId.i].id.split('categories-').join(''), dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year, month: this.tableData.settings.month
                }), this.tableData.settings.viewType)
                    .subscribe((res:responseGetСategory) => {
                       // if (res.status === 200) {
                            this.categories[data.dataId.i] = this.leftMenu.updateExpense(res.category, data.dataId, this.categories);
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            if (data.add_comapin && data.add_comapin === true) {



                                this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode( {
                                    action: "show",
                                    product: (this.categories[data.dataId.i].products[data.dataId.u].subproducts) ? this.categories[data.dataId.i].products[data.dataId.u].subproducts : [this.categories[data.dataId.i].products[data.dataId.u]],
                                    dataId: data.dataId,
                                    settings: this.tableData.settings,
                                    productId: this.categories[data.dataId.i].products[data.dataId.u].id.split('products-').join(''),
                                    productCategoryId: this.categories[data.dataId.i].id.split('categories-').join('')
                                }));


                            }
                  //      }

                    });

            });
            this.action.subBroadcaster.add(updateExpense);
            let updateCategoriesAfterRemoveExpense:Subscription = this.broadcaster.on<any>('updateCategoriesAfterRemoveExpense').subscribe((data:updateCategoriesAfterRemoveExpense) => {

                let result = this.leftMenu.removeExpense(data.data, this.categories, data.res);
                this.categories = result.categories;
                if (result.updateTable) {
                    this.infoExpenses.products = (this.infoExpenses.products - 1);
                }
                else {
                    this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                }

            });
            this.action.subBroadcaster.add(updateCategoriesAfterRemoveExpense);
           let updateActiveMenu:Subscription = this.broadcaster.on<any>('updateActiveMenu').subscribe((data:ActiveMenu) => {
                this.ActiveMenu = this.ChartsMini.UpdateSessionChart(data, this.ActiveMenu);
            });
            this.action.subBroadcaster.add(updateActiveMenu);
           let updateCategoryes:Subscription = this.broadcaster.on<any>('updateCategories').subscribe((data:updateCategories) => {
                this.categories = data.categories;
                if (data.weeks !== undefined) {
                    this.action.weeks = data.weeks;
                }
                if (window.localStorage.getItem("media_category_id")) {
                    let indexCat = this.categories.findIndex(item => window.localStorage.getItem("media_category_id") === String(item.id).split('categories-').join(''));

                    if (indexCat > (-1)) {
                        this.broadcaster.broadcast('showMediaCalendar', new showMediaCalendar (this.categories[indexCat],new IndexExpense(indexCat,-1,-1)) );
                        window.localStorage.removeItem("media_category_id");
                    }

                }
            });
            this.action.subBroadcaster.add(updateCategoryes);
            let updateDatas:Subscription = this.broadcaster.on<any>('updateData').subscribe((data:updateData) => {
            
                this.statsPriceText.updateData(data.stats);
                this.action.stats = data.stats;
                this.ChartsMini.chartMini('Sessions', this.action.stats.sessions, this.ActiveMenu, this.tableData.settings.viewType, this.action.weeks);
                this.ChartsMini.chartMini('Leads', this.action.stats.leads, this.ActiveMenu, this.tableData.settings.viewType, this.action.weeks);
                this.ChartsMini.chartMini('Sales', this.action.stats.sales, this.ActiveMenu, this.tableData.settings.viewType, this.action.weeks);
                this.ChartsMini.chartMini('Cpl', this.action.stats.cpl, this.ActiveMenu, this.tableData.settings.viewType, this.action.weeks);
                this.ChartsMini.chartMini('Cps', this.action.stats.cps, this.ActiveMenu, this.tableData.settings.viewType, this.action.weeks);
                this.ChartsMini.UpdateColor("Sessions", this.ActiveMenu.sessions);
                this.ChartsMini.UpdateColor("Leads", this.ActiveMenu.leads);
                this.ChartsMini.UpdateColor("Sales", this.ActiveMenu.sales);
                this.ChartsMini.UpdateColor("Cpl", this.ActiveMenu.cpl);
                this.ChartsMini.UpdateColor("Cps", this.ActiveMenu.cps);
            });
            this.action.subBroadcaster.add(updateDatas);
            let UpdateListProducts:Subscription = this.broadcaster.on<any>('UpdateListProducts').subscribe((list:UpdateListProducts) => {
                this.action.getListProducts(this.tableData.settings.dealerGroupId)
                    .subscribe((data:responseListProduct) => {
                   
                     //   if (data.status === 200) {
                            this.action.ListProducts = data.categories;
                           

                            for (let i = 0; i < this.categories.length; i++) {
                                if (this.categories[i].id === undefined) return;
                                let availableTags = this.leftMenu.UpdateAutoComplete(this.action.ListProducts, this.categories[i]);
                                this.SetCatComplete(availableTags, this.categories[i].id);
                            }
                            this.broadcaster.broadcast('setListProducts',this.action.ListProducts);
                            this.action.mediaCategories = this.leftMenu.getMediaCategories(this.action.ListProducts);
                         
                            this.broadcaster.broadcast('updateMediaCategories',this.action.mediaCategories);
                            if (list !== null && list.action && list.action === 'sortCategory') {
                                this.categories = this.leftMenu.sortCategory(this.categories, this.action.ListProducts);
                                this.broadcaster.broadcast('updateCategoriesEasy',  this.categories);
                            }

                            if (list !== null && list.action && list.action === 'updateCategories') {
                                //    let product = this.categories[list.catIndex].products[list.productIndex];
                                // console.log("this.categories[list.catIndex].products[list.productIndex]", this.categories[list.catIndex].products[list.productIndex]);
                                this.categories[list.NextcatIndex].products.push(this.categories[list.catIndex].products[list.productIndex]);
                                this.categories[list.catIndex].price -= this.categories[list.catIndex].products[list.productIndex].price;
                                this.categories[list.NextcatIndex].price += this.categories[list.catIndex].products[list.productIndex].price;
                                this.categories[list.catIndex].price = (this.categories[list.catIndex].price >= 0) ? this.categories[list.catIndex].price : 0;

                                this.categories[list.catIndex].products.splice(list.productIndex, 1);
                                this.categories[list.NextcatIndex].products = this.leftMenu.sortProduct(this.categories[list.NextcatIndex].products, this.action.ListProducts, this.categories[list.NextcatIndex].id);
                                if (this.categories[list.catIndex].products.length === 0) {
                                    this.categories.splice(list.catIndex, 1);
                                }
                                //    $(`.js-table-line[data-line=${}]`)
                              //  this.leftMenu.defaultMenu();
                             //   this.leftMenu.defaultStyles();
                                this.broadcaster.broadcast('setstats', null);
                                this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories,this.action.weeks));
                                this.ref.detectChanges();


                            }
                            if (list !== null && list.action && list.action === 'sortProduct') {
                                this.categories[list.catIndex].products = this.leftMenu.sortProduct(this.categories[list.catIndex].products, this.action.ListProducts, this.categories[list.catIndex].id);
                                this.broadcaster.broadcast('updateCategoriesEasy',this.categories
                                );
                            }
                        
                            if (list !== null && list.action && list.action === 'addCategori') {
                                this.leftMenu.setColorCategories(this.action.ListProducts, this.tableData.settings.dealerGroupId);
                                this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories,this.action.weeks));
                                this.ref.detectChanges();
                                this.action.startEditMode = false;
                              
                                if (list.nextStep && list.nextStep === 'showMediaCategory') {
                                    this.broadcaster.broadcast('setDataMediaCalendar', new IndexExpense (list.i));
                                }

                            }
                            this.NewProduct.setList(this.action.ListProducts, this.categories);
                            this.onInitAddCategori();
                      //  }
                    });
            });
            this.action.subBroadcaster.add(UpdateListProducts);
            let setEditMode:Subscription = this.broadcaster.on<any>('setEditMode').subscribe((data:ItemMenu) => {
                this.SelectActionMode(data);
            });
            this.action.subBroadcaster.add(setEditMode);
            let CreateNewProduct:Subscription = this.broadcaster.on<any>('CreateNewProduct').subscribe((dataProduct:CreateNewProduct) => {
                this.action.addExpense(dataProduct.expense)
                    .subscribe((res:responseAddExpense) => {
                       // if (res.status === 200) {
                            this.httpService.getListProducts(this.tableData.settings.dealerGroupId)
                                .subscribe((list:responseListProduct) => {
                               //     if (list.status === 200) {
                                        this.action.ListProducts = list.categories;
                                        this.broadcaster.broadcast('setListProducts', this.action.ListProducts);
                                        this.action.mediaCategories = this.leftMenu.getMediaCategories(this.action.ListProducts);
                                        this.broadcaster.broadcast('updateMediaCategories',this.action.mediaCategories);
                                        this.NewProduct.setList(this.action.ListProducts, this.categories);
                                        for (let i = 0; i < this.categories.length; i++) {
                                            if (this.categories[i].id === undefined) return;
                                          
                                            let availableTags = this.leftMenu.UpdateAutoComplete(this.action.ListProducts, this.categories[i]);
                                            this.SetCatComplete(availableTags, this.categories[i].id);
                                        }
                                        this.categories = this.leftMenu.createProduct(this.categories, dataProduct, res, this.action.ListProducts);

                                     //   this.leftMenu.defaultMenu();
                                     //   this.leftMenu.defaultStyles();
                                        this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories) );
                                        this.broadcaster.broadcast('updateData', new updateData(res.stats));
                                        this.action.startEditMode = false;
                                        if (dataProduct.add_comapin) {
                                            

                                            let indexCat: number = this.categories.findIndex(item => String(dataProduct.expense.productCategoryId) === String(item.id).split('categories-').join(''));
                                            let indexProduct: number = this.categories[indexCat].products.findIndex(item => String(dataProduct.expense.productId) === String(item.id).split('products-').join(''));
                                            if (indexProduct > (-1)) {
                                                this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode( {
                                                    action: "show",
                                                    product: (this.categories[indexCat].products[indexProduct].subproducts) ? this.categories[indexCat].products[indexProduct].subproducts : [this.categories[indexCat].products[indexProduct]],
                                                    dataId: new IndexExpense(indexCat,indexProduct,(this.categories[indexCat].products[indexProduct].subproducts) ? 0 : -1),
                                                    settings: this.tableData.settings,
                                                    productId: this.categories[indexCat].products[indexProduct].id.split('products-').join(''),
                                                    productCategoryId: this.categories[indexCat].id.split('categories-').join('')
                                                }));
                                            }

                                        }
                                 //   }
                                });
                      //  }
                    });
            });
            this.action.subBroadcaster.add(CreateNewProduct);
           let updateSettings:Subscription =  this.broadcaster.on<any>('updateSettings').subscribe((data:TableData) => {
                this.tableData.setData(data.settings);
                this.action.setSettingLocalStorage(data);
                this.action.startEditMode = false;
                let right: any = this.httpService.getAuthData().identity.rights;
                this.broadcaster.broadcast('setBlockMediaCategory', this.leftMenu.checkRightsMediaCategory(right, this.tableData));
            });
            this.action.subBroadcaster.add(updateSettings);
        let scrollToAddProduct:Subscription =  this.broadcaster.on<any>('scrollToAddProduct').subscribe((data:IndexExpense) => {
            let element = this.elRef.nativeElement.querySelector(`.tc__menu_item[data-line=${this.categories[data.i].id}] .add-product`);
          this.action.onInitscrollToAddProduct(element);
            this.onInitAddProduct(element, true);
        });
        this.action.subBroadcaster.add(scrollToAddProduct);
        let removeItemMenu:Subscription =  this.broadcaster.on<any>('removeItemMenu').subscribe((data:removeItemMenu) => {
            if (data.action === "remove-category") {
                if (this.categories[data.data.i].products.length === 0) {
                    this.categories.splice(data.data.i, 1);
                    this.broadcaster.broadcast('updateCategoriesEasy', this.categories);
                    this.broadcaster.broadcast('UpdateListProducts', null);
                    return;
                }

                if (this.categories[data.data.i].mediaCategorie === 1) {
                    let dataRemove = {
                        year: this.tableData.settings.year,
                        month: this.tableData.settings.month,
                        dealerGroupId: this.tableData.settings.dealerGroupId,
                        productCategoryId: this.categories[data.data.i].id.split('categories-').join(''),
                        fullDelete: "1"
                    };

                    this.httpService.removeMediaCategory(dataRemove)
                        .subscribe(res => {
                            if (res.status === 200) {
                                this.categories.splice(data.data.i, 1);
                                this.broadcaster.broadcast('updateCategoriesEasy',this.categories);
                                this.broadcaster.broadcast('UpdateListProducts', null);
                            }
                        });
                    return;

                }
                let dataRemove = {
                    year: this.tableData.settings.year,
                    month: this.tableData.settings.month,
                    dealerShipId: this.tableData.settings.dealerShipId,
                    productCategoryId: this.categories[data.data.i].id.split('categories-').join('')
                };
                this.httpService.removeCategory(dataRemove)
                    .subscribe(res => {
                        if (res.status === 200) {
                            this.categories.splice(data.data.i, 1);
                            this.broadcaster.broadcast('updateCategoriesEasy', this.categories);
                            this.broadcaster.broadcast('UpdateListProducts', null);
                        }
                    });

                return;
            }
            if (data.action === "remove-product") {
                let dataRemove = {
                    year: this.tableData.settings.year, month: this.tableData.settings.month,
                    dealerShipId: this.tableData.settings.dealerShipId,
                    productId: this.categories[data.data.i].products[data.data.u].id.split('products-').join('')
                }
                this.httpService.removeProduct(dataRemove)
                    .subscribe(res => {
                        if (res.status === 200) {
                            let result = this.leftMenu.removeProduct(this.categories, data);
                            this.categories = result.categories;
                         //   this.leftMenu.defaultMenu();
                        //    this.leftMenu.defaultStyles();
                            this.infoExpenses.products = (this.infoExpenses.products - 1);

                            this.broadcaster.broadcast('updateData', new updateData(res.data.stats));
                            this.broadcaster.broadcast('UpdateListProducts', null);
                        }
                    });
                return;
            }
            let id: number = (parseInt(data.data.g) === (-1)) ? this.categories[data.data.i].products[data.data.u].expenses[0].id : this.categories[data.data.i].products[data.data.u].subproducts[data.data.g].expenses[0].id;
            if (parseInt(data.data.g) !== (-1) && this.categories[data.data.i].products[data.data.u].subproducts.length === 1) {
                let dataUpdate = {
                    id: this.categories[data.data.i].products[data.data.u].subproducts[data.data.g].expenses[0].id,
                    targetBudget: 0,
                    flightDate: [],
                    campaign: "",
                    strategy: "",
                    description: "",
                    notes: "",
                    coop: 0,
                    creativeId: ""
                };
                this.httpService.saveExpense(dataUpdate)
                    .subscribe((res:responseSaveExpense) => {
                     
                          
                            let result = this.leftMenu.convertSubProductInProduct(this.action.ListProducts, {data:res});
                           
                            this.categories[data.data.i] = result;
                         
                          //  this.leftMenu.defaultMenu();
                         //   this.leftMenu.defaultStyles();

                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                            this.broadcaster.broadcast('updateData', new updateData(res.stats));
                            this.action.startEditMode = false;
                  
                    });
                return;
            }

            this.httpService.removeExpense(id, false)
                .subscribe((res:responseRemoveExpense) => {
                   // if (res.status === 200) {
                        let result = this.leftMenu.removeExpense(data.data, this.categories, res);
                        this.categories = result.categories;
                        if (result.updateTable) {
                            this.infoExpenses.products = (this.infoExpenses.products - 1);
                        }
                        else {
                            this.broadcaster.broadcast('updateCategories', new updateCategories(this.categories));
                        }
                        this.broadcaster.broadcast('updateData', new updateData(res.stats));
                        this.broadcaster.broadcast('UpdateListProducts', null);
                    });
                
              //  });



        });
        this.action.subBroadcaster.add(removeItemMenu);
        this.elRef.nativeElement.querySelector('.add-categori-icon').addEventListener(
            'click',
            (event) => {
                this.leftMenu.CloseCategori();
            }, false);
        this.elRef.nativeElement.querySelector('.add-categori-hit').addEventListener(
            'click',
            (event) => {

                let parent = this.leftMenu.getParentElement(event.target, 'add-categori');
                parent.querySelector('.add-categori-hit span').style.display = 'none';
                parent.querySelector('.add-categori-hit input').style.display = 'block';
                parent.querySelector('.add-categori-hit .plus').style.display = 'none';

                let input = parent.querySelector('.add-categori-hit input');
                input.focus();
                parent.classList.add('active-add-categoti');

                (<HTMLElement>this.elRef.nativeElement.querySelector('.paint-bucket')).style.display = 'block';

                (<HTMLElement>document.body.querySelector('.add-categori-body')).style.display = 'flex';
                (<HTMLElement>document.body.querySelector('.add-categori-icon')).style.display = 'block';


            }, false);
        document.querySelector(".datepicker-info").addEventListener(
            'click',
            (event) => {

                $('.datepicker-fon').fadeToggle(200);
                this.datepickerActions.UpdateChartVal();
            }, false);
        this.leftMenu.ToggleLabels();
        document.body.addEventListener('mouseup', (event) => {
            this.leftMenu.setPositionMouse(event.pageX, event.pageY);

        });

    }
getRtbData() {
    this.action
    .getRtbData(new requestRtbData({
        dealerGroupId: this.tableData.settings.dealerGroupId,
        dealerShipId: this.tableData.settings.dealerShipId,
        year: this.tableData.settings.year,
        month: this.tableData.settings.month,
        quarter: this.tableData.settings.quarter,
        viewType: this.tableData.settings.viewType,
    }))
    .subscribe((data:responseRtbData) => {
      
     //  if (data.status === 200) {
           this.action.setRooftop(data.rooftops,this.tableData.settings);
           console.log('this.tableData',JSON.parse(JSON.stringify(this.tableData)));
            this.broadcaster.broadcast('updateMediaCategories',data.mediaCategories);
            this.broadcaster.broadcast('updateSettings', this.tableData);
            this.broadcaster.broadcast('updateRooftops', new updateRooftops(data.rooftops,data.stats.channels));
            this.broadcaster.broadcast('updateCategories', new updateCategories(data.categories,data.weeks));
            this.broadcaster.broadcast('updateData', new updateData(data.stats));
            if (data.categories.length === 0) {
                this.broadcaster.broadcast('stopPreloader', false);
            }
            if (this.rights.canManageOwnBudgets === 1) {
                this.AdminMode();
            }
   //    }
    });
}
    onInitAddCategori() {
       
        $("#add-categori").autocomplete({
            source: this.NewProduct.list,
            select: (event, ui) => {
               
                if (ui.item === undefined) return;
                this.NewProduct.categoriName = ui.item.value;
            
                let indexCategori: number = this.action.ListProducts.findIndex(item => item.name === this.NewProduct.categoriName);
                if (indexCategori !== (-1)) {
                    let indexCat: number = this.action.mediaCategories.findIndex(item => item === String(this.action.ListProducts[indexCategori].productCategoryId));
                    if (indexCat !== (-1)) {
                        (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked = true;
                    }
                    else {
                        (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked = false;
                    }
                    this.broadcaster.broadcast('settDefaultColorCatForAdd', {
                        color: this.action.ListProducts[indexCategori].color,

                    });
                    this.action.color = this.action.ListProducts[indexCategori].color;
                }
            },
            response: (event, ui) => {
                let indexCategori: number = this.action.ListProducts.findIndex(item => item.name === event.target.value);

                if (indexCategori !== (-1)) {
                    let indexCat: number = this.action.mediaCategories.findIndex(item => item === String(this.action.ListProducts[indexCategori].productCategoryId));
                    if (indexCat !== (-1)) {
                        (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked = true;
                    }
                    else {
                        (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked = false;
                    }
                    this.broadcaster.broadcast('settDefaultColorCatForAdd', {
                        color: this.action.ListProducts[indexCategori].color,

                    });
                    this.action.color = this.action.ListProducts[indexCategori].color;
                }
                else {
                    (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked = false;

                }
            }
        });
    }
    onInitAddProduct(event: any, scroll: boolean = false) {
        this.leftMenu.closedAllAddProduct();
        let parent = (scroll) ? this.leftMenu.getParentElement(event, 'add-product') : this.leftMenu.getParentElement(event.target, 'add-product');
        let input = parent.querySelector('input');
        let span = parent.querySelector('span');
        let button = parent.querySelector('button');
        let closed = parent.querySelector('.closed');
        span.style.display = 'none';
        input.style.display = 'block';
        button.style.display = 'block';
        closed.style.display = 'block';
        input.focus();

        this.NewProduct.element = input;
        if (this.action.closedAddProductEventListener !== null)
        {
            closed.removeEventListener('click',this.action.closedAddProductEventListener );
            this.action.closedAddProductEventListener  = null;
        }
       
        this.action.closedAddProductEventListener = (e) => {
            button.style.display = 'none';
            closed.style.display = 'none';
            this.NewProduct.name = "";
            span.style.display = 'block';
            input.style.display = 'none';
            input.value = "";
        }
        
        closed.addEventListener(
            'click', this.action.closedAddProductEventListener, false);
            if (this.action.initAddProductEventListener !== null)
            {
                button.removeEventListener('click',this.action.initAddProductEventListener);
                this.action.initAddProductEventListener = null;
            }
       
        this.action.initAddProductEventListener = (e) => {
            if (input.value !== "") {
                this.onInitAddProductShowEditExpense(input);
                button.style.display = 'none';
                closed.style.display = 'none';
                this.NewProduct.name = "";
                span.style.display = 'block';
                input.style.display = 'none';
                input.value = "";
            }
        };
        button.addEventListener(
            'click', this.action.initAddProductEventListener, false);
            $(input).off('click');
      //  input.removeEventListener('click');
      
    }
    onInitAddProductShowEditExpense(input: HTMLInputElement) {


       
        let productIndex: number = (-1);
        let parent = this.leftMenu.getParentElement(input, 'tc__submenu_item');
        //    console.log(parent.getAttribute('categories-id'));
        let catIndex: number = this.action.ListProducts.findIndex(element => String(element.productCategoryId) === String(this.categories[parent.getAttribute('categories-id')].id).split('categories-').join(''));
        productIndex = this.action.ListProducts[catIndex].products.findIndex(element => element.name === input.value);
        if (productIndex === (-1)) {
            this.broadcaster.broadcast('showEditMode', new showEditMode ({
                action: 'create-new-product',
                product: new Product({ title: input.value }),
                categori: this.action.ListProducts[catIndex],
                settings: this.tableData.settings,
                title: input.value,
            }));
        }
        else {
            this.broadcaster.broadcast('showEditMode', new showEditMode ({
                action: 'add-new-product',
                product: new ProductEditMode(this.action.ListProducts[catIndex].products[productIndex].name,this.action.ListProducts[catIndex].products[productIndex].productId) ,
                categori: this.action.ListProducts[catIndex],
                settings: this.tableData.settings,
                title: this.action.ListProducts[catIndex].products[productIndex].name,
                dataId: {}
            }));

            //   this.leftMenu.ClosedCreateProduct();
            this.NewProduct.title = "";
            this.NewProduct.selectedList = true;
        }



    }
    AdminMode() {
        this.elRef.nativeElement.querySelector('.table_control-edit-pannel').style.display = 'flex';
        //  $(".tc__menu,.tc__submenu").sortable();
        $(".tc__menu").sortable();
        $(".tc__submenu").sortable({
            connectWith: ".tc__submenu",
            items: ".tc__submenu_item:not(.add-product)"
        }).disableSelection();
       // $(".tc__subsubmenu").sortable();
        
        /* $(".tc__submenu").sortable({
            cancel: ".one-product-disabled",
            connectWith: ".tc__submenu"
        }).disableSelection();*/


        document.body.addEventListener(
            'click',
            (event: any) => {
                if (event.target.getAttribute('id') === 'add-product') {

                    let list = document.body.querySelectorAll('.ui-autocomplete');
                    for (let i = 0; i < list.length; i++) {
                        (<HTMLElement>list[i]).style.display = 'none';
                    }
                    let productIndex: number = (-1);
                    let parent = this.leftMenu.getParentElement(this.NewProduct.element, 'tc__submenu_item');
                    let catIndex: number = this.action.ListProducts.findIndex(element => String(element.productCategoryId) === String(this.categories[parent.getAttribute('categories-id')].id).split('categories-').join(''));
                    productIndex = this.action.ListProducts[catIndex].products.findIndex(element => element.name.indexOf(this.NewProduct.name) !== (-1));

                    this.broadcaster.broadcast('showEditMode', new showEditMode ({
                        action: 'create-new-product',
                        product: new Product({ title: this.NewProduct.name }),
                        categori: this.action.ListProducts[catIndex],
                        settings: this.tableData.settings,
                        title: this.NewProduct.name,
                        productCategoryId: this.action.ListProducts[catIndex].productCategoryId,
                    }));

                    this.NewProduct.name = "";
                }
            }, false);



        document.querySelector(".save-categori").addEventListener(
            'click',
            (event) => {

                /*   if (this.NewProduct.selectedList) {
                       if (this.leftMenu.checkProduct(this.NewProduct, this.categories) === true) {
                           this.broadcaster.broadcast('showAlert', {
                               message: "Product with this name already exist",
                           });
                           return;
                       }
                       this.elRef.nativeElement.querySelector('.table_control-edit-choose').style.display = 'none';
                       let productIndex: number = (-1);
                       let catIndex: number = this.action.ListProducts.findIndex(element => element.name === this.NewProduct.select);
                       this.broadcaster.broadcast('showEditMode', {
                           action: 'create-new-product',
                           product: { title: this.NewProduct.name },
                           categori: this.action.ListProducts[catIndex],
                           settings: this.tableData.settings,
                           dataId: {}
                       });
                       this.elRef.nativeElement.querySelector('#tags').value = "";
                   }
                   else {*/
              

                if (this.NewProduct.categoriName === "") return;
              
                let isMedia: boolean = (<HTMLInputElement>document.body.querySelector('.table_categories[data-line="add-categori"] #add-categori-value')).checked;
               
                let HaveCategory: number = this.action.ListProducts.findIndex(element => element.name === this.NewProduct.categoriName);
                let indexCategori: number = this.categories.findIndex(element => element.title === this.NewProduct.categoriName);

                if (indexCategori === (-1) && HaveCategory !== (-1)) {
                    let data:ColorCategory = {
                        id: this.action.ListProducts[HaveCategory].productCategoryId,
                        color: this.action.color
                    };
                    if (this.action.blockEditMedia) {

                        this.httpService.setColorCategory(data)
                            .subscribe((res:responseUpdateCategory) => {
                                
                                    this.requestGetCategory(HaveCategory, false);
                                
                            });
                    } else {
                        this.httpService.setMediaCategory(this.action.ListProducts[HaveCategory].productCategoryId, (isMedia) ? 1 : 0)
                            .subscribe(res => {
                                if (res.status === 200) {
                                    this.httpService.setColorCategory(data)
                                        .subscribe((res:responseUpdateCategory) => {
                                           
                                                this.requestGetCategory(HaveCategory, isMedia);
                                            
                                        });

                                }
                            });
                    }
                    return;
                }
                if (HaveCategory !== (-1)) {
                    this.broadcaster.broadcast('showAlert', new Alert ("Cetegory with this name already exist") );

                    return;
                }
                if (this.action.blockEditMedia) {
                    this.httpService.CreateCategory(this.tableData.settings.dealerGroupId, this.NewProduct.categoriName, this.action.color)
                        .subscribe(data => {
                            if (data.status === 200) {
                                this.leftMenu.CloseCategori();
                                this.NewProduct.categoriName = "";

                                this.categories.push(new Category({
                                    id: data.data.productCategoryId,
                                    title: data.data.name,
                                    price: 0,
                                    ordinal: parseInt(data.data.ordinal),
                                    products: []
                                }));

                             //   this.leftMenu.defaultMenu();
                             //   this.leftMenu.defaultStyles();
                                this.categories.sort(function (a, b) {
                                    return a.ordinal - b.ordinal;
                                });
                                this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'addCategori' }));
                                this.NewProduct.title = "";
                                this.NewProduct.selectedList = true;
                            }
                        });
                }
                else {
                    this.httpService.CreateCategory(this.tableData.settings.dealerGroupId, this.NewProduct.categoriName, this.action.color)
                        .subscribe(data => {
                            if (data.status === 200) {
                               
                                this.httpService.setMediaCategory(data.data.productCategoryId, (isMedia) ? 1 : 0)
                                    .subscribe(res => {
                                      
                                        if (res.status === 200) {
                                            this.leftMenu.CloseCategori();
                                            this.NewProduct.categoriName = "";

                                            this.categories.push(new Category({
                                                id: data.data.productCategoryId,
                                                title: data.data.name,
                                                price: 0,
                                                ordinal: parseInt(data.data.ordinal),
                                                products: []
                                            }));

                                         //   this.leftMenu.defaultMenu();
                                          //  this.leftMenu.defaultStyles();
                                            this.categories.sort(function (a, b) {
                                                return a.ordinal - b.ordinal;
                                            });
                                            if (isMedia) {
                                                let indexCat: Number = this.categories.findIndex(item => String(data.data.productCategoryId) === String(item.id).split('categories-').join(''));
                                                this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'addCategori', nextStep: 'showMediaCategory', i: indexCat }));

                                            }
                                            else {
                                                this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'addCategori' }));

                                            }


                                        }
                                    });

                                this.NewProduct.title = "";
                                this.NewProduct.selectedList = true;
                            }
                        });
                }

            });


        this.UpdateListProducts();

    }
    requestGetCategory(HaveCategory: number, isMedia: boolean) {

        this.httpService.getCategori(this.action.ListProducts[HaveCategory].productCategoryId, false)
            .subscribe(data => {
                if (data.status === 200) {
                    this.leftMenu.CloseCategori();
                    this.NewProduct.categoriName = "";
                    this.categories.push(new Category({
                        id: data.data.productCategoryId,
                        title: data.data.name,
                        price: 0,
                        ordinal: parseInt(data.data.ordinal),
                        products: []
                    }));

                  //  this.leftMenu.defaultMenu();
                 //   this.leftMenu.defaultStyles();
                    this.categories.sort(function (a, b) {
                        return a.ordinal - b.ordinal;
                    });
                   
                    if (isMedia) {
                        let indexCat: Number = this.categories.findIndex(item => String(data.data.productCategoryId) === String(item.id).split('categories-').join(''));
                        this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'addCategori', nextStep: 'showMediaCategory', i: indexCat }));

                    }
                    else {
                        this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'addCategori' }));

                    }

                }
            });
    }
    UpdateListProducts() {
        this.NewProduct.setList(this.action.ListProducts, this.categories);
        this.NewProduct.select = this.action.ListProducts[0].name;
        this.onInitAddCategori();
      
        $.widget("custom.catcomplete", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                var that = this,
                    currentCategory = "";
                ul.prepend("<span id='add-product'>Add product</span>")
                $.each(items, function (index, item) {
                    var li;
                  
                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });
            }
        });
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === undefined) return;
           
            let availableTags = this.leftMenu.UpdateAutoComplete(this.action.ListProducts, this.categories[i]);
            this.SetCatComplete(availableTags, this.categories[i].id);
        }

    }

    SetCatComplete(availableTags: any, id: string) {
        //console.log(this.elRef.nativeElement.querySelector(`.js-table-line[data-line=${id}] .add-product input`));
        /*  (<HTMLElement>this.elRef.nativeElement.querySelector(`.js-table-line[data-line=${id}] .add-product input`)).addEventListener(
              'keydown', (e: any) => {
                  if (e.target.value !== "") {
                      this.NewProduct.name = e.target.value;
                  }
                  console.log("e.target.value", e.target.value);
                  console.log("this.NewProduct.name", this.NewProduct.name);
                  this.NewProduct.element = e.target;
                  if (e.keyCode === 13) {
                      let productIndex: number = (-1);
                      let parent = this.leftMenu.getParentElement(e.target, 'tc__submenu_item');
                      console.log(parent.getAttribute('categories-id'));
                      let catIndex: number = this.action.ListProducts.findIndex(element => String(element.productCategoryId) === String(this.categories[parent.getAttribute('categories-id')].id).split('categories-').join(''));
                      productIndex = this.action.ListProducts[catIndex].products.findIndex(element => element.name.indexOf(e.target.value) !== (-1));
  
                      this.broadcaster.broadcast('showEditMode', {
                          action: 'create-new-product',
                          product: { title: e.target.value },
                          categori: this.action.ListProducts[catIndex],
                          settings: this.tableData.settings,
                          title: e.target.value,
                          dataId: {}
                      });
                      e.target.value = "";
                      this.NewProduct.name = "";
                  }
              });*/
        $(`.js-table-line[data-line=${id}] .add-product input`).catcomplete({
            delay: 0,
            source: availableTags,
            select: (event, ui) => {

                if (ui.item === undefined) return;
                let productIndex: number = (-1);
                let catIndex: number = this.action.ListProducts.findIndex(element => element.name === ui.item.category);
                productIndex = this.action.ListProducts[catIndex].products.findIndex(element => element.name.indexOf(ui.item.label) !== (-1));
                this.broadcaster.broadcast('showEditMode', {
                    action: 'add-new-product',
                    product: new ProductEditMode(this.action.ListProducts[catIndex].products[productIndex].name, this.action.ListProducts[catIndex].products[productIndex].productId ),
                    categori: this.action.ListProducts[catIndex],
                    settings: this.tableData.settings,
                    title: this.action.ListProducts[catIndex].products[productIndex].name,
                });

                //   this.leftMenu.ClosedCreateProduct();
                this.NewProduct.title = "";
                this.NewProduct.selectedList = true;
                this.leftMenu.closedAllAddProduct();
            },
            response: (event, ui) => {
              
                this.NewProduct.name = event.target.value;
              
            }
        });

    }
    trackByIndex(index, item) {
        return index;
    }
    trackById(index, item) {
        return item.id;
    }
    callOnLastIteration() {
        if (this.action.startEditMode) return;
        this.action.startEditMode = true;
        this.broadcaster.broadcast('stopPreloader', false);
        if (this.rights.canManageOwnBudgets === 0) return;
        try {
            $(".tc__menu").off("sortupdate");
            $(".tc__submenu").off("sortupdate");
         //   $(".tc__subsubmenu").off("sortupdate");
            $(".tc__menu,.tc__submenu").sortable("destroy");
        } catch (error) {
            //   console.log("error", error);
        }

        let sortPart = false;

        $(".tc__menu").sortable();
        $(".tc__submenu").sortable({
            connectWith: ".tc__submenu",
            items: ".tc__submenu_item:not(.add-product)"
        }).disableSelection();
     //   $(".tc__subsubmenu").sortable();
        
        /* $(".tc__submenu").sortable({
            cancel: ".one-product-disabled",
            connectWith: ".tc__submenu"
        }).disableSelection();*/
        this.UpdateListProducts();

        $(".tc__menu").on("sortupdate", (event, ui) => {

            if (sortPart) return;
            if (ui.item[0].getAttribute('data-line').indexOf("products") !== (-1)) return;
            sortPart = true;

            this.httpService.sortCategory(ui.item[0].getAttribute('data-line').split('categories-').join(''), this.categories[$(ui.item).index()].ordinal)
                .subscribe(data => {
                    if (data.status === 200 && data.data.moved === 1) {
                        sortPart = false;
                        this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'sortCategory' }));

                    }
                });


        });
        $(".tc__submenu").on("sortupdate", (event, ui) => {
            if (sortPart) return;
            sortPart = true;
            let currentCategoryProduct = ui.item[0].getAttribute('categories-id');
            let indexProductCategory = ui.item[0].getAttribute('products-id');
            let newCategoryProduct = ui.item[0].parentNode.parentNode.getAttribute('categories-id');
            let catIndex = ui.item[0].parentNode.parentNode.getAttribute('categories-id');//ui.item[0].getAttribute('categories-id')
            let catId:number = Number(this.categories[catIndex].id.split('categories-').join(''));
            let position = (currentCategoryProduct === newCategoryProduct) ? this.categories[catIndex].products[$(ui.item).index()].ordinal : (this.categories[catIndex].products[$(ui.item).index()] !== undefined) ? this.categories[catIndex].products[$(ui.item).index()].ordinal : this.categories[catIndex].products[0].ordinal + 1; //this.categories[catIndex].products[$(ui.item).index()].ordinal
            this.httpService.sortProduct(ui.item[0].getAttribute('data-line').split('products-').join(''), position, catId)
                .subscribe(data => {
                    if (data.status === 200) {
                        sortPart = false;
                        if (currentCategoryProduct !== newCategoryProduct) {

                            $(ui.item[0]).remove();
                            this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts({ action: 'updateCategories', productIndex: indexProductCategory, catIndex: currentCategoryProduct, NextcatIndex: newCategoryProduct }));
                        }
                        else {
                            this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts( { action: 'sortProduct', catIndex: catIndex }));
                        }
                    }
                });
        });
        $(".tc__submenu").on("sortstop", (event, ui) => {

          
            let pisitionMouser = this.leftMenu.getPositionMouse();
            let listCords = this.leftMenu.getCordCategories(this.categories);
          
            let indexProductCategory = ui.item[0].getAttribute('products-id');
            let currentCategoryProduct = ui.item[0].getAttribute('categories-id');
            let index = listCords.findIndex(element => pisitionMouser.y > element.top && pisitionMouser.y < (element.top + 100));
            if (index !== (-1)) {
               
                let catId:number = Number(listCords[index].id.split('categories-').join(''));
                let caIndex = this.categories.findIndex(element => element.id === listCords[index].id);
                let productIndex = (this.categories[caIndex].products.length - 1);
                let position = (this.categories[caIndex].products[productIndex].ordinal + 1);
                this.httpService.sortProduct(ui.item[0].getAttribute('data-line').split('products-').join(''), position, catId)
                    .subscribe(data => {
                        if (data.status === 200) {
                           
                            $(ui.item[0]).remove();
                            this.broadcaster.broadcast('UpdateListProducts', new UpdateListProducts ({ action: 'updateCategories', productIndex: indexProductCategory, catIndex: currentCategoryProduct, NextcatIndex: caIndex }));

                        }
                    });
            }
        });

      /*  $(".tc__subsubmenu").on("sortupdate", (event, ui) => {
            if (sortPart) return;
            sortPart = true;
            let CategoryIndex = ui.item[0].getAttribute('categories-id');
            let ProductIndex = ui.item[0].getAttribute('products-id');
          
           let position = this.categories[CategoryIndex].products[ProductIndex].subproducts[$(ui.item).index()].ordinal;
            this.httpService.sortExpense(ui.item[0].getAttribute('data-line').split('subproducts-').join(''), position)
                .subscribe(data => {
                    if (data.status === 200) {
                        sortPart = false;
                       
                            this.broadcaster.broadcast('UpdateListProducts', { action: 'sortExpense', catIndex: CategoryIndex, prodIndex: ProductIndex });
                        
                    }
                });
        });*/

    }

    getDateString(data: any): string {

        return `${data.year}-${(data.month < 10) ? '0' + data.month : data.month}-${(data.day < 10) ? '0' + data.day : data.day}`
    }

    SelectActionMode(data: ItemMenu) {
        if (data.action === "edit")  {
            this.broadcaster.broadcast('showEditMode', new showEditMode ({
                action: data.action,
                product: this.categories[data.i].products[data.u].subproducts[data.g],
                productParent: this.categories[data.i].products[data.u],
                settings: this.tableData.settings,
                productId: this.categories[data.i].products[data.u].id.split('products-').join(''),
                productCategoryId: (this.categories[data.i].id).split('categories-').join(''),
                productsLen: this.categories[data.i].products[data.u].subproducts.length,
                dataId: new IndexExpense(data.i,data.i, data.g)
            }));
        }
        if (data.action === "edit-product") {
            this.broadcaster.broadcast('showEditMode', new showEditMode({
                action: data.action,
                product: this.categories[data.i].products[data.u],
                productsLen: this.categories[data.i].products.length,
                productId: this.categories[data.i].products[data.u].id.split('products-').join(''),
                productCategoryId: (this.categories[data.i].id).split('categories-').join(''),
                settings: this.tableData.settings,
                dataId: new IndexExpense(data.i,data.u,data.g)
            }));
        }
        if (data.action === "add-campaign") {
            
            this.broadcaster.broadcast('showAddCampaignMode', new showAddCampaignMode( {
                action: "show",
                product: (data.g === (-1)) ? [this.categories[data.i].products[data.u]] : this.categories[data.i].products[data.u].subproducts[data.g],
                dataId: new IndexExpense(data.i,data.u,data.g),
                settings: this.tableData.settings,
                productCategoryId: this.categories[data.i].id,
                productId: this.categories[data.i].products[data.u].id.split('products-').join(''),
            }));
        }
        if (data.action === "add-product") {
            this.broadcaster.broadcast('showEditMode', new showEditMode ({
                action: data.action,
                product: this.categories[data.i].products[data.u],
                categori: this.categories[data.i],
                settings: this.tableData.settings,
                title: this.categories[data.i].products[data.u].title,
                dataId: new IndexExpense(data.i,data.u,data.g)
            }));
        }
        if (data.action === "remove" || data.action === "remove-product" || data.action === "remove-category") {
            this.broadcaster.broadcast('Confirm', {
                data: data,
                action: data.action
            });
        }
    }
    getNumber(num): any {
        return Array.apply(null, { length: num }).map(Number.call, Number);
    }

    hoverLabel(label: any) {
        this.ChartsMini.hoverLabel(label);
    }

    selectMonth(month: number) {
        this.leftMenu.defaultStyles();
        if (this.tableData.settings.viewType === 'monthsOfQuarter') {
            this.tableData.settings.quarter = this.datepickerActions.updateQuarter(month);
        }
        this.tableData.settings.month = month;
        window.localStorage.setItem('settings', JSON.stringify(this.tableData.settings));
        this.datepicker.month = this.datepickerActions.DefaultMonth();
        this.datepicker.month[this.tableData.settings.month - 1].class = 'datepicker-list-select';

      
        this.action.generalService.GotoUrl(this.tableData.settings,this.location,this.router);
      //  this.UpdateRange();
    }
   /* UpdateRange() {
        this.datepicker.month = this.datepickerActions.DefaultMonth();
        this.datepicker.month[this.tableData.settings.month - 1].class = 'datepicker-list-select';
        this.httpService
            .getRtbData( new requestRtbData ({
                dealerGroupId: this.tableData.settings.dealerGroupId,
                dealerShipId: this.tableData.settings.dealerShipId,
                year: this.tableData.settings.year,
                month: this.tableData.settings.month,
                quarter: this.tableData.settings.quarter,
                viewType: this.tableData.settings.viewType,
            }))
            .subscribe((data:responseRtbData) => {
             //   if (data.status === 200) {
                   
                    this.broadcaster.broadcast('updateMediaCategories',  data.mediaCategories);
                    this.broadcaster.broadcast('updateSettings',this.tableData);
                    this.broadcaster.broadcast('updateRooftops', new updateRooftops(data.rooftops,data.stats.channels));
                    this.broadcaster.broadcast('updateCategories', new updateCategories(data.categories,data.weeks) );
                    this.broadcaster.broadcast('updateData', new updateData(data.stats));
              //  }
            });
        this.datepicker.val = this.datepickerActions.updateValue(this.tableData.settings);
    }*/
    ngOnDestroy() {
        this.action.sub.unsubscribe();
        this.action.subBroadcaster.unsubscribe();
    }

    UpdateWidthChart(i: number, a: number): string {
        let getWidth: number = 350;
        let width: number = getWidth / i + a;
       
        return `${String(width)}px`;
    }

    SelectYears(obj: any, year: number): void {
        this.elRef.nativeElement.querySelector('.datepicker-years-item').classList.remove('datepicker-years-select');
        obj.currentTarget.classList.add('datepicker-years-select');
        this.tableData.settings.year = year;
    }

    SelectData(val: string, i: number): void {
        this.datepicker.range = this.datepickerActions.DefaultRange();
        this.datepicker.range[i].class = 'datepicker-data-select';
        let selectQuarter: boolean = false;
        if (this.tableData.settings.viewType === 'daysOfMonth' && val === 'monthsOfQuarter') {
            selectQuarter = true;
            this.tableData.settings.quarter = this.datepickerActions.updateQuarter(Number(this.tableData.settings.month));
        }
        this.tableData.settings.viewType = val;
        window.localStorage.setItem('settings', JSON.stringify(this.tableData.settings));
        this.leftMenu.defaultStyles();
        $('.datepicker-fon').fadeOut(100);
        if (val === 'monthsOfYear' || selectQuarter === true) {
        this.datepickerActions.UpdateChartVal();
        
        }
        if (val === 'monthsOfYear') {
            this.datepicker.month = this.datepickerActions.DefaultMonth();
        }
        this.action.generalService.GotoUrl(this.tableData.settings,this.location,this.router);

       /* if (val === 'monthsOfYear' || selectQuarter === true) {
            this.leftMenu.defaultStyles();
            window.localStorage.setItem('settings', JSON.stringify({
                month: String(this.tableData.settings.month),
                year: this.tableData.settings.year, viewType: this.tableData.settings.viewType,
                quarter: this.tableData.settings.quarter
            }));
            $('.datepicker-fon').fadeOut(100);
            this.datepickerActions.UpdateChartVal();
         //   this.action.generalService.GotoUrl(this.tableData,this.location,this.router);
            if (val === 'monthsOfYear') {
                this.datepicker.month = this.datepickerActions.DefaultMonth();
            }
            
        } else {
            window.localStorage.setItem('settings', JSON.stringify(this.tableData.settings));
        }*/
      
     

    }

    UpdateMonth(id: number): string {
        if (id === 1) {
            return 'datepicker-data-select';
        }
        return '';
    }

    UpdateYear(item: number): string {
        if (item === this.tableData.settings.year) {
            return 'datepicker-years-select';
        }
        return '';
    }

    UpdateLine(i: number): string {
        let select =
            (this.tableData.settings.month === i + 1)
                ? 'datepicker-list-select'
                : '';
        if (i === 10) {
            return `datepicker-list-line ${select}`;
        }
        if (i === 0 || i % 2 === 0) {
            return `datepicker-list-line ${select}`;
        }
        return select;
    }



    SelectLabel(obj, menu: string): void {

        this.ChartsMini.SelectLabel(this.ActiveMenu, menu, obj);

        if (this.ActiveMenu[menu]) {
            this.ActiveMenu[menu] = false;
        } else {
            this.ActiveMenu[menu] = true;
        }
        this.broadcaster.broadcast('updateActiveMenu', this.ActiveMenu);
        this.broadcaster.broadcast('updateChart', {});
    }


}