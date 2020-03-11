import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { HttpClientModule } from '@angular/common/http';
import { SpesaDomicilioComponent } from './spesa-domicilio/spesa-domicilio.component';

const appRoutes: Routes = [
  {
    path: 'spesa',
    component: SpesaDomicilioComponent,
    data: { title: 'Spesa a domicilio' },
  },
  { path: '',
  component: MapsComponent,
  data: { title: 'Maps' },
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    SpesaDomicilioComponent
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


