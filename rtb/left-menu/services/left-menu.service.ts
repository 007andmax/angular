import { Injectable } from "@angular/core";
import { CategoryDirectory } from "app/components/class/directory/category";
import { Week } from "app/components/class/category/week";
import { Stats } from "app/components/class/stats/stats";
import { Settings } from "app/components/class/setting";
import { TableData } from "app/components/class/table-data";
import { SingService } from "app/components/service/sing.service";
import { requestGetStats } from "app/components/class/http/req/request-get-stats";
import { requestRtbData } from "app/components/class/http/req/request-get-rtb-data";
import { requestGetCategory } from "app/components/class/http/req/request-get-category";
import { Expense } from "app/components/class/expense/expense";
import { Subscription } from "rxjs";
import { GeneralService } from "app/components/class/general.service";
import { Rooftop } from "app/components/class/rooftop";



@Injectable()
export class LeftMenuService {
    startEditMode: boolean = false;
    sub: Subscription;
    weeks: Array<Week> = [];
    stats: Stats;
    ListProducts: Array<CategoryDirectory>;
    color: string = "";
    // EditMode: boolean = false;
    getParams: any;
    mediaCategories: Array<String> = [];
    blockEditMedia: boolean = false;
    closedAddProductEventListener:Function = null;
    initAddProductEventListener:Function = null;
    subBroadcaster:Subscription = new Subscription();
    constructor(   private httpService: SingService,public generalService: GeneralService) { }
   
    
    public setRooftop(rooftops:Array<Rooftop>,settings:Settings) {
        if (settings.dealerShipId === 0)
        {
            rooftops[0].select = true;
            settings.dealerShipId = Number(rooftops[0].id);
        } else {
            let indexRooftop:number = rooftops.findIndex(item => Number(item.id) === settings.dealerShipId);
            rooftops[indexRooftop].select = true;
            settings.dealerShipId = Number(rooftops[indexRooftop].id);
        }
    }
    public setSettingLocalStorage (tableData:TableData) {
        window.localStorage.setItem('settings', JSON.stringify(tableData.settings));
    }
    public onInitscrollToAddProduct (element) {
        var box = element.getBoundingClientRect();
        let top = box.top + pageYOffset;
        if (((window.pageYOffset || document.documentElement.scrollTop) + document.documentElement.clientHeight) <= top) {
            window.scrollTo(0, top - document.documentElement.clientHeight + 50);
        }
    }
    public getStats (data:requestGetStats,viewType:String) {
return this.httpService.getStats(data,viewType);
    }
    public getRtbData (data:requestRtbData) {
        return this.httpService.getRtbData(data);
    }
    public getListProducts (dealerGroupId:Number) {
       return this.httpService.getListProducts(dealerGroupId);
    }
    public getСategory (data:requestGetCategory,viewType:String) {
       return this.httpService.getСategory(data,viewType);
    }
    public addExpense (data:Expense) {
        return this.httpService.addExpense(data)
    }
}