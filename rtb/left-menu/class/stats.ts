export class Stats {
    sessions:string = ""; 
    leads:string = ""; 
    sales:string = ""; 
    cpl:string = ""; 
    cps:string = "";
    constructor () {

    }
    public updateData (stats) {
        this.sessions = this.getPrice(stats.sessions.total);
        this.leads = this.getPrice(stats.leads.total);
        this.sales = this.getPrice(stats.sales.total);
        this.cpl = (stats.cpl.total === null) ? "0" : this.getPrice(stats.cpl.total);
        this.cps = (stats.cps.total === null) ? "0" : this.getPrice(stats.cps.total);
    }
    private getPrice(x: number): string {
        if (x > 100000) {
            let newX: number = Math.round(x / 1000);
            let parts = String(newX).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".") + "K";
        }
        else {
            let parts = String(x).split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

    }
}