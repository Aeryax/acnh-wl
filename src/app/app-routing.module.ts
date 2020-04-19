import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VillagerComponent } from './villager/villager.component';


const routes: Routes = [
  { path: 'villagers-wl/:b', component: VillagerComponent },
  { path: '', redirectTo: '/villagers-wl/W10%3D', pathMatch: 'full' },
  { path: '**', redirectTo: '/villagers-wl/W10%3D', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
