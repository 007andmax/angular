
import { Component, ElementRef } from '@angular/core';
import { Broadcaster } from '../../service/Broadcaster';
import { SingService } from '../../service/sing.service';
import { updateCategories } from 'app/components/class/broadcaster/update-categories';
import { showMediaCalendar } from 'app/components/class/broadcaster/show-media-calendar';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TableData } from 'app/components/class/table-data';
import { Client } from 'app/components/app/class/client';
import {Subscription} from 'rxjs';
import { DealerShip } from 'app/components/class/dealer-ship';
import { Settings } from 'app/components/class/setting';
import { Actions } from './services/actions.service';

@Component({
  selector: 'rtb-app',
  templateUrl: 'rtb.component.html',
  styleUrls: ['rtb.component.css'],
  providers: [SingService,Actions]
})
export class RtbComponent {
  Auth: boolean = false;
  preloader: boolean = true;
  footer = { height: '100px', container: null };
  settings: any = { preloader: 'block', main: 'none' }
  startStopBlockScroll: boolean = false;
  blockScrollEvent: boolean = false;
  countCategoryes: number = 0;
  sub:Subscription;
  constructor(
    private broadcaster: Broadcaster,
    private elementRef: ElementRef,
    private httpService: SingService,
    private route:ActivatedRoute,
    private router:Router,
    private actions:Actions
  ) { }
  ngOnInit() {
    
    if (this.httpService.getAuthData().loggedIn !== "") {
     
      this.sub = this.route.params.subscribe(params => {
       
        this.preloader = true;
        this.elementRef.nativeElement.querySelector('main').style.display = 'none';
        this.elementRef.nativeElement.querySelector('#preloader').style.display = 'block';
      });
     let updateCategories:Subscription = this.broadcaster.on<any>('updateCategories').subscribe((data:updateCategories) => {
     
        this.countCategoryes = data.categories.length;

      });
      this.actions.subBroadcaster.add(updateCategories);
     let setblockScrollEvent:Subscription =  this.broadcaster.on<boolean>('setblockScrollEvent').subscribe(data => {
        this.blockScrollEvent = data;
      });
      this.actions.subBroadcaster.add(setblockScrollEvent);
      let showMediaCalendar:Subscription = this.broadcaster.on<any>('showMediaCalendar').subscribe((data:showMediaCalendar) => {
        this.blockScrollEvent = true;
      });
      this.actions.subBroadcaster.add(showMediaCalendar);
     let closedMediaCalendar:Subscription = this.broadcaster.on<any>('closedMediaCalendar').subscribe(data => {
        this.blockScrollEvent = (this.countCategoryes === 0) ? true : false;
      });
      this.actions.subBroadcaster.add(closedMediaCalendar);
      let rights: any = this.httpService.getAuthData().identity.rights;
      if (rights.canViewBudget === 0) {
       // window.location.href = "/";
        this.router.navigate(['/']);
      }
      this.Auth = true;
     let stopPreloader:Subscription = this.broadcaster.on<any>('stopPreloader').subscribe((data:boolean) => {
        this.preloader = false;
        this.elementRef.nativeElement.querySelector('main').style.display = 'block';
        this.elementRef.nativeElement.querySelector('#preloader').style.display = 'none';

      });
      this.actions.subBroadcaster.add(stopPreloader);
      let startPreloader:Subscription = this.broadcaster.on<any>('startPreloader').subscribe(data => {
        this.preloader = true;
        this.elementRef.nativeElement.querySelector('main').style.display = 'none';
        this.elementRef.nativeElement.querySelector('#preloader').style.display = 'block';

      });
      this.actions.subBroadcaster.add(startPreloader);
      window.onscroll = (event: any) => {

        if (document.body.classList.contains('stop-scrolling') || this.blockScrollEvent) return;
      
        if (window.pageYOffset >= 80) {

          (<HTMLElement>document.body.querySelector('.header .logo-img')).style.display = "none";
          (<HTMLElement>document.body.querySelector('.header .rooftops-in-head')).style.display = "flex";
        }
        else {
          (<HTMLElement>document.body.querySelector('.header .logo-img')).style.display = "block";
          (<HTMLElement>document.body.querySelector('.header .rooftops-in-head')).style.display = "none";

        }

      };
    }
    else {
      this.elementRef.nativeElement.querySelector('#preloader').remove();
      this.router.navigate(['/']);
    //  window.location.href = "/";
      this.Auth = false;
    }


  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.actions.subBroadcaster.unsubscribe();
}
  ngDoCheck() {

    this.footer.container = this.elementRef.nativeElement.querySelector('.main-fon');
  
    this.footer.height = (document.documentElement.clientHeight >= (this.footer.container.offsetHeight + 80)) ? `${(document.documentElement.clientHeight - (this.footer.container.offsetHeight + 80)) > 100 ? (document.documentElement.clientHeight - (this.footer.container.offsetHeight + 80)) : 100}px` : '100px';
  }
}
