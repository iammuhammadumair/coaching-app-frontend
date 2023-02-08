export class SearchOption {
    country: string;
    city: string;
    maxPrice: number;
    language?: any;
    specialty?: any;
    sponsoring?: boolean;
    idIn: string[];
    coachName?: string;
    constructor() {
        this.country = '';
        this.city = '';
        this.maxPrice = 0;
        this.language = '';
        this.specialty = '';
        this.sponsoring = null;
        this.idIn = [];
        this.coachName = "";
    }
}
