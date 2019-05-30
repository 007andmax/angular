export class NewProduct {
    select:string = "Select category"; 
    name:string =  ""; 
    list = []; 
    color:string =  'ffffff'; 
    categoriName:string = ""; 
    buttonText:string = "Create new product"; 
    selectedList:boolean =  true; 
    title:string =  ""; 
    element: null ;
    constructor () {
      
    }
    public setList(ListProducts: any, categories: any): any {
        this.list = [];
        let priductHave: number = 0;
      
        for (let i = 0; i < ListProducts.length; i++) {
            let g: number = categories.findIndex(element => String(element.id).split('categories-').join('') === String(ListProducts[i].productCategoryId) || element.title.indexOf(ListProducts[i].name) === 0);
            if (g === (-1)) {
                this.list.push(ListProducts[i].name);
            }
        }
    }
}