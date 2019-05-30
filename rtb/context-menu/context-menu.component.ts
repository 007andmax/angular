import { Component, ElementRef, } from "@angular/core";
import { Broadcaster } from "../../service/Broadcaster";
import { SingService } from "../../service/sing.service";
import { TableData } from "../../class/table-data";
import { ItemMenu } from "./class/item-menu";
import { ContextMenuService } from "./services/context-menu.service";
import { Subscription } from "rxjs";

@Component({
    selector: "context-menu-comp",
    templateUrl: "html/context-menu.component.html",
    styleUrls: ["css/context-menu.component.css"], //up-menu/app.component.css
    providers: [ContextMenuService]
})
export class ContextMenuComponent {
    dataItemMenu:ItemMenu = new ItemMenu(); // data item menu 
    typItem: string = "";// type item menu 
    isMedia: boolean = false;
    tableData: TableData = new TableData();
    constructor(private broadcaster: Broadcaster, private elRef: ElementRef, private httpService: SingService, private action:ContextMenuService) { }
    ngOnInit() {

        if (this.httpService.getAuthData().loggedIn === "") return;
        let updateMediaCategories:Subscription = this.broadcaster.on<any>("updateMediaCategories").subscribe((data:Array<String>) => {

            this.action.mediaCategories = data;
        });
        this.action.subBroadcaster.add(updateMediaCategories);
        let right: any = this.httpService.getAuthData().identity.rights;
        if (right.canManageOwnBudgets === 0) return;
       let updateSettings:Subscription = this.broadcaster.on<any>("updateSettings").subscribe((data:TableData) => {
            this.tableData.setData(data.settings);

        });
        this.action.subBroadcaster.add(updateSettings);
       let setBlockMediaCategory:Subscription = this.broadcaster.on<boolean>("setBlockMediaCategory").subscribe((data:boolean) => {
            this.action.blockEditMedia = data;
        });
        this.action.subBroadcaster.add(setBlockMediaCategory);
        this.action.menu = this.elRef.nativeElement.querySelector("#context-menu");
     
        this.contextListener();
        this.clickListener();
        this.keyupListener();
        this.resizeListener();

    }
    init() {

        this.action.menu = this.elRef.nativeElement.querySelector("#context-menu");
      
        this.contextListener();
        this.clickListener();
        this.keyupListener();
        this.resizeListener();
    }

    contextListener() {
        document.addEventListener("contextmenu", (e: any) => {
            this.action.taskItemInContext = this.action.clickInsideElement(e, this.action.taskItemClassName);

            if (this.action.taskItemInContext) {
                e.preventDefault();
                let parent = this.action.getParentElement(e.target, "js-table-line");
                let categori = this.action.getParentElement(e.target, "tc__menu_item");
                this.typItem = parent.getAttribute("parent");
                this.action.currentItem = parent.querySelector(".tc__title");

                this.dataItemMenu.subproducts = false;
                if (this.typItem === "subparent" && parent.getAttribute("lenproducts") > 0) {
                    this.dataItemMenu.subproducts = true;
                }
                let indexMedia: number = this.action.mediaCategories.findIndex(item => item === categori.getAttribute("data-line").split("categories-").join(""))
                this.isMedia = (indexMedia !== (-1)) ? true : false;

                this.dataItemMenu.i = Number(parent.getAttribute("categories-id"));
                this.dataItemMenu.u = Number(parent.getAttribute("products-id"));
                this.dataItemMenu.g = Number(parent.getAttribute("subproducts-id"));
            
                if (this.isMedia && this.action.blockEditMedia) return;
                if (this.typItem === "product" && this.isMedia === true || this.typItem === "subparent" && this.isMedia === true || this.typItem === "product" && this.tableData.settings.viewType !== "daysOfMonth" || this.typItem === "parent" && this.tableData.settings.viewType !== "daysOfMonth" && this.isMedia === false || this.typItem === "subparent" && this.tableData.settings.viewType !== "daysOfMonth" && this.isMedia === false) {
                    this.action.toggleMenuOff();
                    return;
                }
                this.action.toggleMenuOn();
                this.action.positionMenu(e,this.typItem);


            } else {
                this.action.taskItemInContext = null;
                this.action.toggleMenuOff();
            }
        });
    }
   
    clickListener() {
        document.addEventListener("click", (e) => {
          
            var clickeElIsLink = this.action.clickInsideElement(e, this.action.contextMenuLinkClassName);

            if (clickeElIsLink) {
                e.preventDefault();
                this.dataItemMenu.action = (<HTMLElement>e.target).getAttribute("action");

                this.action.menuItemListener(this.dataItemMenu);
            } else {
                var button = e.which || e.button;
                if (button === 1) {
                    this.action.toggleMenuOff();
                }
            }
        });
    }

    keyupListener() {
        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                this.action.toggleMenuOff();
            }
        }
    }

    resizeListener() {
        window.onresize = (e) => {
            this.action.toggleMenuOff();
        };
    }
    ngOnDestroy() {
        
        this.action.subBroadcaster.unsubscribe();
    }
   
}
