export class SaveMedia {
    dealerGroupId: number =0;
    year: number = 0;
    month: number = 0;
    productCategoryId: String;
    products: any = [];
    dealerShips: any = [];
    constructor (dealerGroupId:number,year:number,month:number,productCategoryId:String) {
        this.dealerGroupId =dealerGroupId;
        this.year =  year;
        this.month =  month;
        this.productCategoryId =  productCategoryId;
      
    }
    public setProducts (listMedia:any) {
        this.products = listMedia.map((item) => {
            let campaigns = item.campaigns.map((campaign) => {
                let dealerShips = [];
                for (let i = 0; i < campaign.dealerShips.length; i++) {
                    if (campaign.dealerShips[i].active)
                    {
                        dealerShips.push({
                            dealerShipId: campaign.dealerShips[i].dealerShipId,
                            percent: campaign.dealerShips[i].targetBudgetPercent,
                            coop: (campaign.dealerShips[i].coopPercent) ? campaign.dealerShips[i].coopPercent : 0
                        })
                    }
                  
                }
                return { campaign: campaign.campaign, flightDates: campaign.flightDate, dealerShips: dealerShips }
            })
            return { productId: item.productId, campaigns: campaigns }
        })
    }
    public setDealerShips (dealerShips) {
       
        this.dealerShips = [];
        for (let g=0;g<dealerShips.length;g++)
        {
            if (dealerShips[g].active)
            {
                this.dealerShips.push(dealerShips[g].dealerShipId);
            }
        }
    }
}