import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Message } from '../message';
import { MessageService } from '../message.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    captcha:string;

    sending: boolean = false;
    success: boolean = false;
    sended: boolean = false;
    newMessage: Message = {
        name: "",
        email: "",
        subject: "",
        content: ""
    };

    constructor(
        private messageService: MessageService,
        private backendService: BackendService
    ) { }

    ngOnInit() {
    }

    reset(): void {
        this.newMessage = {
            name: "",
            email: "",
            subject: "",
            content: ""
        };
        this.sending = false;
    }

    resolved(captchaResponse: string) {
        console.log(`Resolved captcha with response ${captchaResponse}`);
    }

    sendMessage(): void {
        this.sended = false;
        this.sending = true;

        this.messageService.postMessage(this.newMessage)
        .subscribe(
            data => {
                console.log('send success');
                console.log(data);
                this.sended = true;
                this.success = true;
                this.reset();
            },
            (err: HttpErrorResponse) => {
                console.log('send fail');
                console.log(err);
                this.sended = true;
                this.sending = false;
                this.success = false;
            }
        );
    }
    getLocation(): string {
        var location = 'New York, U.S.';
        if (this.backendService.browserLang == 'zh') {
            location = 'Taipei, TW';
        }
        return `Based in ${location}`;
    }
}
