import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        translate: TranslateService,
        backendService: BackendService
    ) {
        // this language will be used as a fallback
        // when a translation isn't found in the current language
        translate.setDefaultLang('en');

        let browserLang = translate.getBrowserLang();
        let browserLangCulture = translate.getBrowserCultureLang();
        // translate.addLangs(['en', 'zh']);
        //console.log('Language use: ' + browserLang);
        //console.log('Culture Language: ' + browserLangCulture);
        translate.use(
            browserLang.match(/en|zh/) ? browserLang : 'en'
        );
        // translate.use('zh');
        if (browserLang.match(/zh/)) {
            backendService.browserLang = 'zh';
        } else {
            backendService.browserLang = 'en';
        }
    }
}
