import { Coords } from "../class/coords";
import { ItemMenu } from "../class/item-menu";
import { Broadcaster } from "app/components/service/Broadcaster";
import { IndexExpense } from "app/components/class/index-expense";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
@Injectable()
export class ContextMenuService {
    contextMenuLinkClassName:String = "context-menu__link";
    contextMenuActive:string = "context-menu--active";
    taskItemClassName:String = "context-menu-target";
    taskItemInContext:HTMLElement;
    clickCoords:Coords;
    clickCoordsX:number;
    clickCoordsY:number;
    menu:HTMLElement;
    menuState:number = 0;
    menuWidth:number;
    menuHeight:number;
    windowWidth:number;
    windowHeight:number;
    currentItem: HTMLElement; // item context-menu cliked
    mediaCategories: Array<String> = [];
    blockEditMedia: boolean = false;
    subBroadcaster:Subscription = new Subscription();
    constructor(private broadcaster: Broadcaster){}
    public getPosition(e: any):Coords {
       
        let coords:Coords = new Coords();

        if (!e) var e: any = window.event;

        if (e.pageX || e.pageY) {
            coords.x = e.pageX;
            coords.y = e.pageY;
        } else if (e.clientX || e.clientY) {
            coords.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            coords.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return coords;
    }
    public  clickInsideElement(e, className) {
        var el = e.srcElement || e.target;

        if (el.classList.contains(className)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
            }
        }

        return false;
    }
    public  getParentElement(p, clas: string) {
        let parent = p;
        while (!parent.classList.contains(clas)) {

            parent = parent.parentNode;
         
        }
        return parent;
    }
    public   toggleMenuOn() {
      
        if (this.menuState !== 1) {
            this.menuState = 1;
            this.menu.classList.add(this.contextMenuActive);
        }
    }
    public  toggleMenuOff() {
        if (this.menuState !== 0) {
            this.menuState = 0;
            this.menu.classList.remove(this.contextMenuActive);
        }
    }
   public positionMenu(e,typItem:String) {
        this.clickCoords = this.getPosition(e);
        this.clickCoordsX = this.clickCoords.x;
        this.clickCoordsY = this.clickCoords.y;

        this.menuWidth = this.menu.offsetWidth + 4;
        this.menuHeight = ((typItem === "parent") ? 80 : (typItem === "parent") ? 106 : 106) + 4;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        if ((this.windowWidth - this.clickCoordsX) < this.menuWidth) {
            this.menu.style.left = this.windowWidth - this.menuWidth + "px";
        } else {
            this.menu.style.left = this.clickCoordsX + "px";
        }

        if ((this.currentItem.getBoundingClientRect().top + (this.currentItem.offsetHeight / 2) + this.menuHeight) > this.windowHeight) {
            this.menu.style.top = (window.pageYOffset + this.windowHeight) - this.menuHeight + "px";
        } else {
            this.menu.style.top = this.clickCoordsY + "px";
        }
    }
   public menuItemListener(dataItemMenu:ItemMenu) {
        this.toggleMenuOff();
      
        if (dataItemMenu.action === "change-summ") {
          
            this.broadcaster.broadcast("showChangeSumm", new IndexExpense(dataItemMenu.i,dataItemMenu.u));
            return;
        }
        if (dataItemMenu.action === "add-product-categori") {
            this.broadcaster.broadcast("scrollToAddProduct",new IndexExpense(dataItemMenu.i));
            return;
        }
        if (dataItemMenu.action === "add-media") {
            this.broadcaster.broadcast("setDataMediaCalendar", new IndexExpense(dataItemMenu.i));
            return;
        }
        if (dataItemMenu.action === "rename-product") {
            this.broadcaster.broadcast("renameGetProduct",new IndexExpense(dataItemMenu.i,dataItemMenu.u));
            return;
        }
        if (dataItemMenu.action === "rename") {
            this.broadcaster.broadcast("renameGetCategori",new IndexExpense(dataItemMenu.i));
            return;
        }

        this.broadcaster.broadcast("setEditMode", dataItemMenu);
    }
}