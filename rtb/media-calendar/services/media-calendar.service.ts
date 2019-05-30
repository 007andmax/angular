import { Observable, Subscription } from 'rxjs/Rx';
import { ElementRef, Injectable } from '@angular/core';
import { elementAt } from 'rxjs/operator/elementAt';

@Injectable()
export class MediaCalendar {
    indexProduct: number = 0;
    defaultListMedia: any = [];
    subBroadcaster:Subscription = new Subscription();
    constructor(private elRef: ElementRef) {


    }
    public setDefaultMediaCalendar(data: any) {

        this.defaultListMedia = JSON.parse(JSON.stringify(data));

    }
    public onInitAddCompain (event) {
        this.ClosedAllAddCompaign();
                   
        let parent = this.getParentElement(event.target, 'product-info');
        event.target.style.display = 'none';
        parent.querySelector('.add-compaign').style.display = 'block';
        parent.querySelector('.add-compaign input').focus();
        if (parent.querySelector('.remove-compaign')) {
            parent.querySelector('.remove-compaign').style.display = 'none';
        }
    }
    public onInitNumberBudget(event,listMedia:any) {
        if (event.target.classList.contains('number-value')) {
            if (event.target.value === "0") {
                event.target.value = "";
            }
            event.target.onkeyup = (e: any) => {
                if (event.target.classList.contains('grp')) {

                    if (!Number(e.target.value)) {

                        e.target.value = "";
                    }
                }
                else {
                    if (!e.target.value) {
                        e.target.value = "";
                    }
                }

            }
            event.target.onblur = (e: any) => {
                if (e.target.value === "") {
                    e.target.value = 0;
                }
                let parent = this.getParentElement(event.target, 'item-product');
                let index_product: number = parent.getAttribute('index-product');
                let index_expense: number = parent.getAttribute('index-expense');
                listMedia[index_product].campaigns[index_expense].budget = this.updateTargetBudget(listMedia[index_product].campaigns[index_expense].flightDate);
                listMedia[index_product].campaigns[index_expense].targetBudget = this.updateTargetBudget(listMedia[index_product].campaigns[index_expense].flightDate);
                listMedia[index_product].campaigns[index_expense].actualBudget = this.getActualBudgets(listMedia[index_product].campaigns[index_expense].flightDate);
               
            }

        }
    }
    public onInitInputNumber (event,listMedia) {
        if (event.target.classList.contains('targetBudgetPercent') || event.target.classList.contains('coopPercent')) {
            if (event.target.value === "0") {
                event.target.value = "";
            }
            event.target.onkeyup = (e: any) => {

                if (!e.target.value) {
                    e.target.value = "";
                }
                if (e.target.value > 100) {
                    e.target.value = 100;
                }


            }
            event.target.onblur = (e: any) => {
                if (!e.target.value) {
                    e.target.value = "";
                }
                if (e.target.value === "") {
                    e.target.value = 0;

                }
               
                let parent = this.getParentElement(event.target, 'dealer-item-body-product');
                let index_product = parent.getAttribute('index-product');
                let index_dealership = parent.getAttribute('index-dealership');
                let index_campaign = parent.getAttribute('index-campaign');
              
                if (e.target.value === 0 && event.target.classList.contains('targetBudgetPercent')) {
                     listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].budget = 0;
                    listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].actualBudget = 0;
                }
                else {
                    listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].budget = Math.ceil((listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].targetBudgetPercent * listMedia[index_product].campaigns[index_campaign].targetBudget / 100) * 1000) / 1000;
                    listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].actualBudget = Math.ceil((listMedia[index_product].campaigns[index_campaign].dealerShips[index_dealership].targetBudgetPercent * listMedia[index_product].campaigns[index_campaign].actualBudget / 100) * 1000) / 1000;
                       }
            }

        }
    }
public closedMediaCalendar () {
    (<HTMLElement>document.body.querySelector('.allwhite')).style.display = 'none';
    document.body.querySelector('main.content').classList.remove('m--blur');
    this.elRef.nativeElement.querySelector('.add-product-body').style.display = 'inline-block';
    this.elRef.nativeElement.querySelector('.back-step').style.display = 'none';
    this.elRef.nativeElement.querySelector('.products-list').style.display = 'block';
    this.elRef.nativeElement.querySelector('.finish-step').style.display = 'none';
    this.elRef.nativeElement.querySelector('.next-step').style.display = 'none';
    this.elRef.nativeElement.querySelector('.dealers').style.display = 'none';
    if (this.elRef.nativeElement.querySelector(".fht-table-wrapper")) {
        this.elRef.nativeElement.querySelector(".fht-table-wrapper").remove();
    }
}
    public findDifferences(data: any): boolean {
        if (this.defaultListMedia.length !== data.length) return true;
        for (let i = 0; i < this.defaultListMedia.length; i++) {
            if (this.defaultListMedia[i].productId !== data[i].productId || this.defaultListMedia[i].campaigns.length !== data[i].campaigns.length) return true;

            for (let u = 0; u < this.defaultListMedia[i].campaigns.length; u++) {

                if (this.defaultListMedia[i].campaigns[u].targetBudget !== data[i].campaigns[u].targetBudget || this.defaultListMedia[i].campaigns[u].campaign !== data[i].campaigns[u].campaign || this.findDifferencesflightDate(this.defaultListMedia[i].campaigns[u].flightDate, data[i].campaigns[u].flightDate) === true) {
                    return true;
                }
            }

        }
        return false;
    }
    private findDifferencesflightDate(defaultDate: any, currentDate: any): boolean {
        if (defaultDate.length !== currentDate.length) return true;
        for (let i = 0; i < defaultDate.length; i++) {
            if (defaultDate[i].start.day !== currentDate[i].start.day || defaultDate[i].end.day !== currentDate[i].end.day || defaultDate[i].targetBudget !== currentDate[i].targetBudget || defaultDate[i].spots !== currentDate[i].spots || defaultDate[i].grp !== currentDate[i].grp) return true;
        }
        return false;

    }
    public ClosedAllAddCompaign() {
        let listBtns = this.elRef.nativeElement.querySelectorAll('.add-compaign');
        let listBody = this.elRef.nativeElement.querySelectorAll('.add-compaign-show');
        let listRemove = this.elRef.nativeElement.querySelectorAll('.remove-compaign');
        for (let i = 0; i < listBtns.length; i++) {
            listBtns[i].style.display = 'none';
            listBody[i].style.display = 'inline-block';
            if (listRemove.length > 0 && listRemove[i]) {
                listRemove[i].style.display = 'inline-block';
            }
        }


    }
    public checkFlightDates(list: any): boolean {
        for (let g = 0; g < list.length; g++) {
            for (let h = 0; h < list[g].campaigns.length; h++) {
                for (let i = 0; i < list[g].campaigns[h].flightDate.length; i++) {
                    if (list[g].campaigns[h].flightDate[i].targetBudget === 0) return false;
                    if (list[g].campaigns[h].flightDate.length > 1) {
                        for (let u = (i + 1); u < list[g].campaigns[h].flightDate.length; u++) {
                            if (list[g].campaigns[h].flightDate[i].start.day >= list[g].campaigns[h].flightDate[u].start.day || list[g].campaigns[h].flightDate[i].end.day >= list[g].campaigns[h].flightDate[u].end.day || list[g].campaigns[h].flightDate[i].end.day === list[g].campaigns[h].flightDate[u].start.day) {
                                return false;
                            }
                        }
                    }
                }
            }

        }
        return true;
    }
    public checkProductsBudget(list: any): boolean {
        for (let i = 0; i < list.length; i++) {
            for (let h = 0; h < list[i].campaigns.length; h++) {
                if (list[i].campaigns[h].targetBudget === 0) {
                   
                    return false;
                }
            }
        }
        return true;
    }
    public setIdProductsDealers(list: any, dealers: any) {
        let outdealers: any = dealers;
        for (let i = 0; i < outdealers.length; i++) {
            for (let u = 0; u < outdealers[i].products.length; u++) {
                outdealers[i].products[u].productId = list[u].productId;
                /*  let index: number = list.findIndex(item => item.productName === outdealers[i].products[u].productName);
                  if (index !== (-1)) {
                      outdealers[i].products[u].productId = list[index].productId;
                  }*/
            }

        }
        return outdealers;

    }
    public checkDealersBudget(list: any): boolean {
        let budget: number = 0;
        let coop: number = 0;
        let h = 0;



        for (let i = 0; i < list.length; i++) {
            for (let u = 0; u < list[i].campaigns.length; u++) {
                for (let h = 0; h < list[i].campaigns[u].dealerShips.length; h++) {
                    budget += list[i].campaigns[u].dealerShips[h].targetBudgetPercent;
                    coop += list[i].campaigns[u].dealerShips[h].coopPercent;
                  
                    if ((h + 1) === list[i].campaigns[u].dealerShips.length) {
                      
                        if (budget > 100 || coop > 100) {
                            return false;
                        }
                        coop = 0;
                        budget = 0;
                    }
                }
            }
        }
        /* for (let u = 0; u < list[0].products.length;) {
 
             for (let i = 0; i < list.length; i++) {
 
                 budget += list[i].products[u].campaigns[h].targetBudgetPercent;
                 coop += list[i].products[u].campaigns[h].coopPercent;
                 if ((i + 1) === list.length) {
 
                     if (budget !== 100 || coop > 100) {
                         return false;
                     }
                     coop = 0;
                     budget = 0;
                     h++;
                     if (h === list[i].products[u].campaigns.length) {
                         u++;
                         h = 0;
                     }
 
                 }
 
 
             }
         }*/
        return true;
    }
    public UpdateDealerShips(dealerShips: any, products: any) {
        let outDealerShips: any = dealerShips;
        for (let i = 0; i < outDealerShips.length; i++) {

            outDealerShips[i].products = products.map((item) => {
                let campaigns = item.campaigns.map((campaign) => {
                    let targetBudgetPercent: number = 0;
                    let coopPercent: number = 0;
                    let budget: number = 0;
                    let indexDefaultProduct: number = this.defaultListMedia.findIndex(itemD => itemD.productId === item.productId);
                    if (indexDefaultProduct !== (-1)) {
                        let indexDefaultCampaign: number = this.defaultListMedia[indexDefaultProduct].campaigns.findIndex(itemC => itemC.campaign === campaign.campaign);
                        if (indexDefaultCampaign !== (-1)) {
                            let indexDealers: number = this.defaultListMedia[indexDefaultProduct].campaigns[indexDefaultCampaign].dealerShips.findIndex(dealers => dealers.dealerShipId === outDealerShips[i].dealerShipId);
                            if (this.defaultListMedia[indexDefaultProduct].campaigns[indexDefaultCampaign].targetBudget === campaign.targetBudget) {
                                targetBudgetPercent = (this.defaultListMedia[indexDefaultProduct].campaigns[indexDefaultCampaign].dealerShips[indexDealers].percent) ? this.defaultListMedia[indexDefaultProduct].campaigns[indexDefaultCampaign].dealerShips[indexDealers].percent : 0;
                                budget = (targetBudgetPercent * campaign.targetBudget / 100);
                                coopPercent = this.defaultListMedia[indexDefaultProduct].campaigns[indexDefaultCampaign].dealerShips[indexDealers].coop;

                            }
                        }
                    }

                    return {/* coop: (coopPercent === 0) ? 0 : (coopPercent * budget / 100),*/ coopPercent: coopPercent, targetBudget: campaign.targetBudget, targetBudgetPercent: targetBudgetPercent, budget: budget, flightDate: campaign.flightDate, campaign: campaign.campaign }
                });
                return { productId: item.productId, campaigns: campaigns }
            });
        }
        return outDealerShips;
    }
    public UpdateFlightDatesForDealerships(list: any) {
        let outflightDate = list;
        for (let i = 0; i < outflightDate.length; i++) {
            outflightDate[i].start.month++;
            outflightDate[i].end.month++;
        }
        return outflightDate;
    }
    public clearActiveRooftops(rooftops: any)
    {
        let dealerShips: any = rooftops;
        for (let i=0;i<dealerShips.length;i++)
        {
            dealerShips[i].active = true;
        }
        return dealerShips;

    }
    public setDealerShips(rooftops: any) {
        let dealerShips: any = [];

        for (let i = 0; i < rooftops.length; i++) {
            dealerShips.push({ dealerShipId: rooftops[i].id, title: rooftops[i].title, products: [], active: true })
        }
        return dealerShips;
    }
    public UpdateAutoComplete(ListProducts: any, categori: any, listExpense: any): any {
        let availableTags = [];
        let priductHave: number = 0;

        let g: number = ListProducts.findIndex(element => String(element.productCategoryId) === String(categori.id).split('categories-').join(''));
        //  console.log("g", g);
        //   console.log("categori.id", categori.id);
        if (g === (-1)) return availableTags;
        for (let u = 0; u < ListProducts[g].products.length; u++) {
            priductHave = categori.products.findIndex(element => String(element.id).split('products-').join('') === String(ListProducts[g].products[u].productId) || element.title.indexOf(ListProducts[g].products[u].name) === 0);
            let indexExpense: number = (-1);
            for (let i = 0; i < listExpense.length; i++) {
                indexExpense = listExpense[i].campaigns.findIndex(element => element.productName === ListProducts[g].products[u].name || listExpense[i].productName.indexOf(ListProducts[g].products[u].name) === 0);
                if (indexExpense !== (-1)) {
                    break;
                }
            }
            if (priductHave === (-1) && indexExpense === (-1)) {
                availableTags.push({
                    label: ListProducts[g].products[u].name, category: ListProducts[g].name
                })
            }


        }

        return availableTags;
    }
    public resetdaysMonth(daysMonth: any, index: number): any {
        let outdaysMonth = daysMonth;
        for (let i = 0; i < outdaysMonth.length; i++) {
            if (outdaysMonth[i].selected !== 'no-hover') {
                outdaysMonth[i].selected = (index !== (-1) && index === i) ? 'select-date' : '';
            }

        }
        return outdaysMonth;
    }
    public ClosedMask() {
        this.elRef.nativeElement.querySelector('.modal-edit-mask').style.display = 'none';
        this.elRef.nativeElement.querySelector('.edit-flight-date-modal').style.display = 'none';
    }
    public updateTargetBudget(flightDate: any) {
        let targetBudget = 0;
        for (let i = 0; i < flightDate.length; i++) {
            targetBudget += flightDate[i].targetBudget;
        }
        return targetBudget;
    }
    public getActualBudgets(list: any): Number {
        let out: Number = 0;
        for (let i = 0; i < list.length; i++) {
            if (list[i].actualBudget)
            {
                out += list[i].actualBudget;
            }
           
        }
        return out;
    }
    public getParentElement(p, clas: string): any {
        let parent = p;
        while (!parent.classList.contains(clas)) {

            parent = parent.parentNode;
            //  console.log("parent", parent);
        }
        return parent;
    }
}