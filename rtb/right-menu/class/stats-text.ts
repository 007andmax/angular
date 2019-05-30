import { RightMenu } from '../services/right-menu.service';
export class StatsText {
    budget:String =  ""; 
    coop: String = ""; 
    expenses: String = ""; 
    variance:String =  ""; 
    totalLessCoop: String = ""; 
    actualBudget:String =  "";
    constructor () {}
    public update (data,actions: RightMenu) {
        this.budget = actions.getPrice((data.stats.budget !== null) ? data.stats.budget : 0);
        this.coop = actions.getPrice(data.stats.coop);
        this.expenses = actions.getPrice(data.stats.expenses);
        this.totalLessCoop = actions.getPrice(data.stats.totalLessCoop);
        this.actualBudget = actions.getPrice(data.stats.actualBudget);
        this.variance = actions.getPrice((data.stats.variance !== null) ? data.stats.variance : 0);
    }
}