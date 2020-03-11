import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  {
    path: 'maps',
    component: MapsComponent,
    data: { title: 'Maps' }
  },
  { path: '',
  component: MapsComponent,
  data: { title: 'Maps' }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


