export class SalesObjectives {
    new: [{ month: number, value: number }];
    used: [{ month: number, value: number }]
    public setData(n: any, u: any) {
        this.new = n;
        this.used = u;
    }

}