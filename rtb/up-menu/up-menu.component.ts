import { Component } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { SingService } from '../../service/sing.service';
import { UpMenu } from './services/up-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData } from '../../class/table-data';
import { responseRtbData } from 'app/components/class/http/res/response-rtb-data';
import { updateCategories } from 'app/components/class/broadcaster/update-categories';
import { updateData } from 'app/components/class/broadcaster/updateData';
import { updateRooftops } from 'app/components/class/broadcaster/update-rooftops';
import { Alert } from 'app/components/class/alert/alert';
import { DealerShip } from 'app/components/class/dealer-ship';
import { CategoryDirectory } from 'app/components/class/directory/category';
import { requestRtbData } from 'app/components/class/http/req/request-get-rtb-data';
import { Rooftop } from 'app/components/class/rooftop';

import { LocationStrategy, Location } from "@angular/common";
import { Subscription } from 'rxjs';
@Component({
    selector: 'up-menu-comp',
    templateUrl: 'up-menu.component.html',
    styleUrls: ['up-menu.component.min.css', 'up-menu.component.css'],
    providers: [UpMenu, SingService]
})
export class UpMenuComponent {
    sub: any;
    menu:Array<Rooftop> = [];
    ListProducts: any = [];
    getParams: any
    tableData: TableData = new TableData();
    countCategories: number = 0;
    dealerShipIdList: DealerShip = { list: [] };
    constructor(
        private broadcaster: Broadcaster,
        private httpService: SingService,
        private route: ActivatedRoute,
        private upMenu: UpMenu,
        private router: Router,
        private location:Location
      

    ) { }
    ngOnInit() {

     /*   this.sub = this.route.queryParams.subscribe(params => {
            this.tableData.settings.dealerGroupId = Number(params['id']) || 0;
            if (window.localStorage.getItem('dealerShipId')) {
                this.dealerShipIdList = JSON.parse(window.localStorage.getItem('dealerShipId'));
                let find: boolean = false;
                for (let i = 0; i < this.dealerShipIdList.list.length; i++) {
                    if (Number(this.dealerShipIdList.list[i].client) === Number(params['id'])) {
                        find = true;
                        this.tableData.settings.dealerShipId = Number(this.dealerShipIdList.list[i].id) || 0;
                        break;
                    }

                }
                if (!find) {
                  //  this.broadcaster.broadcast('showAlert', new Alert("This rooftop does not exist, or was removed"));
                    this.tableData.settings.dealerShipId = Number(this.dealerShipIdList.list[0].id);
                    this.dealerShipIdList.list.push({ client: String(this.tableData.settings.dealerGroupId), id: this.dealerShipIdList.list[0].id });
                    window.localStorage.setItem('dealerShipId', JSON.stringify(this.dealerShipIdList));
                }
            }
            else {
                this.dealerShipIdList =  new DealerShip(String(this.tableData.settings.dealerShipId),"0");
                window.localStorage.setItem('dealerShipId', JSON.stringify(this.dealerShipIdList));
                this.tableData.settings.dealerShipId = 0;
            }
            this.getParams = params;
        });*/

       let setListProducts:Subscription = this.broadcaster.on<any>('setListProducts').subscribe((list: Array<CategoryDirectory>) => {
            this.ListProducts = list;
        });
        this.upMenu.subBroadcaster.add(setListProducts);
       let selectRofftop:Subscription = this.broadcaster.on<any>('selectRofftop').subscribe((id: number) => {
            let index:number = this.menu.findIndex(item => item.id === String(id));
            this.setDealerShipId(index);
          

        });
        this.upMenu.subBroadcaster.add(selectRofftop);
       let updateRooftops:Subscription =  this.broadcaster.on<any>('updateRooftops').subscribe((data: updateRooftops) => {
            if (data.rooftops.length > 1) {
              
               // this.tableData.settings.dealerShipId = this.upMenu.getdealerShipId(data.rooftops);
                this.menu = data.rooftops;
              /*  if (!result.find) {
                    this.broadcaster.broadcast('showAlert', new Alert("This rooftop does not exist, or was removed"));
                }*/

            } else {
                if (data.rooftops.length === 0) return;
                this.menu = data.rooftops;
             //   this.tableData.settings.dealerShipId = this.upMenu.getdealerShipId(data.rooftops);
               /* let indexSealerShipId: number = (window.localStorage.getItem('dealerShipId') !== null) ? this.dealerShipIdList.list.findIndex(element => Number(element.client) === Number(this.tableData.settings.dealerGroupId)) : (-1);
                if (indexSealerShipId !== (-1) && Number(this.dealerShipIdList.list[indexSealerShipId].id) !== Number(data.rooftops[0].id)) {
                    this.broadcaster.broadcast('showAlert', new Alert("This rooftop does not exist, or was removed"));
                    this.tableData.settings.dealerShipId = Number(data.rooftops[0].id);
                    data.rooftops[0].select = false;
                    this.menu = data.rooftops;
                }
                else {
                    if (indexSealerShipId === (-1)) {
                        this.dealerShipIdList.list.push({ client: String(this.tableData.settings.dealerGroupId), id: data.rooftops[0].id });
                        window.localStorage.setItem('dealerShipId', JSON.stringify(this.dealerShipIdList));
                    }
                    this.tableData.settings.dealerShipId = Number(data.rooftops[0].id);
                    data.rooftops[0].select = true;
                    this.menu = data.rooftops;
                }*/

            }
        });
        this.upMenu.subBroadcaster.add(updateRooftops);
        let updateSettings:Subscription = this.broadcaster.on<any>('updateSettings').subscribe((data: TableData) => {
            this.tableData.setData(data.settings);
        });
        this.upMenu.subBroadcaster.add(updateSettings);
    }
setDealerShipId (index: number) {
    this.dealerShipIdList = this.upMenu.SelectRooftops(this.tableData.settings, this.menu[index].id);
    this.tableData.settings.dealerShipId = Number(this.menu[index].id);
    this.upMenu.setColorCategories(this.ListProducts, this.tableData.settings.dealerGroupId);
}
    SelectRooftops(index: number): void {
        this.setDealerShipId(index);
       

        window.localStorage.setItem('settings', JSON.stringify(this.tableData.settings));
        this.upMenu.generalService.GotoUrl(this.tableData.settings,this.location,this.router)
//this.upMenu.goToRooftop(this.router,this.tableData);
       
       /* this.httpService
            .getRtbData(new requestRtbData({
                dealerGroupId: this.tableData.settings.dealerGroupId,
                dealerShipId: this.tableData.settings.dealerShipId,
                year: this.tableData.settings.year,
                month: this.tableData.settings.month,
                quarter: this.tableData.settings.quarter,
                viewType: this.tableData.settings.viewType,
            }))
            .subscribe((data: responseRtbData) => {
                data.rooftops[index].select = true;
                this.broadcaster.broadcast('updateSettings', this.tableData);
                this.broadcaster.broadcast('updateMediaCategories', data.mediaCategories);
                this.broadcaster.broadcast('updateRooftops', new updateRooftops(data.rooftops, data.stats.channels));
                this.broadcaster.broadcast('updateCategories', new updateCategories(data.categories, data.weeks));
                this.broadcaster.broadcast('updateData', new updateData(data.stats));

            });*/
    }
    ngOnDestroy() {
       // this.sub.unsubscribe();
       this.upMenu.subBroadcaster.unsubscribe();
    }
}
