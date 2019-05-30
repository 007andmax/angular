import { RightMenu } from "../services/right-menu.service";
import { ActiveMenu } from "../../class/active-menu";
import { responseGetStats } from "app/components/class/http/res/response-get-stats";

export class Trends {
    status:number = 0; // 0 hide; 1 show
    btn = { title: 'Annual trend' };
    data:any =  [];
    stats = {
        sessions: "",
        leads: "",
        sales: "",
        cpl: "",
        cps: ""
    };
    ActiveMenu: ActiveMenu = new ActiveMenu();
    allChannels:boolean =  false;
    channels:any =  [];
    graph =  { min: Number, max: Number, midle: Number };
    titlesHeader:any =  [];
    constructor () {}
    public updateChannels (id: number) {
      
        if (this.channels[id].hide) {
            this.channels[id].hide = false;
        } else {

            this.channels[id].hide = true;
        }

    }
    public selectChannel (channel: string,document:HTMLElement) {
        this.DefaultChannels();
        this.ActiveMenu[channel] = true;
     
        if (channel !== 'sessions') {
            for (let i = 0; i < this.channels.length; i++) {
             
                this.channels[i].hide = true;
                (<HTMLInputElement>document.querySelector(`#Trends-channels-${i}`)).checked = false;

            }
            this.allChannels = false;
        }
        else {

            (<HTMLInputElement>document.querySelector('#channels-all-trends')).checked = true;
        }
    }
    public setChannels(channels:any,circleColors:any) {
        this.channels = channels;
        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].hide = true;

            for (let d = 0; d < circleColors.length; d++)
                if (this.channels[i].title === circleColors[d].text) {
                    this.channels[i].color = circleColors[d].color;
                    this.channels[i].class = circleColors[d].classTrend;
                    break;
                }
        }
    }
    public setStats  (data:responseGetStats,actions:RightMenu) {
        this.stats.sessions = actions.getPrice(data.stats.sessions.total);
        this.stats.leads = actions.getPrice(data.stats.leads.total);
        this.stats.sales = actions.getPrice(data.stats.sales.total);
        this.stats.cpl = (data.stats.cpl.total === null) ? "0" : actions.getPrice(data.stats.cpl.total);
        this.stats.cps = (data.stats.cps.total === null) ? "0" : actions.getPrice(data.stats.cps.total);
        this.data = data.stats;
    }
    public DefaultChannels(): any {
        this.ActiveMenu  = new ActiveMenu();
    }
    public setAllChannels(event,nativeElement:HTMLElement) {
        if (this.allChannels) {
            this.allChannels = false;
        }
        else {
            this.allChannels = true;
        }
        let checked: boolean = event.target.parentNode.querySelector('input').checked;

        for (let i = 0; i < this.channels.length; i++) {
            if (this.allChannels) {
                this.channels[i].hide = false;

                (<HTMLInputElement>nativeElement.querySelector(`#Trends-channels-${i}`)).checked = true;
            }
            else {
                this.channels[i].hide = true;

                (<HTMLInputElement>nativeElement.querySelector(`#Trends-channels-${i}`)).checked = false;
            }
        }
        if (!checked) {
            (<HTMLInputElement>nativeElement.querySelector('#channels-all-trends')).checked = true;
        }
        else {
            (<HTMLInputElement>nativeElement.querySelector('#channels-all-trends')).checked = false;
        }
    }
}