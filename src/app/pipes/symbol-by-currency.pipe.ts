import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'symbolByCurrency'
})
export class SymbolByCurrencyPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace('eur', '€');
  }

}
