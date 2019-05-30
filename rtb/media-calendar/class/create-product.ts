export class CreateProduct {
    name: string = "";
    description: string = "";
    strategy: string = "";
    productCategoryId: string = "";
    constructor(name: string, description: string, strategy: string, productCategoryId: string) {
        this.name = name;
        this.description = description;
        this.strategy = strategy;
        this.productCategoryId = productCategoryId;
    }
}