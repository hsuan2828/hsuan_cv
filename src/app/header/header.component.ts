import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(
        private translate: TranslateService,
        private title: Title
    ) {
    }
    //not_using_lang:string[];
    using_lang:string;

    ngOnInit() {
        //this.get_not_using_lang();
        this.using_lang = this.translate.getBrowserLang();
        //console.log(this.using_lang);
    }

    get_not_using_lang(): void {
        // this.not_using_lang = this.translate.getLangs();
        // this.not_using_lang = this.not_using_lang.filter(lang=>lang!==this.translate.currentLang?lang:null);
    }

    set_lang(lang:string): void {
        //console.log("set lang"+lang);
        this.translate.use(lang);
        this.using_lang = lang;
        /*
        this.translate.get(this.title.getTitle()).subscribe(
            res => {this.title.setTitle(res); console.log(res);}
        );
         */
        //this.get_not_using_lang();
    }
}
