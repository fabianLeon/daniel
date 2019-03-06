import { Component } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})




export class AppComponent {
  title = 'Suggestions';
  items: any;
  generated = '';
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  constructor(private copy: ClipboardService, private http: HttpClient) {
    this.items = [{
      message: 'is simply dummy text of the printing and typesetting industry. ' +
        'Lorem Ipsum has been the standard dummy text ever since the 1500s',
      checked: false,
    }];

  }

  save() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  add() {
    this.items.push({
      message: 'is simply dummy text of the printing and typesetting industry. ' +
        'Lorem Ipsum has been the standard dummy text ever since the 1500s',
      checked: false,
    });
  }

  remove() {
    console.log(this.items);
    this.items.pop();
  }

  generate(inputElement) {
    this.generated = '';
    const checked = this.items.filter((a) => a.checked);
    checked.forEach(element => {
      this.generated += element.message;
    });
    this.copy.copyFromContent(this.generated);
  }

  export() {
    this.save();
    this.dyanmicDownloadByHtmlTag({
      fileName: 'struct.json',
      text: localStorage.getItem('items'),
    });
  }

  import(event) {
    // console.info(event.srcElement.files);
    const url = URL.createObjectURL(event.srcElement.files.item(0));
    this.http
      .get(url, {
        headers: { observe: 'response' },
        responseType: 'text',
      })
      .subscribe((x: any) => {
        this.items = JSON.parse(x);
        localStorage.setItem('items', JSON.stringify(this.items));
      });
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    const items = localStorage.getItem('items');
    if (items === null) {
      this.save();
    } else {
      this.items = JSON.parse(items);
    }
  }

}
