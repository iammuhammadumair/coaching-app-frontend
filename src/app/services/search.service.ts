import { Injectable} from '@angular/core';
import { BehaviorSubject  } from 'rxjs';
import { SearchOption } from 'src/app/models/search-option';

@Injectable()
export class SearchService {

  private searchOption = new BehaviorSubject<SearchOption>(new SearchOption());
  public currentOption = this.searchOption.asObservable();

  constructor() {}

  public setSearchOption(newSearchOption: SearchOption): void {
    this.searchOption.next(newSearchOption);
  }
}

