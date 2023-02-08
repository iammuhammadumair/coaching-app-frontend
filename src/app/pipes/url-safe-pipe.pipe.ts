import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'urlSafePipe'
})
export class UrlSafePipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(value) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);

  }
  transformStyle(value) {
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }

}
