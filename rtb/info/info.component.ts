import { Component, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Broadcaster } from "../../service/Broadcaster";
import { SingService } from "../../service/sing.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ExpenseService } from "./services/info.component.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { EditModeInfoExpense } from "./class/editMode-Info-expense";
import { Expense } from "../../class/expense/expense";
import { Rights } from "app/components/class/rights";
import { CreateProduct} from "./class/create-product";
import { responseSaveExpense } from "app/components/class/http/res/response-save-expense";
import { updateInfoItem } from "app/components/class/broadcaster/update-info-item";
import {  AddCampaignInit } from "app/components/class/broadcaster/add-campaign/add-campaign-init";
import { TableData } from "../../class/table-data";
import { Error } from "../../class/broadcaster/app/error";
import { Alert } from "app/components/class/alert/alert";
import { ShowFile } from "./class/show-file";
import { GoogleConfig } from "app/components/class/info-expense/google-config";
import { setflightDate } from "app/components/class/broadcaster/info-expense/set-flight-date";
import { setWidthParams } from "app/components/class/broadcaster/info-expense/set-width-params";
import { showEditMode } from "app/components/class/info-expense/show-edit-mode";
import { Coop } from "./class/coop";
import {  responseGetExpensePeriod } from "app/components/class/http/res/response-get-expense-reriod";
import { responseGetExpense } from "app/components/class/http/res/response-get-expense";
import { responsecreateProduct } from "app/components/class/http/res/response-create-product";
import { DeleteFileExpense } from "./class/delete-file-expense";
import { responseRemoveFileExpense } from "app/components/class/http/res/response-remove-file-expense";
import { responseGetExpenseFiles } from "app/components/class/http/res/response-get-expense-files";
import { Confirm } from "app/components/class/confirm";
import { IndexExpense } from "app/components/class/index-expense";
import { CreateNewProduct } from "app/components/class/broadcaster/info-expense/create-new-product";
import { AddNewProduct } from "app/components/class/broadcaster/info-expense/add-new-product";
import { updateExpense } from "app/components/class/broadcaster/info-expense/update-expense";
import { FlightDate } from "app/components/class/expense/flight-date";
import { FlightDateSave } from "app/components/class/expense/flight-date-save";
import { ExpensePeriod } from "app/components/class/expense/expense-reriod";
import { responseAddExpense } from "app/components/class/http/res/response-add-expense";
import { Subscription } from "rxjs";
import { Category } from "app/components/class/category/category";
import { Product } from "app/components/class/product/product";
import { QueryParamsExpense } from "app/components/interfaces/query-params-expense";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "info-comp",
    templateUrl: "html/info.component.html",
    styleUrls: ["css/info.component.min.css", "css/info.component.css"],
    providers: [ExpenseService, SingService],
    animations: [
        trigger("moveAnimation", [
            state("start", style({
                top: "-350px",
            })),
            state("end", style({
                top: "79px",
            })),
            transition("start => end", animate("750ms ease-in"))
        ]),
    ]
})
export class InfoComponent {
    move: string = "start";
    display: string = "none";
    ListCreative: any = [];
    widthPhoto: number = 0;
    ShowFile: ShowFile = new ShowFile ();
    editMode: EditModeInfoExpense = new EditModeInfoExpense();
    rights: Rights;
    expenseIndex: number = 0;
    listExpenses: Array<Expense> = [];
    months:Array<String> = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    quarters: Array<String> = ["1st Quarter:",

        "2nd Quarter:",

        "3rd Quarter:",

        "4th Quarter:"];
    weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    indexFolder:number = 0;
    
    constructor(private broadcaster: Broadcaster,
        private elRef: ElementRef,
        private httpService: SingService,
        private ref: ChangeDetectorRef, private sanitizer: DomSanitizer, private InfoService: ExpenseService, private route: ActivatedRoute,) { }
    ngOnInit() {
        this.InfoService.subParams = this.route.params.subscribe(params => {
           
           
            })
          

      
        Dropzone.autoDiscover = false;
        if (this.InfoService.getAuthData().loggedIn !== "") {
            this.InfoService.getConfGoogle().subscribe((data:GoogleConfig) => {

           
                    this.editMode.CLIENT_ID = data.clientId;
                    this.editMode.API_KEY = data.apiKey;
                    this.editMode.serviceAccount = data.serviceAccount;
            
            });
            let updateSettings:Subscription = this.broadcaster.on<any>("updateSettings").subscribe((data:TableData) => {
                this.editMode.settings = data.settings;
            
            });
            this.InfoService.subBroadcaster.add(updateSettings);
            this.rights = this.InfoService.getAuthData().identity.rights;
            if (this.rights.canManageOwnBudgets !== 1) {
                this.elRef.nativeElement.querySelector(".info-fon-details-up").classList.add("info-fon-details-up-border");

            }


        }
      this.InfoService.onInit();
      
       let closedEditflightDate:Subscription =  this.broadcaster.on<any>("closedEditflightDate").subscribe(data => {
            this.ClosedMask();
        });
        this.InfoService.subBroadcaster.add(closedEditflightDate);
      let setBlockMediaCategory:Subscription =  this.broadcaster.on<boolean>("setBlockMediaCategory").subscribe((data:boolean) => {
            this.editMode.blockEditMedia = data;
        });
   
        this.InfoService.subBroadcaster.add(setBlockMediaCategory);
       let saveInfoExpenseAndShowMediaNextStep:Subscription = this.broadcaster.on<any>("saveInfoExpenseAndShowMediaNextStep").subscribe(data => {
            this.editMode.showMediaCategory = true;
            this.Save();
        });
        this.InfoService.subBroadcaster.add(saveInfoExpenseAndShowMediaNextStep);
       let setflightDate:Subscription = this.broadcaster.on<any>("setflightDate").subscribe((data:setflightDate) => {
           
            this.listExpenses[this.expenseIndex].flightDate = this.InfoService.updateTargetBudget(data.flightDate, data.targetBudget);

        });
        this.InfoService.subBroadcaster.add(setflightDate);
       let setWidthParams:Subscription =  this.broadcaster.on<any>("setWidthParams").subscribe((data:setWidthParams) => {
            this.editMode.days = data.days;
            let result: number = 0;
            if (this.editMode.days === 31) {
                this.widthPhoto = (data.cellWidth * 16);
                result = (data.cellWidth * 15);
            }
            else {
                if (this.editMode.days === 30) {
                    this.widthPhoto = (data.cellWidth * 15);
                    result = (data.cellWidth * 15);
                }
                else {
                    this.widthPhoto = Math.ceil(this.editMode.days / 2) * data.cellWidth;
                    result = Math.floor(this.editMode.days / 2) * data.cellWidth;
                }
            }
            this.elRef.nativeElement.querySelector(".info-full").style.width = `${this.widthPhoto - 40}px`;

            this.InfoService.setWidthParams(this.widthPhoto, result);
        });
        this.InfoService.subBroadcaster.add(setWidthParams);
        let showEditMode:Subscription = this.broadcaster.on<any>("showEditMode").subscribe((data:showEditMode) => {
        
            this.editMode.show(data);
           
            if (data.action === "add-product" || data.action === "add-new-product" || data.action === "create-new-product") {
             this.InfoService.onInitAddProduct(data.title);
                this.listExpenses =
                    [this.InfoService.getDefaultExpense(this.editMode.settings)];
                this.InfoService.clearData();
                this.InfoService.setDefaultExpense(this.InfoService.getDefaultExpense(this.editMode.settings));
                this.ListCreative.push([]);
                this.showExpense();
        
                this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
                if (this.rights.canManageOwnBudgets === 1) {
                    this.InfoService.showGoodleDiskBtn();
                  
                }
                if (this.InfoService.Dropzones !== null) {
                    this.InfoService.Dropzones.disable();
                }
            }
        });
        this.InfoService.subBroadcaster.add(showEditMode);
       let getCoop:Subscription =  this.broadcaster.on<any>("getCoop").subscribe((data:Coop) => {
            this.InfoService.setCoop(this.listExpenses[this.expenseIndex],data);
        });
        this.InfoService.subBroadcaster.add(getCoop);
       let updateInfoItem:Subscription = this.broadcaster.on<any>("updateInfoItem").subscribe((data:updateInfoItem) => {
            if (data.action === "closed") {
                if (this.InfoService.findDifferences(this.listExpenses)) return;

            }
            if (data.id === null) {
                if (this.display === "block") {
                    this.display = "none";
                
                    this.move = "start";
                    this.editMode.isMedia = false;
                    this.editMode.error = false;
                    this.ShowFile.display = "none";
this.indexFolder = 0;
                    this.expenseIndex = 0;
                    this.ShowFile.show = false;
                    this.ShowFile.url = "";//this.sanitizer.bypassSecurityTrustResourceUrl("")
                    this.ListCreative = [];
                    if (this.InfoService.fotoramaData !== null) {
                        $("#slider-files").slick("unslick");
                        this.InfoService.fotoramaData = null;
                    }
                    this.InfoService.ClosedInfoExpense(this.InfoService.parentId);
                    this.InfoService.parentId = "";
                    if (document.body.querySelectorAll(".container")[1].classList.contains("main-margin")) {
                        document.body.querySelectorAll(".container")[1].classList.remove("main-margin");
                    }
                    if (this.editMode.showMediaCategory) {
                        this.broadcaster.broadcast("setDataMediaCalendar", new IndexExpense (this.editMode.dataId.i));
                        this.editMode.showMediaCategory = false;
                    }
                    this.editMode.add_comapin = false;
                    this.ClosedMask();
                }
             this.InfoService.onInitClosed();
                return;
            }
       
            this.editMode.update(data,this.InfoService.mediaCategories);
            this.InfoService.addProductName(data.productTitle);
            this.elRef.nativeElement.querySelector(".info-fon-details").scrollTo(0, 0);
            if (this.display === "block") {
               this.InfoService.toogleSelectRow(false);
                if (this.InfoService.fotoramaData !== null) {

                    $("#slider-files").slick("unslick");
                    this.InfoService.fotoramaData = null;
                    this.InfoService.fotoramaInit = false;
                }
                if (this.InfoService.parentId === data.parentId) {
                    this.InfoService.parentId = data.parentId;
                    this.InfoService.toogleSelectRow(true);
                    this.updateTitleTable();
                    return;
                }
            }
            this.editMode.showProcent = false;
            this.InfoService.hideGoodleDiskBtn();
            this.ShowFile.display = "none";
            this.ShowFile.show = false;
            this.InfoService.parentId = data.parentId;
            this.InfoService.toogleSelectRow(true);
         

            this.ListCreative = [];
            this.editMode.settings = data.settings;
            this.InfoService.OneFileInit = false;
            if (this.editMode.settings.viewType === "daysOfMonth") {
            this.InfoService.hidePreloader();
                this.InfoService.getExpenseData(Number(data.id))
                    .subscribe((data:responseGetExpense) => {
                            this.setDataRequest(data.expense);
                    });
            }
            if (this.editMode.settings.viewType === "monthsOfQuarter" || this.editMode.settings.viewType === "monthsOfYear") {
             this.InfoService.showPreloader();
                this.InfoService.dataPeriod = data.dataPeriod;
                this.InfoService.getExpensePeriod(data.dataPeriod)
                    .subscribe((data:responseGetExpensePeriod) => {
                      
                            this.setExpensePeriod(data.list);
                        
                    });
            }


        });
        this.InfoService.subBroadcaster.add(updateInfoItem);
        this.elRef.nativeElement.querySelector("#remove-file").addEventListener(
            "click",
            (event) => {
                if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length === 0) {
                    this.listExpenses[this.expenseIndex].creativeId = "";
                    this.ListCreative[this.expenseIndex] = [];
                    this.InfoService.showGoodleDiskBtn();
                    this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
                    this.ShowFile.display = "none";
                    this.InfoService.fotoramaData = null;
                    this.ref.detectChanges();
                    return;
                }
                let id = (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length > 1) ? this.elRef.nativeElement.querySelector(".slick-active").getAttribute("id") : 0;
                let index: number = (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length > 1) ? this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.findIndex(element => element.fileId === Number(id)) : 0;
                index = (index < 0) ? 0 : index;
              //  let req:DeleteFileExpense = new DeleteFileExpense(this.listExpenses[this.expenseIndex].id,this.listExpenses[this.expenseIndex].folders[this.indexFolder].files[index].id);
                this.InfoService.removeFileExpense(this.listExpenses[this.expenseIndex].folders[this.indexFolder].files[index].fileId)
                    .subscribe((data: responseRemoveFileExpense) => {
                            if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length > 1) {
                                $("#slider-files").slick("slickRemove", $("#slider-files").slick("slickCurrentSlide"));//index
                                this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.splice(index, 1);
                            }
                            else {
                                this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.splice(0, 1);
                            }


                            if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length === 0) {
                                this.ShowFile.display = "none";
                                this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
                                if (this.rights.canManageOwnBudgets === 1) {
                                    this.InfoService.showGoodleDiskBtn();
                                }

                                this.InfoService.fotoramaData = null;
                                this.InfoService.fotoramaInit = false;
                                this.InfoService.OneFileInit = false;
                            }
                            else {
                                $("#slider-files").slick("unslick");
                                this.InfoService.fotoramaData = null;

                                this.InfoService.fotoramaInit = false;
                                if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length === 1) {
                                    this.InfoService.OneFileInit = false;
                                }
                            }
                            this.ref.detectChanges();
                    });
            }, false);


        $(this.elRef.nativeElement).on("mouseenter", ".edit-flight-date-days span", (e) => {
            this.editMode.onInitFlightDate(e);
        
        });
        this.elRef.nativeElement.querySelector(".google-disk").addEventListener(
            "click",
            (event) => {
            
                if (window.localStorage.getItem("google_token") !== null) {
                    let google_token = JSON.parse(window.localStorage.getItem("google_token"));
                    if (google_token.live > new Date().getTime()) {
                        this.editMode.oauthToken = google_token.access_token;

                        gapi.load("picker", {
                            "callback": () => {
                                this.editMode.pickerApiLoaded = true;
                                this.createPicker();
                            }
                        });
                    }
                    else {
                        this.AuthGoogle();
                    }
                }
                else {
                    this.AuthGoogle();
                }
            }, false);
        this.elRef.nativeElement.querySelector(".edit-btns-apply").addEventListener(
            "click",
            (event) => {
                this.editMode.defaultValEditDate.addDate = false;
               
                if (this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].start.day !== this.editMode.defaultValEditDate.start || this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].end.day !== this.editMode.defaultValEditDate.end) {
                    this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].start.day = Number(this.editMode.daysMonth[this.editMode.start].label);
                    this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].end.day = Number(this.editMode.daysMonth[this.editMode.end].label);
                    
                }
              
                this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].targetBudget = (typeof this.editMode.defaultValEditDate.targetBudget === "number") ? this.editMode.defaultValEditDate.targetBudget : 0;
                this.listExpenses[this.expenseIndex].targetBudget = this.InfoService.getAllBudgets(this.listExpenses[this.expenseIndex].flightDate);
                this.listExpenses[this.expenseIndex].coop = Number((Number(this.listExpenses[this.expenseIndex].coopPercent) * this.listExpenses[this.expenseIndex].targetBudget / 100));
               
                this.listExpenses[this.expenseIndex] = this.InfoService.resetPercentages(this.listExpenses[this.expenseIndex]);
             
            
                this.ClosedMask();
            }, false);

        this.elRef.nativeElement.querySelector("#add-files").addEventListener(
            "click",
            (event) => {
             this.InfoService.onInitAddFiles();
                this.ShowFile.display = "none";

                this.ref.detectChanges();
            }, false);
        this.elRef.nativeElement.querySelector(".edit-btns-update").addEventListener(
            "click",
            (event) => {
              
               this.editMode.resetEditFlightDate(-1,this.InfoService);
            }, false);
        this.elRef.nativeElement.querySelector(".modal-edit-mask").addEventListener(
            "click",
            (event) => {
                if (!this.InfoService.checkForCliseEditFlightDate(this.editMode,this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex])) return;
                this.ClosedMask();
            }, false);
        this.elRef.nativeElement.querySelector(".back-after-add-files").addEventListener(
            "click",
            (event) => {
                this.elRef.nativeElement.querySelector(".back-after-add-files").style.display = "none";
                this.completeUploadFiles();
            }, false);
        this.elRef.nativeElement.querySelector(".complete-upload").addEventListener(
            "click",
            (event) => {
                this.completeUploadFiles();
            }, false);
    }

    AuthGoogle() {
        gapi.load("auth", {
            "callback": () => {

                gapi.auth.authorize(
                    {
                        "apiKey": this.editMode.API_KEY,
                        "client_id": this.editMode.CLIENT_ID,
                        "scope": this.editMode.SCOPES,
                        "discoveryDocs": ["https://people.googleapis.com/$discovery/rest?version=v1"],
                        "immediate": false
                    },
                    (authResult) => {
                        if (authResult && !authResult.error) {
                            this.editMode.oauthToken = authResult.access_token;
                            let google_token = { access_token: authResult.access_token, live: new Date().getTime() + 3600000 };
                            window.localStorage.setItem("google_token", JSON.stringify(google_token));

                            gapi.load("picker", {
                                "callback": () => {
                                    this.editMode.pickerApiLoaded = true;
                                    this.createPicker();
                                }
                            });
                        }
                    });
            }
        });
    }
    completeUploadFiles() {
        this.editMode.error = false;
        this.editMode.uploadFileData.complete = false;
        this.editMode.preloader = false;
        this.editMode.uploadFileData.count = 0;
        this.editMode.uploadFileData.length = 0;


        this.elRef.nativeElement.querySelector(".info-fon-photo-no-hover").style.display = "table";
        this.elRef.nativeElement.querySelector(".info-fon-photo-hover").style.display = "none";
        this.InfoService.getExpenseFiles(this.listExpenses[this.expenseIndex].id,0)
            .subscribe((data:responseGetExpenseFiles) => {

                this.ListCreative[this.expenseIndex] = [];
                if (data.list.length >= 1) {
                    this.listExpenses[this.expenseIndex].folders[this.indexFolder].files = data.list;
                    if (data.list.length === 1) {
                       // this.listExpenses[this.expenseIndex].folders[this.indexFolder].files = data.list;
                        this.InfoService.OneFileInit = false;


                    }
                    this.ShowFile.display = "block";
                    this.InfoService.hideGoodleDiskBtn();
                    this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "none";
                    this.InfoService.fotoramaInit = false;
                    this.ref.detectChanges();
                }
                else {
                    
                    if (data.list.length === 1) {
                        this.listExpenses[this.expenseIndex].folders[this.indexFolder].files = data.list;
                        this.InfoService.OneFileInit = false;


                    }
                    this.ShowFile.display = "none";
                    this.InfoService.showGoodleDiskBtn();
                    this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
                    this.ref.detectChanges();
                }
            });
    }
    createPicker() {

        if (this.editMode.pickerApiLoaded && this.editMode.oauthToken) {

            var view = new google.picker.DocsView().
                setIncludeFolders(true).
                setSelectFolderEnabled(true);

            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setOAuthToken(this.editMode.oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())

                .setCallback((data) => {
                    if (data.action == google.picker.Action.PICKED) {

                        this.InfoService.getFilePermission(data.docs[0].id, this.editMode.oauthToken, this.editMode.serviceAccount);
                        this.ShowFile.display = "block";
                        this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "none";
                        this.InfoService.hideGoodleDiskBtn();
                       
                        this.listExpenses[this.expenseIndex].creativeId = JSON.stringify({ id: data.docs[0].id, type: data.docs[0].type });
                        let dataCreativeId = JSON.parse(this.listExpenses[this.expenseIndex].creativeId);
                        this.retrieveAllFiles(dataCreativeId.id);

                    }
                })
                .build();
            picker.setVisible(true);
        }
    }
    getWidthContainerPhoto() {
        return `${this.widthPhoto}px`;
    }
   
    EditValueExpense(event, targetBudget: boolean = false,actualBudget: boolean = false, coop:boolean = false) {
        if (this.rights.canManageOwnBudgets === 0) return;
        if (this.editMode.isMedia && this.editMode.blockEditMedia || this.editMode.isMedia && this.editMode.settings.viewType !== "daysOfMonth") {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorEditMediaCategoryValues));
            return;
        }
        if (this.editMode.isMedia && !this.editMode.blockEditMedia) {
          
            this.broadcaster.broadcast("Confirm", new Confirm ("data","saveInfoExpenseAndShowMedia") );
            return;
        }
        this.InfoService.tableIndex = this.InfoService.getTableIndex(event);

        this.InfoService.EditValueExpense(event,this.listExpenses[this.expenseIndex], targetBudget,actualBudget,coop);

    }
    EditValueTextArea(event) {
        this.InfoService.tableIndex = this.InfoService.getTableIndex(event);
    }
    setValueText(data: any) {
        this.listExpenses[this.expenseIndex][data.label] = data.text;
        this.ref.detectChanges();
    }
    selectFlightDate(i: number) {

        if (this.listExpenses[this.expenseIndex].flightDate[i].targetBudget > 0) {
            this.setflightDateIndex(i);
        }
        else {
            this.editMode.flightDateIndex = i;
        }
    }
    selectFlightDatePeriod(i: number, u: number) {
       
        if (this.expenseIndex !== i) {
            this.expenseIndex = i;
           this.InfoService.hideGoodleDiskBtn();
            if (this.InfoService.fotoramaData !== null) {
                $("#slider-files").slick("unslick");
                this.InfoService.fotoramaData = null;
            }
            this.getCreativeAndFiles();
        }
        this.expenseIndex = i;
        this.editMode.isMedia = (this.listExpenses[this.expenseIndex].isMedia === 1) ? true : false;
        if (this.listExpenses[this.expenseIndex].flightDate[u].targetBudget > 0) {
            this.setflightDateIndex(u);
        }
        else {
            this.editMode.flightDateIndex = u;
        }
        this.editMode.currentDate = new Date(this.listExpenses[this.expenseIndex].flightDate[0].start.year, this.listExpenses[this.expenseIndex].flightDate[0].start.month - 1, 1);

    }
    setExpensePeriod(data: Array<ExpensePeriod>) {

        this.editMode.listIdExpenses = [];
        this.listExpenses = [];
        this.expenseIndex = 0;
        this.editMode.counterExpenses = 0;
        this.InfoService.clearData();
        for (let i = 0; i < data.length; i++) {
            let indexExpense: number = this.editMode.listIdExpenses.findIndex(element => element === data[i].id);
            if (indexExpense === (-1)) {
                this.editMode.listIdExpenses.push(data[i].id);
            }

        }
       
        this.getExpensePeriodData();
    }
    getIndex(i: number, u: number): number {
        if (i === 0) return u;
        return (i * this.listExpenses[i - 1].flightDate.length + u);
    }
    getCreativeAndFiles() {
        this.elRef.nativeElement.querySelector(".dropzone").setAttribute("action", `/api/files/upload?expenseId=${this.listExpenses[this.expenseIndex].id}&folderId=0`);
        if (this.rights.canManageOwnBudgets === 1 && this.InfoService.Dropzones === null) {
            let stage = this;
            this.InfoService.Dropzones = new Dropzone(".dropzone", {
                paramName: "uploadedFile",
                previewTemplate: "",
                maxFilesize: 1000,
                maxThumbnailFilesize: 1000,
                timeout: 0,
                drop: function () {
                  
                },
                accept: function (file, done) {
                  

                    done();
                },
                error: function (errorMessage) {
                 
                    let Errors = JSON.parse(errorMessage.xhr.response);
                    stage.broadcaster.broadcast(
                        "InfoError",
                        new Error( Errors.errorName, Errors.errors.uploadedFile )
                    );
                    stage.editMode.error = true;
                },
                dragover: function () {

                    stage.elRef.nativeElement.querySelector(".info-fon-photo-no-hover").style.display = "none";
                    stage.elRef.nativeElement.querySelector(".info-fon-photo-hover").style.display = "table";
                },
                dragleave: function () {

                    stage.elRef.nativeElement.querySelector(".info-fon-photo-no-hover").style.display = "table";
                    stage.elRef.nativeElement.querySelector(".info-fon-photo-hover").style.display = "none";
                },
                addedfile: function (file) {
                 
                    stage.InfoService.hideGoodleDiskBtn();
                    stage.elRef.nativeElement.querySelector(".back-after-add-files").style.display = "none";
                    stage.editMode.uploadFileData.length++;

                },
                thumbnail: function (file, dataUrl) {
                

                },
                uploadprogress: function (file, progress, bytesSent) {
                  
                    stage.elRef.nativeElement.querySelector(".progrees-upload-expense-files p").innerText = file.name;
                    stage.elRef.nativeElement.querySelector(".progrees-upload-expense-files .progrees-upload-size").innerText = `${(file.size / 1000000).toFixed(1)} MB`;
                    stage.elRef.nativeElement.querySelector(".uploaded-buty").style.left = `-${125 - progress * 1.25}px`;
                },
                sending: function (file, xhr, formData) {
                  
                    stage.elRef.nativeElement.querySelector(".info-fon-photo-no-hover").style.display = "none";
                    stage.elRef.nativeElement.querySelector(".info-fon-photo-hover").style.display = "none";
                    if (!stage.editMode.preloader) {
                        stage.editMode.preloader = true;
                    }


                },
                complete: function () {
             
                    stage.editMode.uploadFileData.count++;
                    if (stage.editMode.uploadFileData.count === stage.editMode.uploadFileData.length) {
                        stage.editMode.uploadFileData.complete = true;
                    }

                },
            });

        }
        else {
            if (this.rights.canManageOwnBudgets === 1) {
                this.InfoService.Dropzones.enable();
                this.InfoService.Dropzones.options.url = `/api/files/upload?expenseId=${this.listExpenses[this.expenseIndex].id}&folderId=0`;
            }


        }
        if (this.ListCreative.length === 0 && this.listExpenses.length > 0) {
            this.ListCreative = this.InfoService.getDefaultListCreative(this.listExpenses.length);

        }
        if (this.listExpenses[this.expenseIndex].creativeId === "") {
            if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length >= 1) {
                this.ShowFile.display = "block";
                this.InfoService.hideGoodleDiskBtn();
                this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "none";
                if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length === 1) {
                    this.InfoService.OneFileInit = false;
                }
                else {
                    this.InfoService.fotoramaInit = false;
                }
                return;
            }

            this.ref.detectChanges();
            this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "block";
            this.ShowFile.display = "none";
            if (this.rights.canManageOwnBudgets === 1) {
                this.InfoService.showGoodleDiskBtn();
              
            }
            return;
        };
        this.elRef.nativeElement.querySelector(".info-fon-photo-body-fon").style.display = "none";
        this.ShowFile.display = "block";
        let dataCreativeId = JSON.parse(this.listExpenses[this.expenseIndex].creativeId);

        this.retrieveAllFiles(dataCreativeId.id);
    }
  
    callOnLastIterationOne() {

        if (this.InfoService.OneFileInit) return;
        this.InfoService.OneFileInit = true;
      
        if (this.listExpenses[this.expenseIndex].folders[this.indexFolder].files.length === 1 && this.listExpenses[this.expenseIndex].folders[this.indexFolder].files[0].type === "document") {
            if ( this.listExpenses[this.expenseIndex].folders[this.indexFolder].files[0].extension !== "pptx") {
                this.elRef.nativeElement.querySelector("#documentEmbed").setAttribute("src", this.listExpenses[this.expenseIndex].folders[this.indexFolder].files[0].url);
            }
            this.ref.detectChanges();
        }

        if (this.ListCreative[this.expenseIndex] && this.ListCreative[this.expenseIndex][0] !== undefined) {
            this.elRef.nativeElement.querySelector("#documentEmbed").setAttribute("src", `https://drive.google.com/file/d/${this.ListCreative[this.expenseIndex][0].id}/preview`);
            this.ref.detectChanges();
        }
    }
    callOnLastIterationFlightDate() {
this.editMode.callOnLastIterationFlightDate(this.elRef.nativeElement);
       
    }
    callOnLastIteration() {
        if (this.InfoService.fotoramaInit) return;
        this.InfoService.fotoramaInit = true;
        if (this.InfoService.fotoramaData) {
            $("#slider-files").slick("unslick");
            this.InfoService.fotoramaData = $("#slider-files").slick({
                dots: false,
                arrows: true
            });
        }
        else {
            this.InfoService.fotoramaData = $("#slider-files").slick({
                dots: false,
                arrows: true
            });
        }

        let list = $(".slider-item-document-body");
        for (let i = 0; i < list.length; i++) {
            list[i].setAttribute("src", list[i].getAttribute("data-url"));
        }
        this.ref.detectChanges();

    }
    getExpensePeriodData() {
        this.InfoService.getExpenseData(this.editMode.listIdExpenses[this.editMode.counterExpenses])
            .subscribe((data:responseGetExpense) => {
                    this.listExpenses.push(this.InfoService.resetPercentages(data.expense));
                    this.InfoService.setDefaultExpense(data.expense);
                    this.editMode.counterExpenses++;
                    if (this.editMode.counterExpenses !== this.editMode.listIdExpenses.length) {
                        this.getExpensePeriodData();
                    }
                    else {
                        this.showExpense();

                      this.InfoService.hidePreloader();
                        this.updateTitleTable();

                        this.getCreativeAndFiles();
                        if (this.InfoService.getLenflightDates(this.listExpenses) > this.listExpenses.length) {
                            this.editMode.showProcent = true;
                        }
                        this.editMode.currentDate = new Date(this.listExpenses[0].flightDate[0].start.year, this.listExpenses[0].flightDate[0].start.month - 1, 1);
                        this.editMode.isMedia = (this.listExpenses[0].isMedia === 1) ? true : false;
                        this.indexFolder =  this.listExpenses[0].folders.findIndex(item => item.folderId === 0);
                    }
            
            });
    }
    setDataRequest(data: Expense) {
        this.expenseIndex = 0;
        this.listExpenses = [];
        this.listExpenses.push(this.InfoService.resetPercentages(data));
        this.indexFolder =  this.listExpenses[0].folders.findIndex(item => item.folderId === 0);
        this.InfoService.clearData();
        this.InfoService.setDefaultExpense(data);
        this.showExpense();
        this.updateTitleTable();
        this.getCreativeAndFiles();
this.addQueryParamsExpense();
        

    }
    addQueryParamsExpense() {
        let query:QueryParamsExpense = {
            category: Number(this.editMode.productCategoryId),
           product:Number(this.editMode.productId),
           expense:this.listExpenses[this.expenseIndex].id
        }
        this.broadcaster.broadcast('addQueryParamsExpense', query );
     
    }
    showExpense() {
        if (this.display !== "block") {
            this.InfoService.onScrollWindow(this.editMode.currentLine, this.editMode.Command);
            this.display = "block";
            this.move = "end";
            this.InfoService.showExpense();
        }

    }
    setflightDateIndex(index: number) {
        try {
            let list_before = document.body.querySelector(`.main_table__row[data-line="${this.InfoService.parentId}"]`).getElementsByClassName("table_object");
            list_before[this.editMode.flightDateIndex].classList.remove("table_object-selected");
            this.editMode.flightDateIndex = index;

            let list_after = document.body.querySelector(`.main_table__row[data-line="${this.InfoService.parentId}"]`).getElementsByClassName("table_object");
            list_after[this.editMode.flightDateIndex].classList.add("table_object-selected");

        } catch (error) {

        }
      

        if (this.editMode.settings.viewType === "daysOfMonth" && this.listExpenses[this.expenseIndex].flightDate[this.editMode.flightDateIndex].targetBudget > 0) {
            this.updateTitleTable();
        }

    }
   
    SelectNewDate(i: number) {

        this.editMode.SelectNewDate(i,this.listExpenses,this.expenseIndex,this.InfoService);
   
    }
    addFlightDate() {
        if (this.rights.canManageOwnBudgets === 0) return;
        if (this.editMode.isMedia && this.editMode.blockEditMedia || this.editMode.isMedia && this.editMode.settings.viewType !== "daysOfMonth") {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorEditMediaCategoryValues));
            return;
        }
        if (this.editMode.isMedia && !this.editMode.blockEditMedia) {
            this.broadcaster.broadcast("Confirm", new Confirm("data", "saveInfoExpenseAndShowMedia"));
            return;
        }

        if (this.editMode.settings.viewType === "daysOfMonth") {
            this.listExpenses[this.expenseIndex].flightDate.push(this.InfoService.getNewFlightDate(this.editMode));
            this.editMode.flightDateIndex = (this.listExpenses[this.expenseIndex].flightDate.length - 1);
             this.listExpenses[this.expenseIndex] = this.InfoService.resetPercentages(this.listExpenses[this.expenseIndex]);
            this.editMode.defaultValEditDate.addDate = true;
            this.editMode.scrollFlightDate = (this.editMode.flightDateIndex > 4) ? true : false;
            this.EditFlightDate(this.editMode.flightDateIndex);
        }
    }
   
    ClosedMask() {
        if (this.editMode.defaultValEditDate.addDate) {
            this.RemoveFlightDate(this.editMode.flightDateIndex);
        }
        this.editMode.defaultValEditDate.addDate = false;
        this.editMode.enabledAddFlightDate = false;
        this.InfoService.ClosedMask(this.editMode.flightDateIndex);
    }
    getMonth() {
        return this.editMode.currentDate.getMonth();
    }
    trackByIndex(index, item) {
        return index;
    }
   
    updateTitleTable() {

        this.InfoService.updateTitleTable(this.editMode.settings.viewType, this.editMode.flightDateIndex, this.expenseIndex, this.InfoService.dataPeriod);

    }
    getFlightDateStart(date: FlightDate): string {

        return `${(date.start.month < 10) ? "0" + date.start.month : date.start.month}/${(date.start.day < 10) ? "0" + date.start.day : date.start.day}`;
    }
    getFlightDateEnd(date: FlightDate): string {

        return `${(date.end.month < 10) ? "0" + date.end.month : date.end.month}/${(date.end.day < 10) ? "0" + date.end.day : date.end.day}`;
    }
    retrieveAllFiles(id) {//callback

        this.InfoService.getFilesFolderGoogleDrive(id)
            .subscribe(result => {
                if (result.status === 200) {
                    this.ListCreative[this.expenseIndex] = result.data;
                    if (this.ListCreative[this.expenseIndex].length > 1) {
                        this.InfoService.fotoramaInit = false;
                    }
                    else {
                        this.InfoService.OneFileInit = false;
                    }
                    this.ref.detectChanges();
                }
            });

    }
    RemoveFlightDate(id: number, i: number = -1) {
        if (this.rights.canManageOwnBudgets === 0) return;
        if (this.editMode.isMedia && this.editMode.blockEditMedia || this.editMode.isMedia && this.editMode.settings.viewType !== "daysOfMonth") {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorEditMediaCategoryValues));
            return;
        }
        if (this.editMode.isMedia && !this.editMode.blockEditMedia) {
            this.broadcaster.broadcast("Confirm", new Confirm("data","saveInfoExpenseAndShowMedia"));
            return;
        }

        let index: number = ((i === -1) ? this.expenseIndex : i);
        if (this.listExpenses[index].flightDate.length === 1) return;
        this.editMode.flightDateIndex = (id !== 0) ? (id - 1) : 0;
    
        this.listExpenses[index].flightDate.splice(id, 1);
        this.listExpenses[index] = this.InfoService.resetPercentages(this.listExpenses[index]);
        this.listExpenses[index].targetBudget = this.InfoService.getAllBudgets(this.listExpenses[index].flightDate);
        this.listExpenses[index].coop = Number((Number(this.listExpenses[index].coopPercent) * this.listExpenses[index].targetBudget / 100));

    }
    EditFlightDate(index: number,expenseIndex:number = -1) {
       
        if (this.rights.canManageOwnBudgets === 0) return;
        if (this.editMode.isMedia && this.editMode.blockEditMedia || this.editMode.isMedia && this.editMode.settings.viewType !== "daysOfMonth") {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorEditMediaCategoryValues));
            return;
        }
        if (this.editMode.isMedia && !this.editMode.blockEditMedia) {
            this.broadcaster.broadcast("Confirm", new Confirm("data", "saveInfoExpenseAndShowMedia") );
            return;
        }
        if (expenseIndex !== (-1)) this.expenseIndex = expenseIndex;
        this.setflightDateIndex(index);
        if (this.editMode.settings.viewType === 'daysOfMonth')
        {
            this.selectFlightDate(index);
        } else {
            this.selectFlightDatePeriod(this.expenseIndex,index)
        }
       // this.editMode.flightDateIndex = index;
      
        this.editMode.EditFlightDate(index,this.elRef.nativeElement,this.listExpenses,this.expenseIndex); 
        this.ref.detectChanges();
    }
    CloseInfoFile() {
        this.ShowFile.display = "block";
        this.ShowFile.show = false;
        this.ShowFile.url = "";
    }
    getUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    getStringUrl(id: string) {
        return ` https://drive.google.com/file/d/${id}/preview`;
    }
    SaveExpense() {
        let flightDateError: boolean = false;
        let flightDate = this.listExpenses[this.editMode.counterExpenses].flightDate.map((item:FlightDate) => {
            if (item.targetBudget === 0) flightDateError = true;
            return new FlightDateSave ({
                start: `${item.start.year}-${(item.start.month < 10) ? "0" + item.start.month : item.start.month}-${(item.start.day < 10) ? "0" + item.start.day : item.start.day}`,
                end: `${item.end.year}-${(item.end.month < 10) ? "0" + item.end.month : item.end.month}-${(item.end.day < 10) ? "0" + item.end.day : item.end.day}`,
                targetBudget: item.targetBudget
            });
        });
        if (flightDateError) {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorDateText));
            return;
        }
        this.InfoService.expense = new Expense();
        this.InfoService.expense.onInitSave(this.listExpenses[this.editMode.counterExpenses],flightDate);
        if (this.editMode.Command !== "edit-product" && this.editMode.productsLen > 1 && this.listExpenses[this.editMode.counterExpenses].campaign === "") return;
        this.InfoService.saveExpense()
            .subscribe((data:responseSaveExpense) => {
                    this.editMode.counterExpenses++;
                    if (this.editMode.counterExpenses !== this.listExpenses.length) {
                        this.SaveExpense();
                    }
                    else {
                       this.InfoService.hidePreloader();
                        this.broadcaster.broadcast("updateInfoItem", new updateInfoItem ({
                            id: null,
                        }));
                        this.broadcaster.broadcast("updateExpensePeriod",this.editMode.dataId);
                        this.broadcaster.broadcast("setstats", null);


                    }
        
            });
    }

    Save(add_comapin: boolean = false) {

        this.editMode.add_comapin = add_comapin;
       
        if (this.editMode.settings.viewType === "monthsOfQuarter" || this.editMode.settings.viewType === "monthsOfYear") {
            for (let i = 0; i < this.listExpenses.length; i++) {
                if (!this.InfoService.checkFlightDates(this.listExpenses[i].flightDate)) {
                    this.broadcaster.broadcast("showAlert", new Alert (this.InfoService.ErrorFlightDates));
                    return;
                }
            }
            this.editMode.counterExpenses = 0;
            this.InfoService.showPreloader();
           
            this.SaveExpense();
            return;
        }
        if (!this.InfoService.checkFlightDates(this.listExpenses[this.expenseIndex].flightDate)) {
            this.broadcaster.broadcast("showAlert", new Alert (this.InfoService.ErrorFlightDates));
            return;
        }
        let flightDateError: boolean = false;
        let flightDate:Array<FlightDateSave> = this.listExpenses[this.expenseIndex].flightDate.map((item:FlightDate) => {
            if (item.targetBudget === 0) flightDateError = true;
            return new FlightDateSave( {
                start: `${item.start.year}-${(item.start.month < 10) ? "0" + item.start.month : item.start.month}-${(item.start.day < 10) ? "0" + item.start.day : item.start.day}`,
                end: `${item.end.year}-${(item.end.month < 10) ? "0" + item.end.month : item.end.month}-${(item.end.day < 10) ? "0" + item.end.day : item.end.day}`,
                targetBudget: item.targetBudget
            });
        });
        if (flightDateError) {
            this.broadcaster.broadcast("showAlert", new Alert(this.InfoService.ErrorDateText));
            return;
        }
     
        if (this.editMode.Command === "create-new-product") {
            this.InfoService.createProduct = new CreateProduct(this.editMode,this.listExpenses[this.expenseIndex]);
            this.InfoService.createProductInit(this.InfoService.createProduct)
                .subscribe((res:responsecreateProduct) => {
              
                        this.InfoService.expense = new Expense();
                        this.InfoService.expense.onInitAfterCreateProduct(this.editMode,this.listExpenses[this.expenseIndex],res,flightDate);
                        this.broadcaster.broadcast("CreateNewProduct", new CreateNewProduct (this.InfoService.expense,res,add_comapin));
                        this.broadcaster.broadcast("updateInfoItem", new updateInfoItem ({
                            id: null,
                        }));
              

                });
            return;
        }
        if (this.editMode.Command === "add-product" || this.editMode.Command === "add-new-product") {
            this.InfoService.expense = new Expense();
            this.InfoService.expense.onInitAddInfoExpense(this.listExpenses[this.expenseIndex],flightDate,this.editMode);
          
            if (this.editMode.Command === "add-product" && this.listExpenses[this.expenseIndex].campaign !== "" || this.editMode.Command === "add-new-product") {
                this.InfoService.addExpense()
                    .subscribe((res:responseAddExpense) => {
                    
                            this.broadcaster.broadcast("updateInfoItem", new updateInfoItem ({
                                id: null,
                            }));

                            if (this.editMode.Command === "add-product") {
                                this.broadcaster.broadcast("AddCampaign", new AddCampaignInit(this.editMode.dataId,true,add_comapin));
                            }
                            else {
                                this.broadcaster.broadcast("AddNewProduct", new AddNewProduct (this.InfoService.expense.productCategoryId,add_comapin,this.InfoService.expense.productId));
                            }

                            this.broadcaster.broadcast("setstats", null);
                      


                    });
            }

        }
        else {
this.InfoService.expense = new Expense();
this.InfoService.expense.onInitSave(this.listExpenses[this.expenseIndex],flightDate);
         
            if (this.editMode.Command !== "edit-product" && this.editMode.productsLen > 1 && this.listExpenses[this.expenseIndex].campaign === "") return;

            this.InfoService.saveExpense()
                .subscribe((data:responseSaveExpense) => {
            
                        this.broadcaster.broadcast("updateInfoItem", new updateInfoItem({
                            id: null,
                        }));
                        if (this.InfoService.getExpense(this.expenseIndex).campaign === "" && this.listExpenses[this.expenseIndex].campaign !== "" || this.InfoService.getExpense(this.expenseIndex).campaign !== "" && this.listExpenses[this.expenseIndex].campaign === "" || this.InfoService.getExpense(this.expenseIndex).campaign !== "" && this.listExpenses[this.expenseIndex].campaign !== this.InfoService.getExpense(this.expenseIndex).campaign) {
                            this.broadcaster.broadcast("AddCampaign", new AddCampaignInit(this.editMode.dataId,false,add_comapin));
                        }
                        if (this.InfoService.getExpense(this.expenseIndex).campaign === this.listExpenses[this.expenseIndex].campaign) {
                            this.broadcaster.broadcast("updateExpense", new updateExpense (this.editMode.dataId,add_comapin));

                        }
                        this.broadcaster.broadcast("setstats", null);

                

                });
        }
    }
    ngOnDestroy() {
        
        this.InfoService.subBroadcaster.unsubscribe();
    }
}

