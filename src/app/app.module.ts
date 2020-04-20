import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VillagerComponent } from './villager/villager.component';
import { FormsModule } from '@angular/forms';
import { VillagerFilterPipe } from './villager/villager-filter.pipe';
import { VillagerService } from './villager/villager.service';

@NgModule({
  declarations: [
    AppComponent,
    VillagerComponent,
    VillagerFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    VillagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
