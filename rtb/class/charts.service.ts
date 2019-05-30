import { directiveDef } from "@angular/core/src/view/provider";
import { grep } from "shelljs";
import { Injectable, ElementRef } from "@angular/core";
import { ActiveMenu } from "./active-menu";


@Injectable()
export class Charts {
    charts = {
        Sessions: {
            chartInitialized: false,
            data: null,
            colors: { one: '#f2842f', two: '#ffb413' },
        },
        Leads: {
            chartInitialized: false,
            data: null,
            colors: { one: '#47a089', two: '#90cc9d' },
        },
        Sales: {
            chartInitialized: false,
            data: null,
            colors: { one: '#ec5155', two: '#f84361' },
        },
        Cpl: {
            chartInitialized: false,
            data: null,
            colors: { one: '#55395f', two: '#f0399c' },
        },
        Cps: {
            chartInitialized: false,
            data: null,
            colors: { one: '#224166', two: '#2e70a3' },
        },
    };
    months = ['Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    myChart: any = null;
    myTrends: any = null;
    TrendstInitialized: boolean = false;
    chartInitialized: boolean = false;
    colors = [
        { title: '(Other)', color: '#262626' },
        { title: 'Direct', color: '#90527f' },
        { title: 'Display', color: '#000000' },
        { title: 'Email', color: '#000000' },
        { title: 'Organic Search', color: '#50ada5' },
        { title: 'Paid Search', color: '#ec5155' },
        { title: 'Referral', color: '#3e5d7a' },
        { title: 'Social', color: '#329aca' },
        { title: 'Else', color: '#000000' },]
    constructor(private elRef: ElementRef) {

    }
    public UpdateColor(chart: string, active: boolean) {
        if (!active) return;
        let ctx: any = this.charts[chart].data.canvas.getContext('2d');
        let gradient: any = ctx.createLinearGradient(
            0,
            0,
            350,
            0,
        );
        gradient.addColorStop(0, this.charts[chart].colors.one);
        gradient.addColorStop(1, this.charts[chart].colors.two);
        this.charts[
            chart
        ].data.config.data.datasets[0].backgroundColor = gradient;
        this.charts[chart].data.update();
    }
    public hoverLabel(label: any) {
        if (label.hover) {
            let ctx: any = this.charts[label.data].data.canvas.getContext('2d');
            let gradient: any = ctx.createLinearGradient(
                0,
                0,
                350,
                0,
            );
            gradient.addColorStop(0, this.charts[label.data].colors.one);
            gradient.addColorStop(1, this.charts[label.data].colors.two);
            this.charts[
                label.data
            ].data.config.data.datasets[0].backgroundColor = gradient;
            this.charts[label.data].data.update();
        } else {
            this.charts[
                label.data
            ].data.config.data.datasets[0].backgroundColor =
                '#f7f7f7';
            this.charts[label.data].data.update();
        }
    }
    public getYears(year: number): any {
        let MonthDay: any = [];
        for (let i = 0; i < this.months.length; i++) {
            MonthDay.push({ label: `${this.months[i]} ‘${String(year).substring(2, 4)}` });
        }
        return MonthDay;
    }
    public SelectLabel(ActiveMenu: any, menu: string, obj: any) {
        if (ActiveMenu[menu]) {
            this.charts[
                obj.currentTarget.getAttribute('data')
            ].data.config.data.datasets[0].backgroundColor =
                '#f7f7f7';
            this.charts[obj.currentTarget.getAttribute('data')].data.update();
        } else {
            let ctx = this.charts[
                obj.currentTarget.getAttribute('data')
            ].data.canvas.getContext('2d');
            let gradient = ctx.createLinearGradient(
                0,
                0,
                350,
                0,
            );
            gradient.addColorStop(
                0,
                this.charts[obj.currentTarget.getAttribute('data')].colors.one,
            );
            gradient.addColorStop(
                1,
                this.charts[obj.currentTarget.getAttribute('data')].colors.two,
            );
            this.charts[
                obj.currentTarget.getAttribute('data')
            ].data.config.data.datasets[0].backgroundColor = gradient;
            this.charts[obj.currentTarget.getAttribute('data')].data.update();
        }
    }
    public UpdateSessionChart(data: ActiveMenu, menu: any): any {
        let ActiveMenu: any = menu;
        if (data.sessions === ActiveMenu.sessions)
            return ActiveMenu;

        if (data.sessions === false) {
            this.charts.Sessions.data.config.data.datasets[0].backgroundColor =
                '#f7f7f7';
            this.charts.Sessions.data.update();
        } else {
            var ctx = this.charts.Sessions.data.canvas.getContext('2d');
            var gradient = ctx.createLinearGradient(
                0,
                0,
                350,
                0,
            );
            gradient.addColorStop(0, this.charts.Sessions.colors.one);
            gradient.addColorStop(1, this.charts.Sessions.colors.two);
            this.charts.Sessions.data.config.data.datasets[0].backgroundColor = gradient;
            this.charts.Sessions.data.update();
        }
        ActiveMenu.sessions = data.sessions;
        return ActiveMenu;
    }
    public chartMini(chat: string, data: any, ActiveMenu: any, viewType: string, weeks: any): void {

        let ctx: HTMLCanvasElement = this.elRef.nativeElement.querySelector('#my' + chat);
        let gradient: any;

        if (chat === 'Sessions' && ActiveMenu.sessions === true) {
            let widthLabel: number = 350;
            gradient = ctx
                .getContext('2d')
                .createLinearGradient(0, 0, widthLabel / 2, 0);
            gradient.addColorStop(0, this.charts.Sessions.colors.one);
            gradient.addColorStop(1, this.charts.Sessions.colors.two);
        }
        if (ctx) {
            let chanel = [];
            let channelsDatasets = [];
            let count: number = 0;
            if (viewType === 'daysOfMonth') {
                count = data.dots.length;
            }
            if (viewType === 'monthsOfQuarter') {
                count = weeks.length;
            }
            if (viewType === 'monthsOfYear') {
                count = 12;

            }

            let max: number = 0;
            let counter: number = 0;
            for (let i = 0; i < count; i++) {
                if (data.dots !== undefined && data.dots[i] !== undefined && data.dots[i].y !== null && parseInt(data.dots[i].y) > 0) { //data.dots[counter].x === i
                    if (parseInt(data.dots[i].y) > max) {
                        max = parseInt(data.dots[i].y);
                    }
                    chanel.push({
                        x: counter,
                        y: parseInt(data.dots[i].y),
                        label: '',
                    });
                    /*  if (viewType === 'daysOfMonth') {
                          chanel.push({
                              x: counter,
                              y: parseInt(data.dots[counter].y),
                              label: '',
                          });
  
                      }
                      if (viewType === 'monthsOfQuarter') {
  
                          chanel.push({
                              x: counter,
                              y: parseInt(data.dots[counter].y),
                              label: '',
                          });
  
                      }
                      if (viewType === 'monthsOfYear') {
  
                          chanel.push({
                              x: counter,
                              y: parseInt(data.dots[counter].y),
                              label: '',
                          });
  
                      }*/
                    counter++;
                }
            }
            /* if (viewType === 'monthsOfYear') {
                 counter--;
             }*/




            counter--;
            if (chanel.length === 1) {
                chanel.push({
                    x: chanel.length,
                    y: parseInt(data.dots[counter].y),
                    label: '',
                });
                counter++;
            }

            channelsDatasets.push({
                label: chat,
                backgroundColor: chat === 'Sessions' ? gradient : '#f7f7f7',
                borderColor: 'rgba(0, 0, 0, 0)',
                data: chanel,
                fill: true,
                pointRadius: 0,
                pointBorderWidth: 0,
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            });

            if (this.charts[chat].chartInitialized) {
                this.charts[chat].data.destroy();
            }

            this.charts[chat].chartInitialized = true;
            this.charts[chat].data = new Chart(ctx, {
                type: 'line',
                backgroundColor: '#fff',
                data: {
                    datasets: channelsDatasets,
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                position: 'bottom',
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                    max: counter,//counter
                                    fontColor: 'rgba(0, 0, 0, 0)',
                                },
                                gridLines: {
                                    color: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'left',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    mirror: true,
                                    max: max,
                                    fontColor: 'rgba(0, 0, 0, 0)',

                                },
                                gridLines: {
                                    axisColor: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,
                                },
                            }

                        ],
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: false,
                    },
                },
            });
        }
    }
    public chart(tableData: any, stats: any, ActiveMenu: any, channels: any, weeks: any, graphData: any): any {
        let days: number = 0;
        if (tableData.settings.viewType === 'daysOfMonth') {
            days = 32 - new Date(tableData.settings.year, tableData.settings.month - 1, 32).getDate();

        }
        if (tableData.settings.viewType === 'monthsOfQuarter') {
            days = weeks.length;

        }
        if (tableData.settings.viewType === 'monthsOfYear') {
            days = 12;

        }
        let myChart: any = document.querySelector(`#myChart`);

        let cellWidth: number = ((document.body.clientWidth - 350) / days);

        let left: number = (-10 + (cellWidth / 2));// -34


        let graph: any = { min: 0, max: 0, midle: 0, btn: graphData.btn, status: graphData.status };

        let ctx: HTMLCanvasElement = this.elRef.nativeElement.querySelector(`#myChart`);
        //console.log("ctx",ctx);
        if (ctx) {

            // let daysInCurrentMonth: number = 32 - new Date(tableData.settings.year, tableData.settings.month - 1, 32).getDate();
            let months: any = [];
            /* if (tableData.settings.viewType === 'monthsOfQuarter') {
                 days = weeks.length;
 
             }*/
            if (tableData.settings.viewType === 'monthsOfYear') {
                //    days = 12;
                months = this.getYears(tableData.settings.year);

            }

            let sessions = [];
            let sales = [];
            let cpl = [];
            let cps = [];
            let leads = [];
            let counter = { sessions: 0, sales: 0, cpl: 0, leads: 0, cps: 0, channels: 0, colors: 0 };
            let channelsDatasets = [];
            for (let i = 0; i < days; i++) {

                if (
                    stats.sessions.dots[counter.sessions] !== undefined &&
                    ActiveMenu.sessions &&
                    stats.sessions.dots[counter.sessions].y !== null && stats.sessions.dots[counter.sessions].x === i
                ) {
                    if (
                        parseInt(stats.sessions.dots[counter.sessions].y) > graph.max
                    ) {
                        graph.max = parseInt(
                            stats.sessions.dots[counter.sessions].y,
                        );
                    }
                    if (tableData.settings.viewType === 'daysOfMonth') {
                        sessions.push({
                            x: i,
                            y: parseInt(stats.sessions.dots[counter.sessions].y),
                            label: `${this.getLabel(tableData.settings.month, 1 + counter.sessions, tableData.settings.year)} | ${parseInt(
                                stats.sessions.dots[counter.sessions].y,
                            )} | Session`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfQuarter') {
                        sessions.push({
                            x: i,
                            y: parseInt(stats.sessions.dots[counter.sessions].y),
                            label: `${weeks[i].label} | ${parseInt(
                                stats.sessions.dots[counter.sessions].y,
                            )} | Session`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfYear') {
                        sessions.push({
                            x: i,
                            y: parseInt(stats.sessions.dots[counter.sessions].y),
                            label: `${months[i].label} | ${parseInt(
                                stats.sessions.dots[counter.sessions].y,
                            )} | Session`,
                        });

                    }
                    counter.sessions++;
                }
                else {
                    if (ActiveMenu.sessions) {
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            sessions.push({
                                x: i,
                                y: 0,
                                label: `${this.getLabel(tableData.settings.month, 1 + i, tableData.settings.year)} | 0 | Session`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            sessions.push({
                                x: i,
                                y: 0,
                                label: `${weeks[i].label} | 0 | Session`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            sessions.push({
                                x: i,
                                y: 0,
                                label: `${months[i].label} | 0 | Session`,
                            });

                        }
                    }
                }


                if (
                    stats.sales.dots[counter.sales] !== undefined &&
                    ActiveMenu.sales &&
                    stats.sales.dots[counter.sales].y !== null && stats.sales.dots[counter.sales].x === i
                ) {
                    if (parseInt(stats.sales.dots[counter.sales].y) > graph.max) {
                        graph.max = parseInt(stats.sales.dots[counter.sales].y);
                    }

                    if (tableData.settings.viewType === 'daysOfMonth') {
                        sales.push({
                            x: i,
                            y: parseInt(stats.sales.dots[counter.sales].y),
                            label: `${this.getLabel(tableData.settings.month, 1 + counter.sales, tableData.settings.year)} | ${parseInt(stats.sales.dots[counter.sales].y)} | Sales`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfQuarter') {
                        sales.push({
                            x: i,
                            y: parseInt(stats.sales.dots[counter.sales].y),
                            label: `${weeks[i].label} | ${parseInt(stats.sales.dots[counter.sales].y)} | Sales`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfYear') {
                        sales.push({
                            x: i,
                            y: parseInt(stats.sales.dots[counter.sales].y),
                            label: `${months[i].label} | ${parseInt(stats.sales.dots[counter.sales].y)} | Sales`,
                        });

                    }
                    counter.sales++;
                }
                else {
                    if (ActiveMenu.sales) {
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            sales.push({
                                x: i,
                                y: 0,
                                label: `${this.getLabel(tableData.settings.month, 1 + i, tableData.settings.year)} | 0 | Sales`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            sales.push({
                                x: i,
                                y: 0,
                                label: `${weeks[i].label} | 0 | Sales`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            sales.push({
                                x: i,
                                y: 0,
                                label: `${months[i].label} | 0 | Sales`,
                            });

                        }
                    }
                }


                if (
                    stats.cpl.dots[counter.cpl] !== undefined &&
                    ActiveMenu.cpl &&
                    stats.cpl.dots[counter.cpl].y !== null && stats.cpl.dots[counter.cpl].x === i
                ) {
                    if (parseInt(stats.cpl.dots[counter.cpl].y) > graph.max) {
                        graph.max = parseInt(stats.cpl.dots[counter.cpl].y);
                    }

                    if (tableData.settings.viewType === 'daysOfMonth') {
                        cpl.push({
                            x: i,
                            y: parseInt(stats.cpl.dots[counter.cpl].y),
                            label: `${this.getLabel(tableData.settings.month, 1 + counter.cpl, tableData.settings.year)} | ${parseInt(stats.cpl.dots[counter.cpl].y)} | CPL`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfQuarter') {
                        cpl.push({
                            x: i,
                            y: parseInt(stats.cpl.dots[counter.cpl].y),
                            label: `${weeks[i].label} | ${parseInt(stats.cpl.dots[counter.cpl].y)} | CPL`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfYear') {
                        cpl.push({
                            x: i,
                            y: parseInt(stats.cpl.dots[counter.cpl].y),
                            label: `${months[i].label} | ${parseInt(stats.cpl.dots[counter.cpl].y)} | CPL`,
                        });

                    }
                    counter.cpl++;
                }
                else {
                    if (ActiveMenu.cpl) {
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            cpl.push({
                                x: i,
                                y: 0,
                                label: `${this.getLabel(tableData.settings.month, 1 + i, tableData.settings.year)} | 0 | CPL`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            cpl.push({
                                x: i,
                                y: 0,
                                label: `${weeks[i].label} | 0 | CPL`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            cpl.push({
                                x: i,
                                y: 0,
                                label: `${months[i].label} | 0 | CPL`,
                            });

                        }
                    }
                }

                if (
                    stats.cps.dots[counter.cps] !== undefined &&
                    ActiveMenu.cps &&
                    stats.cps.dots[counter.cps].y !== null && stats.cps.dots[counter.cps].x === i
                ) {
                    if (parseInt(stats.cps.dots[counter.cps].y) > graph.max) {
                        graph.max = parseInt(stats.cps.dots[counter.cps].y);
                    }

                    if (tableData.settings.viewType === 'daysOfMonth') {
                        cps.push({
                            x: i,
                            y: parseInt(stats.cps.dots[counter.cps].y),
                            label: `${this.getLabel(tableData.settings.month, 1 + counter.cps, tableData.settings.year)} | ${parseInt(stats.cps.dots[counter.cps].y)} | CPS`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfQuarter') {
                        cps.push({
                            x: i,
                            y: parseInt(stats.cps.dots[counter.cps].y),
                            label: `${weeks[i].label} | ${parseInt(stats.cps.dots[counter.cps].y)} | CPS`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfYear') {
                        cps.push({
                            x: i,
                            y: parseInt(stats.cps.dots[counter.cps].y),
                            label: `${months[i].label} | ${parseInt(stats.cps.dots[counter.cps].y)} | CPS`,
                        });

                    }
                    counter.cps++;
                }
                else {
                    if (ActiveMenu.cps) {
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            cps.push({
                                x: i,
                                y: 0,
                                label: `${this.getLabel(tableData.settings.month, 1 + i, tableData.settings.year)} | 0 | CPS`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            cps.push({
                                x: i,
                                y: 0,
                                label: `${weeks[i].label} | 0 | CPS`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            cps.push({
                                x: i,
                                y: 0,
                                label: `${months[i].label} | 0 | CPS`,
                            });

                        }
                    }
                }

                if (
                    stats.leads.dots[counter.leads] !== undefined &&
                    ActiveMenu.leads &&
                    stats.leads.dots[counter.leads].y !== null && stats.leads.dots[counter.leads].x === i
                ) {
                    if (parseInt(stats.leads.dots[counter.leads].y) > graph.max) {
                        graph.max = parseInt(stats.leads.dots[counter.leads].y);
                    }


                    if (tableData.settings.viewType === 'daysOfMonth') {
                        leads.push({
                            x: i,
                            y: parseInt(stats.leads.dots[counter.leads].y),
                            label: `${this.getLabel(tableData.settings.month, 1 + counter.leads, tableData.settings.year)} | ${parseInt(stats.leads.dots[counter.leads].y)} | Leads`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfQuarter') {
                        leads.push({
                            x: i,
                            y: parseInt(stats.leads.dots[counter.leads].y),
                            label: `${weeks[i].label} | ${parseInt(stats.leads.dots[counter.leads].y)} | Leads`,
                        });

                    }
                    if (tableData.settings.viewType === 'monthsOfYear') {
                        leads.push({
                            x: i,
                            y: parseInt(stats.leads.dots[counter.leads].y),
                            label: `${months[i].label} | ${parseInt(stats.leads.dots[counter.leads].y)} | Leads`,
                        });

                    }
                    counter.leads++;
                }
                else {
                    if (ActiveMenu.leads) {
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            leads.push({
                                x: i,
                                y: 0,
                                label: `${this.getLabel(tableData.settings.month, 1 + i, tableData.settings.year)} | 0 | Leads`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            leads.push({
                                x: i,
                                y: 0,
                                label: `${weeks[i].label} | 0 | Leads`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            leads.push({
                                x: i,
                                y: 0,
                                label: `${months[i].label} | 0 | Leads`,
                            });

                        }
                    }
                }
            }
            counter.colors = 0;

            for (let u = 0; u < stats.channels.length; u++) {
                let channelDotsArray = [];
                counter.channels = 0;

                let channel = stats.channels[u];
                for (let j = 0; j < days; j++) {

                    if (
                        channel.dots[counter.channels] &&
                        channel.dots[counter.channels].y !== null && channels[u] &&
                        channels[u].hide === false && Number(channel.dots[counter.channels].x) === j
                    ) {

                        if (parseInt(channel.dots[counter.channels].y) > graph.max) {
                            graph.max = parseInt(channel.dots[counter.channels].y);
                        }
                        if (tableData.settings.viewType === 'daysOfMonth') {
                            channelDotsArray.push({
                                x: j,
                                y: parseInt(channel.dots[counter.channels].y),
                                label: `${this.getLabel(tableData.settings.month, 1 + counter.channels, tableData.settings.year)} | ${parseInt(channel.dots[counter.channels].y)} | ${channel.title}`,
                            });

                        }
                        if (tableData.settings.viewType === 'monthsOfQuarter') {
                            channelDotsArray.push({
                                x: j,
                                y: parseInt(channel.dots[counter.channels].y),
                                label: `${weeks[j].label} | ${parseInt(channel.dots[counter.channels].y)} | ${channel.title}`,
                            });
                        }
                        if (tableData.settings.viewType === 'monthsOfYear') {
                            channelDotsArray.push({
                                x: j,
                                y: parseInt(channel.dots[counter.channels].y),
                                label: `${months[j].label} | ${parseInt(channel.dots[counter.channels].y)} | ${channel.title}`,
                            });
                        }
                        counter.channels++;

                    }
                    else {
                        if (channels[u].hide === false) {
                            if (tableData.settings.viewType === 'daysOfMonth') {
                                channelDotsArray.push({
                                    x: j,
                                    y: 0,
                                    label: `${this.getLabel(tableData.settings.month, 1 + j, tableData.settings.year)} | 0 | ${channel.title}`,
                                });

                            }
                            if (tableData.settings.viewType === 'monthsOfQuarter') {
                                channelDotsArray.push({
                                    x: j,
                                    y: 0,
                                    label: `${weeks[j].label} | 0 | ${channel.title}`,
                                });
                            }
                            if (tableData.settings.viewType === 'monthsOfYear') {
                                channelDotsArray.push({
                                    x: j,
                                    y: 0,
                                    label: `${months[j].label} | 0 | ${channel.title}`,
                                });
                            }
                        }
                    }
                }
                let index: number = this.colors.findIndex(element => element.title === channel.title);
                channelsDatasets.push({
                    label: channel.title,
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: (index !== (-1)) ? this.colors[index].color : this.colors[8].color,
                    yAxisID: 'left',
                    data: channelDotsArray,
                    pointRadius: 4,
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                });
                counter.colors++;
            }

            graph.min = Math.round(graph.max / 3);

            graph.midle = Math.round(graph.max / 2);
            if (graph.max > 100 && graph.max < 1000) {
                let min: string =
                    String(graph.min).substring(
                        0,
                        String(graph.min).length - 1,
                    ) + '0';
                graph.min = parseInt(min);
                let midle: string =
                    String(graph.midle).substring(
                        0,
                        String(graph.midle).length - 1,
                    ) + '0';

                let max: string =
                    String(graph.max).substring(
                        0,
                        String(graph.max).length - 1,
                    ) + '0';

            }
            if (graph.max > 1000 && graph.max < 10000) {
                let min: string =
                    String(graph.min).substring(
                        0,
                        String(graph.min).length - 2,
                    ) + '00';
                graph.min = parseInt(min);
                let midle: string =
                    String(graph.midle).substring(
                        0,
                        String(graph.midle).length - 2,
                    ) + '00';

                let max: string = String(graph.max + 1000);
                max =
                    String(max).substring(
                        0,
                        String(graph.midle).length - 3,
                    ) + '000';

            }
            channelsDatasets.push(
                {
                    label: 'Sessions',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#f2842f',
                    yAxisID: 'left',
                    data: sessions,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                },
                {
                    label: 'Sales',
                    backgroundColor: 'rgba(85,120,242,0)',
                    borderColor: '#ec5155',
                    yAxisID: 'right-second',
                    data: sales,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                },
                {
                    label: 'Cpl',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#55395f',
                    yAxisID: 'right',
                    data: cpl,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                },
                {
                    label: 'Cps',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#224166',
                    yAxisID: 'left',
                    data: cps,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                },
                {
                    label: 'Leads',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#47a089',
                    yAxisID: 'right-second',
                    data: leads,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                },
            );


            if (this.chartInitialized) {
                this.myChart.destroy();
            }

            this.chartInitialized = true;
            this.myChart = new Chart(ctx, {
                type: 'line',
                backgroundColor: '#fff',
                data: {
                    datasets: channelsDatasets,
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                position: 'bottom',

                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                    max: days,
                                    fontColor: 'rgba(0, 0, 0, 0)'
                                },
                                gridLines: {
                                    color: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'left',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    max: graph.max,
                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',

                                },
                                gridLines: {
                                    axisColor: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,
                                },
                            },
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'right',
                                position: 'right',
                                scaleShowLabels: false,
                                display: false,
                                ticks: {
                                    beginAtZero: true,

                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',
                                },
                            },
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'right-second',
                                position: 'right',
                                scaleShowLabels: false,
                                display: false,
                                ticks: {
                                    beginAtZero: true,

                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',
                                },
                            },
                        ],
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems, data) {

                                return tooltipItems.yLabel;
                            },
                            label: function (tooltipItems, data) {
                                return data.datasets[tooltipItems.datasetIndex]
                                    .data[tooltipItems.xLabel].label;
                            },
                        },
                    },
                },
            });
        }

        let myChartStyle: any = this.elRef.nativeElement.querySelector("#myChart");

        myChartStyle.style.width = `${this.elRef.nativeElement.querySelectorAll(".chart")[0].offsetWidth + 23}px`;
        myChartStyle.style.left = `${left}px`;

        return {
            graph: graph
        }
    }
    public chartTrends(tableData: any, stats: any, ActiveMenu: any, channels: any): any {
        let days: number = 12;

        let myChart: any = this.elRef.nativeElement.querySelector(`#myTrends`);
        let cellWidth: number = ((document.body.clientWidth - 350) / days);

        let left: number = (-10 + (cellWidth / 2)); //34

        let graph: any = { min: 0, max: 0, midle: 0 };


        let ctx: HTMLCanvasElement = this.elRef.nativeElement.querySelector(`#myTrends`);
        if (ctx) {

            /*  let daysInCurrentMonth: number = moment(
                  `${tableData.settings.year}-${this.formatDoubleDigits(
                      tableData.settings.month,
                  )}-01`,
              ).daysInMonth();*/
            let months: any = [];



            months = this.getYears(tableData.settings.year);


            let sessions = [];
            let sales = [];
            let cpl = [];
            let cps = [];
            let leads = [];
            let counter = { sessions: 0, sales: 0, cpl: 0, leads: 0, cps: 0, channels: 0, colors: 0 };
            let channelsDatasets = [];
            for (let i = 0; i < days; i++) {

                if (
                    stats.sessions.dots[counter.sessions] !== undefined &&
                    ActiveMenu.sessions &&
                    stats.sessions.dots[counter.sessions].y !== null && stats.sessions.dots[counter.sessions].x === i
                ) {
                    if (
                        parseInt(stats.sessions.dots[counter.sessions].y) > graph.max
                    ) {
                        graph.max = parseInt(
                            stats.sessions.dots[counter.sessions].y,
                        );
                    }


                    sessions.push({
                        x: i,
                        y: parseInt(stats.sessions.dots[counter.sessions].y),
                        label: `${months[i].label} | ${parseInt(
                            stats.sessions.dots[counter.sessions].y,
                        )} | Session`,
                    });
                    counter.sessions++;


                }
                else {
                    if (ActiveMenu.sessions) {

                        sessions.push({
                            x: i,
                            y: 0,
                            label: `${months[i].label} | 0 | Session`,
                        });
                    }

                }

                if (
                    stats.sales.dots[counter.sales] !== undefined &&
                    ActiveMenu.sales &&
                    stats.sales.dots[counter.sales].y !== null && stats.sales.dots[counter.sales].x === i
                ) {
                    if (parseInt(stats.sales.dots[counter.sales].y) > graph.max) {
                        graph.max = parseInt(stats.sales.dots[counter.sales].y);
                    }



                    sales.push({
                        x: i,
                        y: parseInt(stats.sales.dots[counter.sales].y),
                        label: `${months[i].label} | ${parseInt(stats.sales.dots[counter.sales].y)} | Sales`,
                    });
                    counter.sales++;

                }
                else {
                    if (ActiveMenu.sales) {
                        sales.push({
                            x: i,
                            y: 0,
                            label: `${months[i].label} | 0 | Sales`,
                        });
                    }

                }


                if (
                    stats.cpl.dots[counter.cpl] !== undefined &&
                    ActiveMenu.cpl &&
                    stats.cpl.dots[counter.cpl].y !== null && stats.cpl.dots[counter.cpl].x === i
                ) {
                    if (parseInt(stats.cpl.dots[counter.cpl].y) > graph.max) {
                        graph.max = parseInt(stats.cpl.dots[counter.cpl].y);
                    }



                    cpl.push({
                        x: i,
                        y: parseInt(stats.cpl.dots[counter.cpl].y),
                        label: `${months[i].label} | ${parseInt(stats.cpl.dots[counter.cpl].y)} | CPL`,
                    });
                    counter.cpl++;

                }
                else {
                    if (ActiveMenu.cpl) {
                        cpl.push({
                            x: i,
                            y: 0,
                            label: `${months[i].label} | 0 | CPL`,
                        });
                    }

                }

                if (
                    stats.cps.dots[counter.cps] !== undefined &&
                    ActiveMenu.cps &&
                    stats.cps.dots[counter.cps].y !== null && stats.cps.dots[counter.cps].x === i
                ) {
                    if (parseInt(stats.cps.dots[counter.cps].y) > graph.max) {
                        graph.max = parseInt(stats.cps.dots[counter.cps].y);
                    }



                    cps.push({
                        x: i,
                        y: parseInt(stats.cps.dots[counter.cps].y),
                        label: `${months[i].label} | ${parseInt(stats.cps.dots[counter.cps].y)} | CPS`,
                    });
                    counter.cps++;

                }
                else {
                    if (ActiveMenu.cps) {
                        cps.push({
                            x: i,
                            y: 0,
                            label: `${months[i].label} | 0 | CPS`,
                        });
                    }

                }

                if (
                    stats.leads.dots[counter.leads] !== undefined &&
                    ActiveMenu.leads &&
                    stats.leads.dots[counter.leads].y !== null && stats.leads.dots[counter.leads].x === i
                ) {
                    if (parseInt(stats.leads.dots[counter.leads].y) > graph.max) {
                        graph.max = parseInt(stats.leads.dots[counter.leads].y);
                    }


                    leads.push({
                        x: i,
                        y: parseInt(stats.leads.dots[counter.leads].y),
                        label: `${months[i].label} | ${parseInt(stats.leads.dots[counter.leads].y)} | Leads`,
                    });
                    counter.leads++;

                }
                else {
                    if (ActiveMenu.leads) {
                        leads.push({
                            x: i,
                            y: 0,
                            label: `${months[i].label} | 0 | Leads`,
                        });
                    }

                }
            }
            counter.colors = 0;
            for (let u = 0; u < stats.channels.length; u++) {
                let channelDotsArray = [];
                counter.channels = 0;
                let channel = stats.channels[u];
                for (let j = 0; j < days; j++) {
                    let channelDots = channel.dots[j];

                    if (
                        channel.dots[counter.channels] &&
                        channel.dots[counter.channels].y !== null &&
                        channels[u].hide === false && Number(channel.dots[counter.channels].x) === j
                    ) {

                        if (parseInt(channel.dots[counter.channels].y) > graph.max) {
                            graph.max = parseInt(channel.dots[counter.channels].y);
                        }


                        channelDotsArray.push({
                            x: j,
                            y: parseInt(channel.dots[counter.channels].y),
                            label: `${months[j].label} | ${parseInt(channel.dots[counter.channels].y)} | ${channel.title}`,
                        });

                        counter.channels++;

                    }
                    else {
                        if (channels[u].hide === false) {
                            channelDotsArray.push({
                                x: j,
                                y: 0,
                                label: `${months[j].label} | 0 | ${channel.title}`,
                            });
                        }
                    }
                }
                let index: number = this.colors.findIndex(element => element.title === channel.title);
                channelsDatasets.push({
                    label: channel.title,
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: (index !== (-1)) ? this.colors[index].color : this.colors[8].color,
                    yAxisID: 'left',
                    data: channelDotsArray,
                    pointRadius: 4,

                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                });
                counter.colors++;
            }

            graph.min = Math.round(graph.max / 3);

            graph.midle = Math.round(graph.max / 2);
            if (graph.max > 100 && graph.max < 1000) {
                let min: string =
                    String(graph.min).substring(
                        0,
                        String(graph.min).length - 1,
                    ) + '0';
                graph.min = parseInt(min);
                let midle: string =
                    String(graph.midle).substring(
                        0,
                        String(graph.midle).length - 1,
                    ) + '0';

                let max: string =
                    String(graph.max).substring(
                        0,
                        String(graph.max).length - 1,
                    ) + '0';

            }
            if (graph.max > 1000 && graph.max < 10000) {
                let min: string =
                    String(graph.min).substring(
                        0,
                        String(graph.min).length - 2,
                    ) + '00';
                graph.min = parseInt(min);
                let midle: string =
                    String(graph.midle).substring(
                        0,
                        String(graph.midle).length - 2,
                    ) + '00';

                let max: string = String(graph.max + 1000);
                max =
                    String(max).substring(
                        0,
                        String(graph.midle).length - 3,
                    ) + '000';



            }

            channelsDatasets.push(
                {
                    label: 'Sessions',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#f2842f',
                    data: sessions,
                    pointRadius: 4,

                    pointBackgroundColor: '#fff',
                    borderWidth: 2,


                },
                {
                    label: 'Sales',
                    backgroundColor: 'rgba(85,120,242,0)',
                    borderColor: '#ec5155',
                    yAxisID: 'right-second',
                    data: sales,
                    pointRadius: 4,

                    pointBackgroundColor: '#fff',
                    borderWidth: 2
                },
                {
                    label: 'Cpl',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#55395f',
                    yAxisID: 'right',
                    data: cpl,
                    pointRadius: 4,

                    pointBackgroundColor: '#fff',
                    borderWidth: 2
                },
                {
                    label: 'Cps',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#224166',
                    yAxisID: 'left',
                    data: cps,
                    pointRadius: 4,

                    pointBackgroundColor: '#fff',
                    borderWidth: 2
                },
                {

                    label: 'Leads',
                    backgroundColor: 'rgba(85,203,242,0)',
                    borderColor: '#47a089',
                    yAxisID: 'right-second',
                    data: leads,
                    pointRadius: 4,

                    pointBackgroundColor: '#fff',
                    borderWidth: 2
                },
            );

            if (this.TrendstInitialized) {
                this.myTrends.destroy();
            }

            this.TrendstInitialized = true;
            this.myTrends = new Chart(ctx, {
                type: 'line',
                backgroundColor: '#fff',
                data: {
                    datasets: channelsDatasets,
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                position: 'bottom',

                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                    max: days,
                                    fontColor: 'rgba(0, 0, 0, 0)'
                                },
                                gridLines: {
                                    color: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,

                                },
                            },
                        ],
                        yAxes: [
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'left',
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    max: graph.max,
                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',

                                },
                                gridLines: {
                                    axisColor: 'rgba(0, 0, 0, 0)',
                                    display: false,
                                    drawBorder: false,

                                },
                            },
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'right',
                                position: 'right',
                                scaleShowLabels: false,
                                display: false,
                                ticks: {
                                    beginAtZero: true,

                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',
                                },
                            },
                            {
                                offsetGridLines: true,
                                type: 'linear',
                                id: 'right-second',
                                position: 'right',
                                scaleShowLabels: false,
                                display: false,
                                ticks: {
                                    beginAtZero: true,

                                    mirror: true,
                                    fontColor: 'rgba(0, 0, 0, 0)',
                                },
                            },
                        ],
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems, data) {

                                return tooltipItems.yLabel;
                            },
                            label: function (tooltipItems, data) {
                                return data.datasets[tooltipItems.datasetIndex]
                                    .data[tooltipItems.xLabel].label;
                            },
                        },
                    },
                }

            });
        }
        let myTrends: any = this.elRef.nativeElement.querySelector("#myTrends");

        myTrends.style.left = `${left}px`;
        myTrends.style.width = `${this.elRef.nativeElement.querySelectorAll(".chart")[1].offsetWidth + 23}px`;

        return {
            graph: graph
        }
    }
    private getLabel(month: number, day: number, year: number): string {
        return `${this.months[month - 1]} ${this.formatDoubleDigits(day)}, ${year}`;

    }
    private formatDoubleDigits(number: number): string {
        let numberOut: any = number < 10 ? '0' + number : number;

        return number.toString();
    }
    public getPrice(x: number): string {
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