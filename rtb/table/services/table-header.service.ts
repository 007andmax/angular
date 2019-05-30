import { Subscription } from "rxjs";


export class TableHeader {
    title = [];
    quarters = ['1st Quarter ’',

        '2nd Quarter ’',

        '3rd Quarter ’',

        '4th Quarter ’'];
    weeks = ['Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat', 'Sun'];

   
    constructor() {

    }

    public getTitles(days: number, year: number, month: number): any {
        this.title = [];
        let week: number = 1;
        let dayWeek: number = 0;
        let currentDate: Date = new Date(year, Number(month) - 1, 1);
        let nowDate: Date = new Date();
        let currentDayWeek: boolean = false;
        let start: number = 2;
        currentDate.setDate(1);
        dayWeek = (currentDate.getDay() !== 0) ? currentDate.getDay() : 7;

        if (dayWeek !== 7) {
            currentDayWeek = (nowDate.getFullYear() === currentDate.getFullYear() && nowDate.getMonth() === currentDate.getMonth() && nowDate.getDate() === 1) ? true : false;
            this.title.push({ label: 1, week: `${week}W` });

        }
        else {
            week = 0;
            start = 1;
        }
        for (let i = start; i <= days; i++) {
            currentDate.setDate(i);
            dayWeek = (currentDate.getDay() !== 0) ? currentDate.getDay() : 7;
            currentDayWeek = (nowDate.getFullYear() === currentDate.getFullYear() && nowDate.getMonth() === currentDate.getMonth() && nowDate.getDate() === i) ? true : false;
            if (dayWeek === 1) {
                week++;
                this.title.push({ label: i, week: `${week}W`, class: '', classWeek: (currentDayWeek) ? 'current-day-week' : '' });
            }
            else {
                this.title.push({ label: i, week: '', class: (dayWeek === 6 || dayWeek === 7) ? 'weekends' : '', classWeek: (currentDayWeek) ? 'current-day-week' : '' });
            }

        }
        return this.title;
    }
}