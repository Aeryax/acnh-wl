import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VillagerComponent } from './villager/villager.component';
import { URL_VILLAGERS_WL } from './app.const';


const routes: Routes = [
  { path: URL_VILLAGERS_WL + ':b', component: VillagerComponent },
  { path: '', redirectTo: '/' + URL_VILLAGERS_WL + 'W10%3D', pathMatch: 'full' },
  { path: '**', redirectTo: '/' + URL_VILLAGERS_WL + 'W10%3D', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
