/**
 * Created by Макс on 25.10.2017.
 */

import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { Channels } from '../class/channels.service';
import { Charts } from '../class/charts.service';
import { RightMenu } from './services/right-menu.service';
import { SingService } from '../../service/sing.service';
import { TableData } from '../../class/table-data';
import { Trends } from './class/trends';
import { ActiveMenu } from '../class/active-menu';
import { StatsText } from './class/stats-text';
import { updateCategories } from 'app/components/class/broadcaster/update-categories';
import { updateData } from 'app/components/class/broadcaster/updateData';
import { updateInfoItem } from 'app/components/class/broadcaster/update-info-item';
import { updateRooftops } from 'app/components/class/broadcaster/update-rooftops';
import { onInitGraph } from 'app/components/class/broadcaster/app/onInit-graph';
import { updateTitleTable } from 'app/components/class/broadcaster/info-expense/update-title-table';
import { responseGetStats } from 'app/components/class/http/res/response-get-stats';
import { requestGetStats } from 'app/components/class/http/req/request-get-stats';
import { GeneralService } from 'app/components/class/general.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'right-menu-comp',
    templateUrl: 'right-menu.component.html',
    styleUrls: ['right-menu.component.min.css', 'right-menu.component.css'], //left-menu/app.component.css
    providers: [Channels, Charts, RightMenu, SingService,GeneralService]
})
export class RightMenuComponent {

    channels: any = [];
    ActiveMenu:ActiveMenu = new ActiveMenu();
    Trends:Trends = new Trends();
    days: number = 0;
    titlesHeader: any = [];
    weeks: any = [];
    stats: any = [];
    statsPriceText: StatsText = new StatsText();
    viewTable: number = 1;
    tableData: TableData = new TableData();
    graph: any = { min: Number, max: Number, midle: Number, btn: { title: 'Analytics' }, status: 1 };
    blockSwitchViewGraph: boolean = false;
    rights: any = {};
    switchGraph: boolean = false;
    switchViewGraph: boolean = true;
    classAll = ['m--allVisible', 'm--hidden-all'];
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
    

    constructor(private broadcaster: Broadcaster,public generalService: GeneralService, private ref: ChangeDetectorRef, private elRef: ElementRef, private ActionChannels: Channels, private Charts: Charts, private actions: RightMenu, private httpService: SingService, ) { }
    ngOnInit() {
        if (this.httpService.getAuthData().loggedIn === "") return;
        this.rights = this.httpService.getAuthData().identity.rights;
       let updateRooftops:Subscription = this.broadcaster.on<any>('updateRooftops').subscribe((data:updateRooftops) => {
            this.channels = data.channels;
            for (let i = 0; i < this.channels.length; i++) {
                this.channels[i].hide = true;
                for (let d = 0; d < this.ActionChannels.circleColors.length; d++)
                    if (this.channels[i].title === this.ActionChannels.circleColors[d].text) {
                        this.channels[i].color = this.ActionChannels.circleColors[d].color;
                        this.channels[i].class = this.ActionChannels.circleColors[d].class;
                        break;
                    }
            }

        });
this.actions.subBroadcaster.add(updateRooftops);
       let updateInfoItem:Subscription =  this.broadcaster.on<any>('updateInfoItem').subscribe((data:updateInfoItem) => {
            if (data.id === null) {
                this.UpdateTtitles();
            }
        });
        this.actions.subBroadcaster.add(updateInfoItem);
       let updateSettings:Subscription = this.broadcaster.on<any>('updateSettings').subscribe((data:TableData) => {
            this.tableData.setData(data.settings);
            this.UpdateTtitles();
            this.weeks = [];
        });
        this.actions.subBroadcaster.add(updateSettings);
       let updateCategories:Subscription = this.broadcaster.on<any>('updateCategories').subscribe((data:updateCategories) => {
            if (data.weeks !== undefined) {
                this.weeks = data.weeks;
            }
        });
        this.actions.subBroadcaster.add(updateCategories);
       let updateData:Subscription = this.broadcaster.on<any>('updateData').subscribe((data:updateData) => {
      
            this.statsPriceText.update(data,this.actions);
            this.stats = data.stats;

            if (this.stats !== null) {
                let result = this.Charts.chart(this.tableData, this.stats, this.ActiveMenu, this.channels, this.weeks, this.graph);
                this.graph = result.graph;
            }
        });
        this.actions.subBroadcaster.add(updateData);
      /*  this.broadcaster.on<any>('updateChannels').subscribe(data => {
            console.log('updateChannels',data);
            let result: boolean = data.hide;
            if (data.hide === true) {
                this.classAll = ['m--allHidden', 'm--hidden'];
            } else {
                this.classAll = ['m--allVisible', 'm--hidden-all'];
            }
            for (let i = 0; i < this.channels.length; i++) {
                this.channels[i].hide = result;
            }
        });*/
       let updateTitleTable:Subscription = this.broadcaster.on<any>('updateTitleTable').subscribe((data:updateTitleTable) => {
            if (this.tableData.settings.viewType === 'daysOfMonth') {
                this.titlesHeader = this.actions.getTitlesWithInfoExpense(this.days, this.tableData.settings.year, this.tableData.settings.month, data.start, data.end );

            }
            if (this.tableData.settings.viewType === 'monthsOfQuarter') {
                this.weeks = this.actions.getWeeksWithInfoExpense(this.weeks, data.start, data.end);

            }
            if (this.tableData.settings.viewType === 'monthsOfYear') {

                this.titlesHeader = this.actions.getMonthsWithInfoExpense(this.tableData.settings.month, this.tableData.settings.year, data.start, data.end);

            }
        });
        this.actions.subBroadcaster.add(updateTitleTable);
       let updateChart:Subscription = this.broadcaster.on<any>('updateChart').subscribe(data => {
            let result = this.Charts.chart(this.tableData, this.stats, this.ActiveMenu, this.channels, this.weeks, this.graph);
            this.graph = result.graph;
        });
        this.actions.subBroadcaster.add(updateChart);
       let updateActiveMenu:Subscription = this.broadcaster.on<any>('updateActiveMenu').subscribe((data:ActiveMenu) => {

            if (this.ActiveMenu.sessions !== data.sessions) {
                if (data.sessions) {

                    this.classAll = ['m--allVisible', 'm--hidden-all'];
                } else {

                    this.classAll = ['m--allHidden', 'm--hidden'];
                }
            }
this.ActiveMenu.update(data);
      
        });
        this.actions.subBroadcaster.add(updateActiveMenu);
     /*   this.elRef.nativeElement.addEventListener(
            'click',
            (event: any) => {
                if (event.target.classList.contains('edit-data-budget')) {
                    console.log('event.target',event.target);
                    event.stopPropagation();
                    this.actions.onInitEditBudget(this.stats.budget);
                    this.elRef.nativeElement.querySelector("#budget-change").addEventListener(
                        'keydown', (e) => {

                            if (e.keyCode === 13) {
                                this.elRef.nativeElement.querySelector('.edit-data-budget span').style.display = 'inline-block';
                                this.elRef.nativeElement.querySelector("#budget-change").style.display = 'none';
                                this.elRef.nativeElement.querySelector('.edit-data-budget').style.margin = '0px 30px 0px 0px';
                                this.httpService
                                    .updateBudget({
                                        dealerShipId: this.tableData.settings.dealerShipId,
                                        year: this.tableData.settings.year,
                                        month: this.tableData.settings.month,
                                        budgetTarget: this.elRef.nativeElement.querySelector("#budget-change").value,

                                    })
                                    .subscribe(data => {
                                        if (data.status === 200) {
                                            this.stats.budget = data.data.budget;
                                            this.stats.coop = data.data.coop;
                                            this.stats.expenses = data.data.expenses;
                                            this.stats.variance = data.data.variance;
                                            this.broadcaster.broadcast('updateData', new updateData(this.stats));
                                        }
                                    });
                            }
                        });
               
                }
            }, false);*/

        this.elRef.nativeElement.querySelector('.channel__all_trends label').addEventListener(
            'click',
            (event: any) => {
                this.Trends.setAllChannels(event,this.elRef.nativeElement);
             
                let result = this.Charts.chartTrends({ settings: { year: this.tableData.settings.year, month: this.tableData.settings.month, viewType: 'monthsOfYear' } }, this.Trends.data, this.Trends.ActiveMenu, this.Trends.channels);
                this.Trends.graph = result.graph;

            }, false);
        this.elRef.nativeElement.querySelector('.channel__all').addEventListener(
            'click',
            (event: any) => {

                if (this.ActiveMenu.sessions) {
                    this.ActiveMenu.sessions = false;
                    this.classAll = ['m--allHidden', 'm--hidden'];
                } else {
                    this.ActiveMenu.sessions = true;
                    this.classAll = ['m--allVisible', 'm--hidden-all'];
                }
                this.broadcaster.broadcast('updateActiveMenu',this.ActiveMenu);
                let result = this.Charts.chart(this.tableData, this.stats, this.ActiveMenu, this.channels, this.weeks, this.graph);
                this.graph = result.graph;
            }, false);
        if (window.localStorage.getItem('graphStatus') && Number(window.localStorage.getItem('graphStatus')) === 0) {
            this.elRef.nativeElement.querySelector('.default-graph .chart__wrap').style.display = 'none';
           
            this.graph.status = 0;
            document.body.querySelector('.right-main').classList.add('scroll-fixed-right-without-graph');
            if (window.pageYOffset < 80) {
                document.body.querySelector('.right-main').classList.add('scroll-fixed-right-without-graph-start');
                (<HTMLElement>document.body.querySelector('.time-line .confirm-switch')).style.display = 'none';

            }
            this.switchGraph = true;
            this.blockSwitchViewGraph = (this.switchGraph) ? true : false;
            if (this.blockSwitchViewGraph) {
                this.onChangeGraphView(false, true);

            }
            this.ref.detectChanges();
            window.localStorage.setItem('graphStatus', this.graph.status);
        }
        if (!window.localStorage.getItem('graphStatus')) {
            this.graph.status = 0;
            window.localStorage.setItem('graphStatus', this.graph.status);
            this.ToggleGraphs(false, false);
        }

        if (window.localStorage.getItem('viewCompactStatus') && !this.blockSwitchViewGraph) {
            this.switchViewGraph = (Number(window.localStorage.getItem('viewCompactStatus')) === 0 ? true : false);
            this.onChangeGraphView(this.switchViewGraph, true);
            this.ref.detectChanges();
        }
        if (!window.localStorage.getItem('viewCompactStatus')) {
            this.switchViewGraph = true;
            this.onChangeGraphView(this.switchViewGraph, true);
            this.ref.detectChanges();
        }
       let onInitGraph:Subscription =  this.broadcaster.on<any>('onInitGraph').subscribe((data:onInitGraph) => {
            if (data.action === 'onToggleGraphs') {
                this.ToggleGraphs(data.value, data.change);

            }
            if (data.action === 'onChangeGraphView') {
                this.onChangeGraphView(data.value, data.change);
            }
        });
        this.actions.subBroadcaster.add(onInitGraph);
       
    }
    EditTargetBudget(event) {
       
        if (this.rights.canManageOwnBudgets === 0) return;
      
        let input:HTMLInputElement = this.elRef.nativeElement.querySelector("#budget-change");
        this.actions.onInitEditBudget(this.stats.budget,input);
        input.addEventListener(
            'keyup', (e) => {
                this.generalService.ValidateMoney(e);
                if (e.keyCode === 13) {
                    this.elRef.nativeElement.querySelector('.edit-data-budget span').style.display = 'inline-block';
                    input.style.display = 'none';
                    this.elRef.nativeElement.querySelector('.edit-data-budget').style.margin = '0px 30px 0px 0px';
                    this.httpService
                        .updateBudget({
                            dealerShipId: this.tableData.settings.dealerShipId,
                            year: this.tableData.settings.year,
                            month: this.tableData.settings.month,
                            budgetTarget: input.value
                        })
                        .subscribe(data => {
                            if (data.status === 200) {
                                this.stats.budget = data.data.budget;
                                this.stats.coop = data.data.coop;
                                this.stats.expenses = data.data.expenses;
                                this.stats.variance = data.data.variance;
                                this.broadcaster.broadcast('updateData', new updateData(this.stats));
                                $(input).off('keyup');
                            }
                        });
                }
            });
   
    }
    ToggleGraphs(value: boolean, change: boolean) {
        this.switchGraph = value;
      
        this.blockSwitchViewGraph = (this.switchGraph) ? true : false;
       
        if (this.graph.status === 1) {
            this.graph.status = 0;
            this.actions.ToggleGraphsHidde(this.graph.status);
         
        }
        else {
            this.graph.status = 1;
            this.actions.ToggleGraphsShow(this.switchGraph,this.graph.status);
     
        }
        if (this.blockSwitchViewGraph) {
            this.onChangeGraphView(false, true);

        }

    }
    onChangeGraphView(value: boolean, change: boolean) {
        if (this.blockSwitchViewGraph && !change) return;
        this.switchViewGraph = value;
    this.actions.onChangeGraphView(this.switchViewGraph,this.switchGraph);

    }

    ToggleTrands() {

        if (this.elRef.nativeElement.querySelector('.trends').style.display === 'table-cell') {
         
            this.Trends.btn.title = 'Annual trend';
            this.Trends.allChannels = false;
            this.Trends.DefaultChannels();
             this.Trends.ActiveMenu.sessions = true;
            this.actions.hideTrands(this.switchViewGraph);
        }
        else {
            this.actions.showTrands();
            this.Trends.btn.title = 'Close trend graphic';
            this.httpService
                .getStats(new requestGetStats({
                    dealerGroupId: this.tableData.settings.dealerGroupId,
                    dealerShipId: this.tableData.settings.dealerShipId,
                    year: this.tableData.settings.year
                }), 'monthsOfYear')
                .subscribe((data:responseGetStats) => {
                   
                        this.Trends.setChannels(data.stats.channels,this.ActionChannels.circleColors);
                        this.Trends.setStats(data,this.actions);
                        let result = this.Charts.chartTrends({ settings: { year: this.tableData.settings.year, month: this.tableData.settings.month, viewType: 'monthsOfYear' } }, this.Trends.data, this.Trends.ActiveMenu, this.Trends.channels);  //  this.chartInitialized = result.chartInitialized;
                        this.Trends.graph = result.graph;
                        this.Trends.titlesHeader = this.actions.getYears(this.tableData.settings.month, this.tableData.settings.year);
                    
                });
        }
        this.ref.detectChanges();
    }
    SelectChannelTrends(channel: string) {
     
        this.Trends.selectChannel(channel,this.elRef.nativeElement);
        let result = this.Charts.chartTrends({ settings: { year: this.tableData.settings.year, month: this.tableData.settings.month, viewType: 'monthsOfYear' } }, this.Trends.data, this.Trends.ActiveMenu, this.Trends.channels);

        this.Trends.graph = result.graph;

    }
    getCurrentDate() {
        if (this.tableData.settings === undefined) return '';
        if (this.tableData.settings.viewType === 'daysOfMonth') return `${this.months[this.tableData.settings.month - 1]} ${this.tableData.settings.year}`;
        if (this.tableData.settings.viewType === 'monthsOfQuarter') return `${this.actions.quarters[this.tableData.settings.quarter - 1]}${String(this.tableData.settings.year).substring(2, 4)}`;
        if (this.tableData.settings.viewType === 'monthsOfYear') return `${this.tableData.settings.year}`;

    }
    UpdateTtitles() {
       
        if (this.tableData.settings === undefined) return;
        this.viewTable = (this.tableData.settings.viewType === 'daysOfMonth') ? 0 : (this.tableData.settings.viewType === 'monthsOfQuarter') ? 1 : 2;
        if (this.tableData.settings.viewType === 'daysOfMonth') {
            this.days = 32 - new Date(this.tableData.settings.year, this.tableData.settings.month - 1, 32).getDate();
            this.titlesHeader = this.actions.getTitles(this.days, this.tableData.settings.year, this.tableData.settings.month);
        }
        if (this.tableData.settings.viewType === 'monthsOfQuarter') {
            this.days = this.weeks.length;
            this.weeks = this.actions.getWeeks(this.weeks);

        }
        if (this.tableData.settings.viewType === 'monthsOfYear') {
            this.days = 12;
            this.titlesHeader = this.actions.getYears(this.tableData.settings.month, this.tableData.settings.year);

        }
    }
    SelectChannelTrendSession(id: number): void {

      this.Trends.updateChannels(id);

        let result = this.Charts.chartTrends({ settings: { year: this.tableData.settings.year, month: this.tableData.settings.month, viewType: 'monthsOfYear' } }, this.Trends.data, this.Trends.ActiveMenu, this.Trends.channels);  //  this.chartInitialized = result.chartInitialized;
        this.Trends.graph = result.graph;
    }
    SelectChannel(id: number): void {

        if (this.channels[id].hide) {
            this.channels[id].hide = false;
        } else {
            this.channels[id].hide = true;
        }
        let result = this.Charts.chart(this.tableData, this.stats, this.ActiveMenu, this.channels, this.weeks, this.graph);

        this.graph = result.graph;

    }
    ngOnDestroy() {
        
        this.actions.subBroadcaster.unsubscribe();
    }

}
