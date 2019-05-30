export class MediaExpense {
    flightDate: [
        {
            start: { year: number, month: number, day: number };
            end: { year: number, month: number, day: number };
            targetBudget: number;
            spots: number;
            grp: number;
            actualBudget: number;
        }
    ];
    budget: number = 0;
    targetBudget: number = 0;
    campaign: String;
    actualBudget: Number = 0;
    dealerShips: [{
        coop: Number,
        dealerShipId: String,
        percent: Number,
        targetBudgetPercent: Number,
        budget: number,
        coopPercent: Number,
        actualBudget: number
    }];
    public setDefaultData(flightDate: any, campaign: string, targetBudget: number, dealerShips: any, actualBudget: Number) {
        this.flightDate = this.checkFlightDate(flightDate);
        this.campaign = campaign;
        this.targetBudget = targetBudget;
        this.budget = targetBudget;
        this.dealerShips = dealerShips;
        this.actualBudget = actualBudget;
    }
    public setData(settings: any, campaign: String) {

        this.flightDate = [{ start: { year: settings.year, month: Number(settings.month), day: 1 }, end: { year: settings.year, month: Number(settings.month), day: 32 - new Date(settings.year, Number(settings.month) - 1, 32).getDate() }, targetBudget: 0, spots: 0, grp: 0, actualBudget: 0 }];
        this.campaign = campaign;


    }
    private checkFlightDate(list: any): any {
        let out = list;
        return out.map((item) => {
            if (!item.actualBudget) {
                item.actualBudget = 0;
            }
            return item;
        })
    }
    public AddFlightDate(settings: any) {

        this.flightDate.push({ start: { year: settings.year, month: Number(settings.month), day: 1 }, end: { year: settings.year, month: Number(settings.month), day: 32 - new Date(settings.year, Number(settings.month) - 1, 32).getDate() }, targetBudget: 0, spots: 0, grp: 0, actualBudget: 0 });
    }
}