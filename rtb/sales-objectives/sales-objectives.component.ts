import { Component, ElementRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { SingService } from '../../service/sing.service';
import { TableData } from '../../class/table-data';
import { SalesObjectives } from './class/SalesObjectives';
import { Sales } from './services/sales.service';
import { Alert } from 'app/components/class/alert/alert';
import { Confirm } from 'app/components/class/confirm';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sales-objectives-comp',
    templateUrl: 'sales-objectives.component.html',
    styleUrls: ['sales-objectives.component.css'],
    providers: [SingService, Sales]
})
export class SalesObjectivesComponent {
    display: string = 'none';
    years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];
    tableData: TableData = new TableData();
    sales: SalesObjectives = new SalesObjectives();
    ErrorValues: string = 'Value must not be less than 0';
    year: number = new Date().getFullYear();
    UpdateYears: boolean = false;
    constructor(private broadcaster: Broadcaster, private elRef: ElementRef, private httpService: SingService, public actions: Sales) { }
    ngOnInit() {
        let updateSettings:Subscription =  this.broadcaster.on<any>('updateSettings').subscribe((data:TableData) => {
            this.tableData.setData(data.settings);
            this.year = this.tableData.settings.year;
            this.UpdateYears = true;
        });
        this.actions.subBroadcaster.add(updateSettings);
        let closedSales:Subscription = this.broadcaster.on<any>('closedSales').subscribe(data => {
            this.closedSales();
        });
        this.actions.subBroadcaster.add(closedSales);
       let showSalesObjectives:Subscription = this.broadcaster.on<any>('showSalesObjectives').subscribe(data => {
            this.elRef.nativeElement.querySelector('.preloader-body-mini-fon').style.display = 'block';
            this.elRef.nativeElement.querySelector('.preloader-body-mini').style.display = 'block';
            this.getDataSales();

        });
        this.actions.subBroadcaster.add(showSalesObjectives);
        this.elRef.nativeElement.querySelector('#select-year').addEventListener(
            'change',
            (event) => {
               
                this.elRef.nativeElement.querySelector('.preloader-body-mini-fon').style.display = 'block';
                this.elRef.nativeElement.querySelector('.preloader-body-mini').style.display = 'block';
                this.year = event.target.value;
                this.getDataSales();

            }, false);
        this.elRef.nativeElement.querySelector('.save-sales').addEventListener(
            'click',
            (event) => {
                if (this.actions.checkValues(this.sales)) {
                    this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'block';
                    this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'block';

                    this.httpService.saveSalesObjectives({
                        dealerShipId: this.tableData.settings.dealerShipId, year: this.year,
                        data: this.sales
                    }).subscribe(res => {
                        if (res.status === 200 && res.data.saved === 1) {
                            this.closedSales();
                        }
                    }, error => {
                        this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'none';
                        this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'none';

                    });
                }
                else {
                    this.broadcaster.broadcast('showAlert', new Alert(this.ErrorValues,true));
                }


            }, false);
        this.elRef.nativeElement.querySelector('.sales-closed').addEventListener(
            'click',
            (event) => {
            
                if (this.actions.findDifferences(this.sales)) {
                    this.broadcaster.broadcast('Confirm', new Confirm("data","closedSales"));
                    return;
                }
                this.closedSales();
            }, false);


    }
    getDataSales() {
        this.httpService.getSalesObjectives({
            dealerShipId: this.tableData.settings.dealerShipId, year: this.year
        }).subscribe(res => {
            if (res.status === 200) {

              
                this.sales = new SalesObjectives();
                this.actions.setDefaultSales(res.data);
                this.sales.setData(res.data.new, res.data.used);
                this.display = 'block';
                (<HTMLElement>document.body.querySelector('.allwhite')).style.display = 'block';
                document.body.querySelector('main.content').classList.add('m--blur');

                this.elRef.nativeElement.querySelector('.preloader-body-mini-fon').style.display = 'none';
                this.elRef.nativeElement.querySelector('.preloader-body-mini').style.display = 'none';

            }
        }, error => {
            this.elRef.nativeElement.querySelector('.preloader-body-mini-fon').style.display = 'none';
            this.elRef.nativeElement.querySelector('.preloader-body-mini').style.display = 'none';
        });
    }
    callOnLastIteration() {
        if (this.UpdateYears) {
         
            this.elRef.nativeElement.querySelector('#select-year').value = this.year;

            this.UpdateYears = false;

        }

    }
    closedSales() {
        this.display = 'none';
       
        this.sales = new SalesObjectives();
        this.actions.defaultSales = new SalesObjectives();
      this.actions.closedSales();

    }
    trackByIndex(index, item) {
        return index;
    }
    ngOnDestroy() {
        // this.sub.unsubscribe();
        this.actions.subBroadcaster.unsubscribe();
     }
}