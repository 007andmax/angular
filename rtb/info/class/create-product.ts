import { EditModeInfoExpense } from "./editMode-Info-expense";
import { CategoryDirectory } from "app/components/class/directory/category";

export class CreateProduct {
    name: string;
    description: string;
    strategy: string;
    productCategoryId: string;
    constructor (editMode:EditModeInfoExpense,data) {
        this.name = editMode.product.title;
        this.description = data.description;
        this.strategy = data.strategy;
        
        this.productCategoryId = editMode.categori.productCategoryId;
    }
}