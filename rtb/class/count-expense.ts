export class CountExpense {
    categories: number = 0;
    products: number = 0;
    campaigns: number = 0;
    constructor() {
      
    }
    private resetCounts() {

        this.categories = 0;
        this.products = 0;
        this.campaigns = 0;

    }
    public updateCounts(categories) {
        this.resetCounts();
        for (var i = 0; i < categories.length; i++) {

            this.categories++;
            for (
                var u = 0;
                u < categories[i].products.length;
                u++
            ) {
                this.products++;

                if (
                    categories[i].products[u].subproducts !==
                    undefined
                ) {
                    for (
                        var g = 0;
                        g <
                        categories[i].products[u].subproducts
                            .length;
                        g++
                    ) {
                        for (let q = 0; q < categories[i].products[u].subproducts[g].expenses.length; q++) {
                            this.campaigns++;
                        }

                    }
                }

            }
        }
    }
}