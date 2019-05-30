import { DealerShip } from "app/components/class/dealer-ship";
import { Settings } from "app/components/class/setting";
import { Rooftop } from "app/components/class/rooftop";
import { Router } from "@angular/router";
import { TableData } from "app/components/class/table-data";
import { GeneralService } from "app/components/class/general.service";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable()
export class UpMenu {
    subBroadcaster:Subscription = new Subscription();
    constructor(public generalService: GeneralService) {

    }
   
    public SelectRooftops(settings: Settings, id: string): DealerShip {
        let dealerShipIdList: DealerShip;
        if (window.localStorage.getItem('dealerShipId')) {
             dealerShipIdList = JSON.parse(window.localStorage.getItem('dealerShipId'));
           
            for (let i = 0; i < dealerShipIdList.list.length; i++) {

                if (Number(dealerShipIdList.list[i].client) === settings.dealerGroupId) {
                   
                        dealerShipIdList.list[i].id = id;
                   
                }
            }
           
        }
        else {
            dealerShipIdList = new DealerShip(settings.dealerGroupId, settings.dealerShipId);
            window.localStorage.setItem('dealerShipId', JSON.stringify(dealerShipIdList));

        }
       /* let dealerShipIdList: any = dealerShipId;
        let tableData: any = data;
        if (window.localStorage.getItem('dealerShipId')) {

            let indexSealerShipId = dealerShipIdList.list.findIndex(element => Number(element.client) === Number(tableData.settings.dealerGroupId));
            if (indexSealerShipId !== (-1)) {
                dealerShipIdList.list[indexSealerShipId].id = id;
                window.localStorage.setItem('dealerShipId', JSON.stringify(dealerShipIdList));

            }
            else {
                dealerShipIdList.list.push({ client: tableData.settings.dealerGroupId, id: id });
                window.localStorage.setItem('dealerShipId', JSON.stringify(dealerShipIdList));
            }
        }
        else {
            dealerShipIdList.list.push({ client: tableData.settings.dealerGroupId, id: id });
            window.localStorage.setItem('dealerShipId', JSON.stringify(dealerShipIdList));

        }*/
        return dealerShipIdList;
    }
    public setColorCategories(ListProducts: any, dealerGroupId: Number) {

        let dealerShipIdList: any = JSON.parse(window.localStorage.getItem('dealerShipId'));
        let indexDealer: number = dealerShipIdList.list.findIndex(element => Number(element.client) === dealerGroupId);

        let ColorCategories: any = (window.localStorage.getItem('colors')) ? JSON.parse(window.localStorage.getItem('colors')) : { list: [] };

        for (let u = 0; u < ListProducts.length; u++) {
            let indexColorList: number = ColorCategories.list.findIndex(element => element.id === String(ListProducts[u].productCategoryId) && element.client === String(dealerGroupId));
            if (indexColorList === (-1)) {
                ColorCategories.list.push({ client: String(dealerGroupId), id: String(ListProducts[u].productCategoryId), color: ListProducts[u].color });
            }
        }
        window.localStorage.setItem('colors', JSON.stringify(ColorCategories));



    }
    public getdealerShipId (rooftops: Array<Rooftop>):number {
        let indexRoftop:number = rooftops.findIndex(item => item.select);
        return Number(rooftops[indexRoftop].id);
    }
   
    public findGetParamRooftop(rooftops: any, select: string, settings: any): any {
        let DataRooftops: any = rooftops;
        let DataDealerShipId: number;
        let first: boolean = false;
        let find: boolean = false;

        let dealerShipId: DealerShip;
        if (window.localStorage.getItem('dealerShipId')) {
            dealerShipId = JSON.parse(window.localStorage.getItem('dealerShipId'));
        }
        else {
            dealerShipId = new DealerShip(String(settings.dealerGroupId),DataRooftops[0].id);
        }
        let index: number = (select === "0") ? 0 : DataRooftops.findIndex(element => String(element.id) === select);
        let indexClient: number = dealerShipId.list.findIndex(element => String(element.client) === String(settings.dealerGroupId));
        for (let i = 0; i < DataRooftops.length; i++) {
            if (select === undefined) {
                if (String(settings.dealerShipId) !== "0") {
                    if (DataRooftops[i].id === String(settings.dealerShipId)) {
                        DataRooftops[i].class = 'm--active';
                        find = true;
                    }
                    else {
                        DataRooftops[i].class = '';
                    }
                }
                else {
                    first = true;
                    DataRooftops[i].class = '';
                }
            }
            else {
                if (i === index) {
                    DataRooftops[i].class = 'm--active';
                    DataDealerShipId = Number(DataRooftops[i].id);
                    find = true;
                }
                else {
                    DataRooftops[i].class = '';
                }
            }
        }
        if (first) {
            find = true;
            DataDealerShipId = Number(DataRooftops[0].id);
            DataRooftops[0].class = 'm--active';

            if (indexClient !== (-1)) {
                dealerShipId.list[indexClient].id = DataRooftops[0].id;
            }
            else {
                dealerShipId.list.push({ client: String(settings.dealerGroupId), id: DataRooftops[0].id });
            }
            window.localStorage.setItem('dealerShipId', JSON.stringify(dealerShipId));

        }

        return {
            rooftops: DataRooftops,
            dealerShipId: DataDealerShipId,
            find: find
        }

    }
}