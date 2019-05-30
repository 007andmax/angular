export class ActiveMenu {
    sessions:boolean =  true;
    leads: boolean =  false;
    sales:boolean =  false;
    cpl:boolean =  false;
    cps: boolean = false;
    constructor () {}
    public update(data) {
        this.sessions = data.sessions;
        this.leads = data.leads;
        this.cpl = data.cpl;
        this.cps = data.cps;
        this.sales = data.sales;
    }
  
}