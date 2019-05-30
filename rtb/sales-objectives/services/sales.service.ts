import { SalesObjectives } from "../class/SalesObjectives";
import { ElementRef, Injectable } from '@angular/core';
import { Subscription } from "rxjs";

@Injectable()
export class Sales {
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    defaultSales = new SalesObjectives();
    subBroadcaster:Subscription = new Subscription();
    constructor(private elRef: ElementRef) {

    }
    public findDifferences(sales: any): boolean {
        for (let i = 0; i < sales.new.length; i++) {
            if (sales.new[i].value !== this.defaultSales.new[i].value || sales.used[i].value !== this.defaultSales.used[i].value) {
                return true;
            }
        }
        return false;

    }
    public checkValues(sales: any): boolean {
        for (let i = 0; i < sales.new.length; i++) {
            if (sales.new[i].value < 0 || sales.used[i].value < 0) {
                return false;
            }
        }
        return true;

    }
    public setDefaultSales(data: any) {

        this.defaultSales = JSON.parse(JSON.stringify(data));

    }
    public closedSales () {
        (<HTMLElement>document.body.querySelector('.allwhite')).style.display = 'none';
        document.body.querySelector('main.content').classList.remove('m--blur');
        this.elRef.nativeElement.querySelector('.preloader-mini-fon').style.display = 'none';
        this.elRef.nativeElement.querySelector('.preloader-mini').style.display = 'none';
        this.elRef.nativeElement.querySelector('.preloader-body-mini-fon').style.display = 'none';
        this.elRef.nativeElement.querySelector('.preloader-body-mini').style.display = 'none';
    }
}