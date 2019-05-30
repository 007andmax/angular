import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RtbComponent } from './rtb.component';
import { InfoComponent } from '../info/info.component';
import { LeftMenuComponent } from '../left-menu/left-menu.component';
import { RightMenuComponent } from '../right-menu/right-menu.component';
import { TableComponent } from '../table/table.component';
import { UpMenuComponent } from '../up-menu/up-menu.component';
import { MediaCalendarComponent } from '../media-calendar/media-calendar.component';
import { ConfirmComponent } from 'app/components/confirm/confirm.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { SalesObjectivesComponent } from '../sales-objectives/sales-objectives.component';
import { PriceTextPipe } from 'app/components/pipes/price-textpipe';
import { BrowserModule } from '@angular/platform-browser';
import { TextareaInfoExpenseDirective } from '../directives/textarea-info-expense.directive';
import { MoneyDirective } from 'app/components/directives/number.directive';
import { DatepickerItemDirective } from '../../directives/datepicker-item.directive';
import { GraphicDirective } from '../directives/graphic.directive';
import { MenuItemDirective } from '../directives/menu-item.directive';
import { TableItemDirective } from '../directives/table-item.directive';
import { EditModeItemDirective } from '../directives/edit-mode-item.directive';
import { RtbRooftopItemDirective } from '../directives/rtb-rooftop-item.directive';
import { ChannelItemDirective } from '../directives/channel-item.directive';
import { MoneyModule } from 'app/components/directives/module/number.module';
import { DatepickerItemModule } from 'app/components/directives/module/datepicker-item.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MoneyModule,
        DatepickerItemModule,
        RouterModule
    ],
    declarations: [
        RtbComponent,
        InfoComponent,
        LeftMenuComponent,
        RightMenuComponent,
        TableComponent,
        UpMenuComponent,
        MediaCalendarComponent,
        ConfirmComponent,
        ContextMenuComponent,
        SalesObjectivesComponent,
        PriceTextPipe,
        TextareaInfoExpenseDirective,
        GraphicDirective,
        MenuItemDirective,
        TableItemDirective,
        EditModeItemDirective,
        RtbRooftopItemDirective,
        ChannelItemDirective,
    ],
    providers: []
})
export class RtbModule { }
