import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HttpClientXsrfModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './my.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './/app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FooterComponent } from './footer/footer.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

//import { CookieService } from 'ngx-cookie-service';

import { MessageService } from './message.service';
import { BackendService } from './backend.service';

/* change local_id by get browser culture lang (for changing date pipe format) */
import { TranslateService } from '@ngx-translate/core';
import { LOCALE_ID } from '@angular/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json?20220310');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PageNotFoundComponent,
    FooterComponent,
  ],
  imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      HttpClientModule,
      //HttpClientXsrfModule,
      //* TODO: add csrf with iris
      HttpClientXsrfModule.withOptions({
          cookieName: '_iris_csrf',
          //cookieName: 'csrftoken',
          headerName: 'X-Csrf-Token',
          //headerName: '_iris_csrf',
      }),
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [ HttpClient ]
          }
      }),
      RecaptchaModule.forRoot(),
      RecaptchaFormsModule,
  ],
    providers: [
        { provide: LOCALE_ID, deps: [TranslateService], useFactory: (translateService) => translateService.getBrowserCultureLang()},
        { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: "6LerNuEUAAAAACDZrbCh_RIRbty2RahHQtES71TK" } as RecaptchaSettings },
        { provide: RECAPTCHA_LANGUAGE, useValue: (translateService) => translateService.getBrowserCultureLang()},
        //CookieService,
        MessageService,
        BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
