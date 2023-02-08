import { Pipe, PipeTransform } from '@angular/core';
import {environment} from '../../environments/environment';
@Pipe({
  name: 'prizePipe'
})
export class PrizePipe implements PipeTransform {

  transformedPrize: number;

  transform(prize: string, zoomLevel: number): string {

    this.transformedPrize = parseInt(prize, 10) / 1000;

    if (zoomLevel > environment.zoomToShowPrice) {
      return this.transformedPrize.toString() + 'k';
    } else {
      return '';
    }
  }

}
