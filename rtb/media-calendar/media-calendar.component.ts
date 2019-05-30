import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { SingService } from '../../service/sing.service';
import { MediaCalendar } from './services/media-calendar.service';
import { MediaExpense } from './class/MediaExpense';
import { TableData } from '../../class/table-data';
import { EditModeMediaCalendar } from './class/editMode-media-calendar.service';
import { SaveMedia } from './class/save-media';
import { CreateProduct } from './class/create-product';
import { updateRooftops } from 'app/components/class/broadcaster/update-rooftops';
import { Alert } from 'app/components/class/alert/alert';
import { CategoryDirectory } from 'app/components/class/directory/category';
import { showMediaCalendar } from 'app/components/class/broadcaster/show-media-calendar';
import { responsecreateProduct } from 'app/components/class/http/res/response-create-product';
import { Subscription } from 'rxjs';

@Component({
    selector: 'media-calendar-comp',
    templateUrl: 'media-calendar.component.html',
    styleUrls: ['media-calendar.component.css'],
    providers: [SingService, MediaCalendar]
})
export class MediaCalendarComponent {
    display: string = 'none';
    categori: any;
    ListProducts: any;
    Expense: MediaExpense;
    ProductName: string = '';
    productId: number = -1;
    listMedia: any = [];
    tableData: TableData = new TableData();
    weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    dealerShips: any = [];
    UpdateTable: boolean = false;
    ErrorDateText: string = 'You can not to save the empty flight date budget. Insert the cost, please.';
    ErrorFlightDates: string = 'The flight dates can not have the same dates.';
    ErrorBudgetDealers: string = 'The sum of all dealerShips must be equal to 100%.';
    showDealers: boolean = false;
    dataId: any = {};
    editMode: EditModeMediaCalendar = new EditModeMediaCalendar();
    CampaignName: string = '';
    constructor(private broadcaster: Broadcaster, private ref: ChangeDetectorRef, private elRef: ElementRef, private httpService: SingService, private acions: MediaCalendar) { }
    ngOnInit() {

       let updateRooftops:Subscription = this.broadcaster.on<any>('updateRooftops').subscribe((data:updateRooftops) => {

            this.dealerShips = this.acions.setDealerShips(data.rooftops);

        });
        this.acions.subBroadcaster.add(updateRooftops);
       let updateSettings:Subscription = this.broadcaster.on<any>('updateSettings').subscribe((data:TableData) => {
            this.tableData.setData(data.settings);
            this.editMode.days = 32 - new Date(this.tableData.settings.year, this.tableData.settings.month - 1, 32).getDate();
            this.editMode.currentDate = new Date(this.tableData.settings.year, this.tableData.settings.month - 1, 1);

        });
        this.acions.subBroadcaster.add(updateSettings);
       let closedMediaCalendar:Subscription =  this.broadcaster.on<any>('closedMediaCalendar').subscribe(data => {
            this.closedMediaCalendar();
        });
        this.acions.subBroadcaster.add(closedMediaCalendar);
      let setListProducts:Subscription =  this.broadcaster.on<any>('setListProducts').subscribe((data:Array<CategoryDirectory>) => {
            this.ListProducts = data;
           
        });
        this.acions.subBroadcaster.add(setListProducts);
       let showMediaCalendar:Subscription = this.broadcaster.on<any>('showMediaCalendar').subscribe((data:showMediaCalendar) => {

            this.httpService.getMediaCalendar({
                dealerGroupId: this.tableData.settings.dealerGroupId, year: this.tableData.settings.year,
                month: this.tableData.settings.month, productCategoryId: String(data.categori.id).split('categories-').join('')
            }).subscribe(res => {
                if (res.status === 200) {
                  
                    if (res.data.products)
                    {
                        for (let i = 0; i < res.data.products.length; i++) {


                            let campaigns = [];
                            for (let u = 0; u < res.data.products[i].campaigns.length; u++) {
                                this.Expense = new MediaExpense();
    
                                let budget: number = this.acions.updateTargetBudget(res.data.products[i].campaigns[u].flightDates);
                                let actualBudget: Number = this.acions.getActualBudgets(res.data.products[i].campaigns[u].flightDates);
                                let dealerShips = [];
                                for (let g=0;g<this.dealerShips.length;g++)
                                {
                                    if (res.data.products[i].campaigns[u].dealerShips[g] && this.dealerShips[g].dealerShipId === res.data.products[i].campaigns[u].dealerShips[g].dealerShipId)
                                    {
                                       // this.dealerShips[g].active = true;
                                         dealerShips.push({
    
                                            coop: Math.ceil((budget * Number(res.data.products[i].campaigns[u].dealerShips[g].coop / 100)) * 1000) / 1000,
                                            dealerShipId: res.data.products[i].campaigns[u].dealerShips[g].dealerShipId,
                                            percent: res.data.products[i].campaigns[u].dealerShips[g].percent,
                                            targetBudgetPercent: res.data.products[i].campaigns[u].dealerShips[g].percent,
                                            budget: Math.ceil((budget * Number(res.data.products[i].campaigns[u].dealerShips[g].percent / 100)) * 1000) / 1000,
                                            coopPercent: res.data.products[i].campaigns[u].dealerShips[g].coop,
                                            actualBudget: 0,
                                            active: true
                                        });
                                    }
                                    else
                                    {
                                        let index:number = res.data.products[i].campaigns[u].dealerShips.findIndex(item => item.dealerShipId === this.dealerShips[g].dealerShipId);
                                        if (index > (-1))
                                        {
                                          //  this.dealerShips[g].active = true;
                                            dealerShips.push({
    
                                                coop: Math.ceil((budget * Number(res.data.products[i].campaigns[u].dealerShips[index].coop / 100)) * 1000) / 1000,
                                                dealerShipId: res.data.products[i].campaigns[u].dealerShips[index].dealerShipId,
                                                percent: res.data.products[i].campaigns[u].dealerShips[index].percent,
                                                targetBudgetPercent: res.data.products[i].campaigns[u].dealerShips[index].percent,
                                                budget: Math.ceil((budget * Number(res.data.products[i].campaigns[u].dealerShips[index].percent / 100)) * 1000) / 1000,
                                                coopPercent: res.data.products[i].campaigns[u].dealerShips[index].coop,
                                                actualBudget: 0,
                                                active: true
                                            });
                                        }
                                        else
                                        {
                                            let indexDealer:number = res.data.dealerShips.findIndex(item => item === this.dealerShips[g].dealerShipId);
                                            if (indexDealer > (-1))
                                            {
                                                dealerShips.push({
    
                                                    coop: 0,
                                                    dealerShipId: this.dealerShips[g].dealerShipId,
                                                    percent: 0,
                                                    targetBudgetPercent: 0,
                                                    budget: 0,
                                                    coopPercent: 0,
                                                    actualBudget: 0,
                                                    active: true
                                                });
                                            }
                                            else{
                                                this.dealerShips[g].active = false;
                                                dealerShips.push({
        
                                                    coop: 0,
                                                    dealerShipId: this.dealerShips[g].dealerShipId,
                                                    percent: 0,
                                                    targetBudgetPercent: 0,
                                                    budget: 0,
                                                    coopPercent: 0,
                                                    actualBudget: 0,
                                                    active: false
                                                });
                                            }
                                            
                                        }
                                    }
                                }
                           
                                this.Expense.setDefaultData(res.data.products[i].campaigns[u].flightDates, res.data.products[i].campaigns[u].campaign, this.acions.updateTargetBudget(res.data.products[i].campaigns[u].flightDates), dealerShips, actualBudget);
                                campaigns.push(this.Expense);
    
                            }
                            let indexCat: number = this.ListProducts.findIndex(item => String(item.productCategoryId) === String(data.categori.id).split('categories-').join(''));
                            let indexProd: number = this.ListProducts[indexCat].products.findIndex(item => item.productId === res.data.products[i].productId);
                        
                            this.listMedia.push({ productId: res.data.products[i].productId, productName: this.ListProducts[indexCat].products[indexProd].name, campaigns: campaigns });
    
                        }
                        if (this.listMedia.length !== 0) {
                            this.elRef.nativeElement.querySelector('.next-step').style.display = 'block';
                        }
                    }
                   
                    this.acions.setDefaultMediaCalendar(this.listMedia);
                
                    this.categori = data.categori;
                    this.dataId = data.dataId;
                    this.display = 'block';
                    (<HTMLElement>document.body.querySelector('.allwhite')).style.display = 'block';
                    document.body.querySelector('main.content').classList.add('m--blur');
                    this.UpdateListProducts();
                    document.body.classList.add('stop-scrolling');
                }
            });


        });
        this.acions.subBroadcaster.add(showMediaCalendar);
        $("body").bind("change", (e) => {

            if (e.target.classList.contains('switch-checkbox')) {
               
                let index = Number(e.target.getAttribute('index'));
                this.dealerShips[index].active = $(e.target).is(":checked");

                for (let i = 0; i < this.listMedia.length; i++) {
                    for (let u = 0; u < this.listMedia[i].campaigns.length; u++) {
                        for (let h = 0; h < this.listMedia[i].campaigns[u].dealerShips.length; h++) {
                            if (this.listMedia[i].campaigns[u].dealerShips[h].dealerShipId === this.dealerShips[index].dealerShipId) {
                                this.listMedia[i].campaigns[u].dealerShips[h].active = $(e.target).is(":checked");
                            }
                        }
                    }

                }
              
            }
        });
        this.elRef.nativeElement.addEventListener(
            'click',
            (event) => {
                if (event.target.classList.contains('add-compaign-show')) {
                    this.CampaignName = '';
                    this.acions.onInitAddCompain(event);
             
                }

            }, false);
     /*    //   $(this.elRef.nativeElement.querySelector(".dealers")).keypress(function() {

            $('.dealers').click(function(e) {
               // if (e.shiftKey) {
                    console.log("shift+click");
                    let el = $('.dealers .fht-fixed-body .fht-tbody .fht-tbody-conten');
                    el.scrollIntoView();
                    $('.dealers .fht-fixed-body .fht-tbody').append( `<div class='conteiner-scroll horizontal dragscroll'> ${$('.dealers .fht-fixed-body .fht-tbody .fht-tbody-conten').html()}</p>` );
             //   $('.dealers .fht-fixed-body .fht-tbody').addClass("horizontal dragscroll")
               // } 
            });*/
       /* this.elRef.nativeElement.querySelector(".dealers").onkeydown = (ev) => {
                    console.log('keyCode');
                    var key;
                    var isShift;
                    if (window.event) {
                      key = window.event.keyCode;
                      isShift = !!window.event.shiftKey; // typecast to boolean
                    } else {
                      key = ev.which;
                      isShift = !!ev.shiftKey;
                    }
                    if ( isShift ) {
                      switch (key) {
                        case 16: // ignore shift key
                          break;
                        default:
                          alert(key);
                          // do stuff here?
                          break;
                      }
                    }

                };*/
        this.elRef.nativeElement.querySelector('.add-product-media-btn').addEventListener(
            'click',
            (event) => {
               
                if (this.ProductName !== "") {
                    this.Expense = new MediaExpense();
                    this.Expense.setData(this.tableData.settings, 'New');

                    this.listMedia.push({ productId: this.productId, productName: this.ProductName, campaigns: [this.Expense] });
                    this.ProductName = '';
                    this.productId = -1;
                    this.UpdateListProducts();
                    this.elRef.nativeElement.querySelector('.next-step').style.display = 'block';
                }

            }, false);
        this.elRef.nativeElement.querySelector('.modal-edit-mask').addEventListener(
            'click',
            (event) => {
              
                this.ClosedMask();
            }, false);
        this.elRef.nativeElement.querySelector('.edit-btns-apply').addEventListener(
            'click',
            (event) => {
                this.editMode.defaultValEditDate.addDate = false;
            
                if (this.listMedia[this.editMode.productIndex].campaigns[this.editMode.campaignsIndex].flightDate[this.editMode.flightDateIndex].start.day !== this.editMode.defaultValEditDate.start || this.listMedia[this.editMode.productIndex].campaigns[this.editMode.campaignsIndex].flightDate[this.editMode.flightDateIndex].end.day !== this.editMode.defaultValEditDate.end) {
                    this.listMedia[this.editMode.productIndex].campaigns[this.editMode.campaignsIndex].flightDate[this.editMode.flightDateIndex].start.day = this.editMode.daysMonth[this.editMode.start].label;
                    this.listMedia[this.editMode.productIndex].campaigns[this.editMode.campaignsIndex].flightDate[this.editMode.flightDateIndex].end.day = this.editMode.daysMonth[this.editMode.end].label;
                   
                }
                this.ClosedMask();
            }, false);
        this.elRef.nativeElement.addEventListener(
            'click',
            (event) => {
                this.acions.onInitNumberBudget(event,this.listMedia);
           
            }, false);
        this.elRef.nativeElement.addEventListener(
            'click',
            (event) => {
                this.acions.onInitInputNumber(event,this.listMedia);
          
            }, false);
        this.elRef.nativeElement.querySelector('.finish-step').addEventListener(
            'click',
            (event) => {


                if (this.acions.checkDealersBudget(this.listMedia)) {
                    this.acions.indexProduct = 0;
                    this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'block';
                    this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'block';
                    this.checkProducts(String(this.categori.id).split('categories-').join(''));
                }
                else {
                    this.broadcaster.broadcast('showAlert', new Alert(this.ErrorBudgetDealers,true));
                  
                }

            }, false);
        this.elRef.nativeElement.querySelector('.media-fon-closed').addEventListener(
            'click',
            (event) => {
                if (this.acions.findDifferences(this.listMedia)) {
                    this.broadcaster.broadcast('Confirm', {
                        data: "data",
                        action: "closedMediaCalendar"
                    });
                    return;
                }
                this.broadcaster.broadcast('closedMediaCalendar', null);
            }, false);

        this.elRef.nativeElement.querySelector('.back-step').addEventListener(
            'click',
            (event) => {
                this.elRef.nativeElement.querySelector('.products-list').style.display = 'block';
                this.elRef.nativeElement.querySelector('.dealers').style.display = 'none';
                this.elRef.nativeElement.querySelector('.finish-step').style.display = 'none';
                event.target.style.display = 'none';
                this.showDealers = false;
                this.ref.detectChanges();
                if (this.elRef.nativeElement.querySelector(".fht-table-wrapper")) {
                    this.elRef.nativeElement.querySelector(".fht-table-wrapper").remove();
                }

                this.elRef.nativeElement.querySelector('.add-product-body').style.display = 'inline-block';
                this.elRef.nativeElement.querySelector('.next-step').style.display = 'inline-block';
            }, false);
        this.elRef.nativeElement.querySelector('.next-step').addEventListener(
            'click',
            (event) => {
                if (this.acions.checkProductsBudget(this.listMedia)) {
                    if (!this.acions.checkFlightDates(this.listMedia)) {
                        this.broadcaster.broadcast('showAlert', new Alert(this.ErrorFlightDates,true));
                        return;
                    }
                    this.showDealers = true;
                    this.UpdateTable = true;
                    this.elRef.nativeElement.querySelector('.products-list').style.display = 'none';
                    this.elRef.nativeElement.querySelector('.dealers').style.display = 'flex';

                    this.elRef.nativeElement.querySelector('.finish-step').style.display = 'block';
                    event.target.style.display = 'none';

                    for (let i = 0; i < this.listMedia.length; i++) {
                        for (let u = 0; u < this.listMedia[i].campaigns.length; u++) {
                        
                            if (this.listMedia[i].campaigns[u].dealerShips) {
                                let out_dealerShips = this.listMedia[i].campaigns[u].dealerShips.map((item) => {
                                   
                                  let index = this.dealerShips.findIndex(itemD => itemD.dealerShipId === item.dealerShipId);
                                    return {
                                        active: this.dealerShips[index].active,
                                        coop: item.coop,
                                        dealerShipId: item.dealerShipId,
                                        percent: item.percent,
                                        targetBudgetPercent: item.targetBudgetPercent,
                                        budget: Math.ceil((item.targetBudgetPercent * this.listMedia[i].campaigns[u].targetBudget / 100) * 1000) / 1000,
                                        actualBudget: Math.ceil((item.targetBudgetPercent * this.listMedia[i].campaigns[u].actualBudget / 100) * 1000) / 1000

                                    }
                                })

                                this.listMedia[i].campaigns[u].dealerShips = out_dealerShips;

                            }
                            else {
                                let dealerShips = this.dealerShips.map((item) => {
                                    return {
                                        active: item.active,
                                        coop: 0,
                                        dealerShipId: item.dealerShipId,
                                        percent: 0,
                                        targetBudgetPercent: 0,
                                        budget: 0,
                                        actualBudget: 0
                                    }
                                });

                                this.listMedia[i].campaigns[u].dealerShips = dealerShips;
                            }
                        }

                    }
                    this.dealerShips = this.acions.UpdateDealerShips(this.dealerShips, this.listMedia);
                  
                    this.elRef.nativeElement.querySelector('.add-product-body').style.display = 'none';
                    this.elRef.nativeElement.querySelector('.back-step').style.display = 'inline-block';
                }
                else {
                    this.broadcaster.broadcast('showAlert', new Alert(this.ErrorDateText,true));
                }

            }, false);
        $(this.elRef.nativeElement).on('mouseenter', '.edit-flight-date-days span', (e) => {
            this.editMode.SelecteFlightDate(e);
        
        });
    }
   

    checkProducts(productCategoryId: string) {

        if (this.listMedia[this.acions.indexProduct].productId === (-1)) {

            let dataProduct:CreateProduct = new CreateProduct(this.listMedia[this.acions.indexProduct].productName,"","",productCategoryId);
            this.httpService.createProduct(dataProduct)
                .subscribe((res:responsecreateProduct) => {

                 
                        this.listMedia[this.acions.indexProduct].productId = res.productId;
                        this.acions.indexProduct++;

                        if (this.acions.indexProduct !== this.listMedia.length) {
                            this.checkProducts(productCategoryId);
                        }
                        else {
                            this.saveMediaCalendar();
                        }


                    
                }, error => {
                    this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'none';
                    this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'none';
                });


        }
        else {
            this.acions.indexProduct++;

            if (this.acions.indexProduct !== this.listMedia.length) {
                this.checkProducts(productCategoryId);
            }
            else {
                this.saveMediaCalendar();
            }
        }
    }
    saveMediaCalendar() {
        this.dealerShips = this.acions.setIdProductsDealers(this.listMedia, this.dealerShips);

          let data:SaveMedia = new SaveMedia(Number(this.tableData.settings.dealerGroupId),this.tableData.settings.year,this.tableData.settings.month,String(this.categori.id).split('categories-').join(''));
      
        data.setProducts(this.listMedia);
        data.setDealerShips(this.dealerShips);
    
       
        this.httpService.saveMediaCalendar(data)
            .subscribe(res => {
                this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'none';
                this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'none';
                if (res.status === 200 && res.data.saved === 1) {
                    let indexDealer:number = this.dealerShips.findIndex(item => item.active === true);
                    this.broadcaster.broadcast('closedMediaCalendar', null);
                    this.broadcaster.broadcast('updateCategoriesAfterMediaCategory', {
                        productCategoryId: String(this.categori.id).split('categories-').join(''),
                        dataId: this.dataId,
                        remove: (indexDealer === (-1)) ? true : false
                    });
                }


            }, error => {
                this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'none';
                this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'none';
            });
    }
    callOnLastIteration() {
        if (this.UpdateTable) {
            this.UpdateTable = false;
         
            $("#pruebatabla").CongelarFilaColumna({
                lboHoverTr: true
            });

        }

    }
    closedMediaCalendar() {
        this.display = 'none';
     
        this.acions.closedMediaCalendar();
        this.showDealers = false;
        this.listMedia = [];
        this.acions.defaultListMedia = [];
        this.dealerShips = this.acions.clearActiveRooftops(this.dealerShips);
        document.body.classList.remove('stop-scrolling');
    }
    ClosedAddCompaign(e) {
        let parent = this.acions.getParentElement(e.target, 'add-compaign');
        parent.style.display = 'none';
        this.acions.ClosedAllAddCompaign();
    }
    resetEditFlightDate(index: number) {
        this.editMode.enabledAddFlightDate = false;
        this.editMode.daysMonth = this.acions.resetdaysMonth(this.editMode.daysMonth, index);
    }
    SelectNewDate(i: number) {
        if (this.editMode.daysMonth[i].selected === 'no-hover') return;
        
        if (!this.editMode.enabledAddFlightDate) {
            this.resetEditFlightDate(i);
        }
        this.editMode.SelectNewDate(i);

    }
    ClosedMask() {

        this.editMode.defaultValEditDate.addDate = false;
        this.editMode.enabledAddFlightDate = false;
        this.acions.ClosedMask();
        this.elRef.nativeElement.querySelector('.current-dates-edit').classList.remove('current-dates-edit');
    }
    getFlightDateStart(date: any): string {

        return `${(date.start.month < 10) ? "0" + date.start.month : date.start.month}/${(date.start.day < 10) ? "0" + date.start.day : date.start.day}`;
    }
    getFlightDateEnd(date: any): string {

        return `${(date.end.month < 10) ? "0" + date.end.month : date.end.month}/${(date.end.day < 10) ? "0" + date.end.day : date.end.day}`;
    }
    EditFlightDate(i: number, u: number, d: number, event: any) {
        this.editMode.EditFlightDate(i,u,d,event,this.elRef.nativeElement,this.listMedia,this.acions);

    
    }
    removeCompaign(i: number, u: number) {
        this.listMedia[i].campaigns.splice(u, 1);
    }
    RemoveFlightDate(i: number, u: number, d: number) {
        this.listMedia[i].campaigns[u].flightDate.splice(d, 1);
        this.listMedia[i].campaigns[u].budget = this.acions.updateTargetBudget(this.listMedia[i].campaigns[u].flightDate);
        this.listMedia[i].campaigns[u].targetBudget = this.acions.updateTargetBudget(this.listMedia[i].campaigns[u].flightDate);
        this.listMedia[i].campaigns[u].actualBudget = this.acions.getActualBudgets(this.listMedia[i].campaigns[u].flightDate);

    }
    removeProduct(i: number) {
        this.listMedia.splice(i, 1);
        if (this.listMedia.length === 0) {
            this.elRef.nativeElement.querySelector('.next-step').style.display = 'none';
        }

        this.UpdateListProducts();
        this.ref.detectChanges();

    }
    UpdateListProducts() {
        let availableTags = this.acions.UpdateAutoComplete(this.ListProducts, this.categori, this.listMedia);
        $('.add-product-media input').catcomplete({
            delay: 0,
            source: availableTags,
            select: (event, ui) => {

                if (ui.item === undefined) return;
                let productIndex: number = (-1);
                let catIndex: number = this.ListProducts.findIndex(element => element.name === ui.item.category);
                productIndex = this.ListProducts[catIndex].products.findIndex(element => element.name.indexOf(ui.item.label) !== (-1));
                this.ProductName = this.ListProducts[catIndex].products[productIndex].name;
                this.productId = this.ListProducts[catIndex].products[productIndex].productId;
            },
            response: (event, ui) => {
                this.ProductName = event.target.value;

            }
        });

    }
    AddCompaign(index: number) {
        if (this.CampaignName !== '') {
           
            this.Expense = new MediaExpense();
            this.Expense.setData(this.tableData.settings, this.CampaignName);
            this.listMedia[index].campaigns.push(this.Expense);
           
            this.acions.ClosedAllAddCompaign();
        }

    }
    AddFlightDate(i: number, u: number) {
        this.listMedia[i].campaigns[u].AddFlightDate(this.tableData.settings);
    }
    trackByIndex(index, item) {
        return index;
    }
    ngOnDestroy() {
        
        this.acions.subBroadcaster.unsubscribe();
    }
}