import {Address} from './adress';

export class AppUser {
  uid?:                  string;
  email:                 string;
  photoURL?:             string;
  displayName?:          string;

  profileType?:          string;
  firstname?:            string;
  lastname?:             string;
  telephone?:            string;
  gender?:               string;
  birthDate?:            any;
  websiteUrl?:           string;

  onlineStatus?:         boolean;
  enable?:               boolean;
  deleted?:              boolean;
  address?:              Address;

  confirmEmail?:         boolean;

  privacy?:              boolean;
  termAndCondition?:     boolean;

  bookmarks?:            string[];
  requests?:             string[];
  offers?:               string[];
  sponsored?:            boolean;
  coachAgent?:           string;
  coach?:                string;
  mangoUserId?:          string;
  mangoCardId?:            string;
//   paypalUserId?:         string;
  paymentType?:          string;
  paymentGateway?:       string;
//   paypalNonce?:          string;
//   paypalPayerId?:        string;
  paypalEmail?:          string;

  countryOfResidence?:   string;
  nationality?:          string;

  mangoBankAccountId?:   string;
  timezone?:             string;

  gcTokens?:             any;
  gcEnabled?:            boolean;
  coachAgentType?:       string;

  public static from(userVal: AppUser) {
    return Object.assign(new AppUser(), userVal);
  }

  isClient?() {
    return this.profileType.toLocaleLowerCase() === 'client';
  }

  isCoachAgent?() {
    return this.profileType.toLocaleLowerCase() === 'coach agent';
  }
}

export const countriesList = [

  {
    "code": "AD",
    "name": "Andorra",
    "currencyCode": "EUR",
    "population": "84000",
    "capital": "Andorra la Vella",
    "cname": "Europe"
},
{
    "code": "AE",
    "name": "United Arab Emirates",
    "currencyCode": "AED",
    "population": "4975593",
    "capital": "Abu Dhabi",
    "cname": "Asia"
},
{
    "code": "AF",
    "name": "Afghanistan",
    "currencyCode": "AFN",
    "population": "29121286",
    "capital": "Kabul",
    "cname": "Asia"
},
{
    "code": "AG",
    "name": "Antigua and Barbuda",
    "currencyCode": "XCD",
    "population": "86754",
    "capital": "St. John's",
    "cname": "North America"
},
{
    "code": "AI",
    "name": "Anguilla",
    "currencyCode": "XCD",
    "population": "13254",
    "capital": "The Valley",
    "cname": "North America"
},
{
    "code": "AL",
    "name": "Albania",
    "currencyCode": "ALL",
    "population": "2986952",
    "capital": "Tirana",
    "cname": "Europe"
},
{
    "code": "AM",
    "name": "Armenia",
    "currencyCode": "AMD",
    "population": "2968000",
    "capital": "Yerevan",
    "cname": "Asia"
},
{
    "code": "AO",
    "name": "Angola",
    "currencyCode": "AOA",
    "population": "13068161",
    "capital": "Luanda",
    "cname": "Africa"
},
{
    "code": "AQ",
    "name": "Antarctica",
    "currencyCode": "",
    "population": "0",
    "capital": "",
    "cname": "Antarctica"
},
{
    "code": "AR",
    "name": "Argentina",
    "currencyCode": "ARS",
    "population": "41343201",
    "capital": "Buenos Aires",
    "cname": "South America"
},
{
    "code": "AS",
    "name": "American Samoa",
    "currencyCode": "USD",
    "population": "57881",
    "capital": "Pago Pago",
    "cname": "Oceania"
},
{
    "code": "AT",
    "name": "Austria",
    "currencyCode": "EUR",
    "population": "8205000",
    "capital": "Vienna",
    "cname": "Europe"
},
{
    "code": "AU",
    "name": "Australia",
    "currencyCode": "AUD",
    "population": "21515754",
    "capital": "Canberra",
    "cname": "Oceania"
},
{
    "code": "AW",
    "name": "Aruba",
    "currencyCode": "AWG",
    "population": "71566",
    "capital": "Oranjestad",
    "cname": "North America"
},
{
    "code": "AX",
    "name": "Åland",
    "currencyCode": "EUR",
    "population": "26711",
    "capital": "Mariehamn",
    "cname": "Europe"
},
{
    "code": "AZ",
    "name": "Azerbaijan",
    "currencyCode": "AZN",
    "population": "8303512",
    "capital": "Baku",
    "cname": "Asia"
},
{
    "code": "BA",
    "name": "Bosnia and Herzegovina",
    "currencyCode": "BAM",
    "population": "4590000",
    "capital": "Sarajevo",
    "cname": "Europe"
},
{
    "code": "BB",
    "name": "Barbados",
    "currencyCode": "BBD",
    "population": "285653",
    "capital": "Bridgetown",
    "cname": "North America"
},
{
    "code": "BD",
    "name": "Bangladesh",
    "currencyCode": "BDT",
    "population": "156118464",
    "capital": "Dhaka",
    "cname": "Asia"
},
{
    "code": "BE",
    "name": "Belgium",
    "currencyCode": "EUR",
    "population": "10403000",
    "capital": "Brussels",
    "cname": "Europe"
},
{
    "code": "BF",
    "name": "Burkina Faso",
    "currencyCode": "XOF",
    "population": "16241811",
    "capital": "Ouagadougou",
    "cname": "Africa"
},
{
    "code": "BG",
    "name": "Bulgaria",
    "currencyCode": "BGN",
    "population": "7148785",
    "capital": "Sofia",
    "cname": "Europe"
},
{
    "code": "BH",
    "name": "Bahrain",
    "currencyCode": "BHD",
    "population": "738004",
    "capital": "Manama",
    "cname": "Asia"
},
{
    "code": "BI",
    "name": "Burundi",
    "currencyCode": "BIF",
    "population": "9863117",
    "capital": "Bujumbura",
    "cname": "Africa"
},
{
    "code": "BJ",
    "name": "Benin",
    "currencyCode": "XOF",
    "population": "9056010",
    "capital": "Porto-Novo",
    "cname": "Africa"
},
{
    "code": "BL",
    "name": "Saint Barthélemy",
    "currencyCode": "EUR",
    "population": "8450",
    "capital": "Gustavia",
    "cname": "North America"
},
{
    "code": "BM",
    "name": "Bermuda",
    "currencyCode": "BMD",
    "population": "65365",
    "capital": "Hamilton",
    "cname": "North America"
},
{
    "code": "BN",
    "name": "Brunei",
    "currencyCode": "BND",
    "population": "395027",
    "capital": "Bandar Seri Begawan",
    "cname": "Asia"
},
{
    "code": "BO",
    "name": "Bolivia",
    "currencyCode": "BOB",
    "population": "9947418",
    "capital": "Sucre",
    "cname": "South America"
},
{
    "code": "BQ",
    "name": "Bonaire",
    "currencyCode": "USD",
    "population": "18012",
    "capital": "Kralendijk",
    "cname": "North America"
},
{
    "code": "BR",
    "name": "Brazil",
    "currencyCode": "BRL",
    "population": "201103330",
    "capital": "Brasília",
    "cname": "South America"
},
{
    "code": "BS",
    "name": "Bahamas",
    "currencyCode": "BSD",
    "population": "301790",
    "capital": "Nassau",
    "cname": "North America"
},
{
    "code": "BT",
    "name": "Bhutan",
    "currencyCode": "BTN",
    "population": "699847",
    "capital": "Thimphu",
    "cname": "Asia"
},
{
    "code": "BV",
    "name": "Bouvet Island",
    "currencyCode": "NOK",
    "population": "0",
    "capital": "",
    "cname": "Antarctica"
},
{
    "code": "BW",
    "name": "Botswana",
    "currencyCode": "BWP",
    "population": "2029307",
    "capital": "Gaborone",
    "cname": "Africa"
},
{
    "code": "BY",
    "name": "Belarus",
    "currencyCode": "BYR",
    "population": "9685000",
    "capital": "Minsk",
    "cname": "Europe"
},
{
    "code": "BZ",
    "name": "Belize",
    "currencyCode": "BZD",
    "population": "314522",
    "capital": "Belmopan",
    "cname": "North America"
},
{
    "code": "CA",
    "name": "Canada",
    "currencyCode": "CAD",
    "population": "33679000",
    "capital": "Ottawa",
    "cname": "North America"
},
{
    "code": "CC",
    "name": "Cocos [Keeling] Islands",
    "currencyCode": "AUD",
    "population": "628",
    "capital": "West Island",
    "cname": "Asia"
},
{
    "code": "CD",
    "name": "Democratic Republic of the Congo",
    "currencyCode": "CDF",
    "population": "70916439",
    "capital": "Kinshasa",
    "cname": "Africa"
},
{
    "code": "CF",
    "name": "Central African Republic",
    "currencyCode": "XAF",
    "population": "4844927",
    "capital": "Bangui",
    "cname": "Africa"
},
{
    "code": "CG",
    "name": "Republic of the Congo",
    "currencyCode": "XAF",
    "population": "3039126",
    "capital": "Brazzaville",
    "cname": "Africa"
},
{
    "code": "CH",
    "name": "Switzerland",
    "currencyCode": "CHF",
    "population": "7581000",
    "capital": "Bern",
    "cname": "Europe"
},
{
    "code": "CI",
    "name": "Ivory Coast",
    "currencyCode": "XOF",
    "population": "21058798",
    "capital": "Yamoussoukro",
    "cname": "Africa"
},
{
    "code": "CK",
    "name": "Cook Islands",
    "currencyCode": "NZD",
    "population": "21388",
    "capital": "Avarua",
    "cname": "Oceania"
},
{
    "code": "CL",
    "name": "Chile",
    "currencyCode": "CLP",
    "population": "16746491",
    "capital": "Santiago",
    "cname": "South America"
},
{
    "code": "CM",
    "name": "Cameroon",
    "currencyCode": "XAF",
    "population": "19294149",
    "capital": "Yaoundé",
    "cname": "Africa"
},
{
    "code": "CN",
    "name": "China",
    "currencyCode": "CNY",
    "population": "1330044000",
    "capital": "Beijing",
    "cname": "Asia"
},
{
    "code": "CO",
    "name": "Colombia",
    "currencyCode": "COP",
    "population": "47790000",
    "capital": "Bogotá",
    "cname": "South America"
},
{
    "code": "CR",
    "name": "Costa Rica",
    "currencyCode": "CRC",
    "population": "4516220",
    "capital": "San José",
    "cname": "North America"
},
{
    "code": "CU",
    "name": "Cuba",
    "currencyCode": "CUP",
    "population": "11423000",
    "capital": "Havana",
    "cname": "North America"
},
{
    "code": "CV",
    "name": "Cape Verde",
    "currencyCode": "CVE",
    "population": "508659",
    "capital": "Praia",
    "cname": "Africa"
},
{
    "code": "CW",
    "name": "Curacao",
    "currencyCode": "ANG",
    "population": "141766",
    "capital": "Willemstad",
    "cname": "North America"
},
{
    "code": "CX",
    "name": "Christmas Island",
    "currencyCode": "AUD",
    "population": "1500",
    "capital": "Flying Fish Cove",
    "cname": "Asia"
},
{
    "code": "CY",
    "name": "Cyprus",
    "currencyCode": "EUR",
    "population": "1102677",
    "capital": "Nicosia",
    "cname": "Europe"
},
{
    "code": "CZ",
    "name": "Czechia",
    "currencyCode": "CZK",
    "population": "10476000",
    "capital": "Prague",
    "cname": "Europe"
},
{
    "code": "DE",
    "name": "Germany",
    "currencyCode": "EUR",
    "population": "81802257",
    "capital": "Berlin",
    "cname": "Europe"
},
{
    "code": "DJ",
    "name": "Djibouti",
    "currencyCode": "DJF",
    "population": "740528",
    "capital": "Djibouti",
    "cname": "Africa"
},
{
    "code": "DK",
    "name": "Denmark",
    "currencyCode": "DKK",
    "population": "5484000",
    "capital": "Copenhagen",
    "cname": "Europe"
},
{
    "code": "DM",
    "name": "Dominica",
    "currencyCode": "XCD",
    "population": "72813",
    "capital": "Roseau",
    "cname": "North America"
},
{
    "code": "DO",
    "name": "Dominican Republic",
    "currencyCode": "DOP",
    "population": "9823821",
    "capital": "Santo Domingo",
    "cname": "North America"
},
{
    "code": "DZ",
    "name": "Algeria",
    "currencyCode": "DZD",
    "population": "34586184",
    "capital": "Algiers",
    "cname": "Africa"
},
{
    "code": "EC",
    "name": "Ecuador",
    "currencyCode": "USD",
    "population": "14790608",
    "capital": "Quito",
    "cname": "South America"
},
{
    "code": "EE",
    "name": "Estonia",
    "currencyCode": "EUR",
    "population": "1291170",
    "capital": "Tallinn",
    "cname": "Europe"
},
{
    "code": "EG",
    "name": "Egypt",
    "currencyCode": "EGP",
    "population": "80471869",
    "capital": "Cairo",
    "cname": "Africa"
},
{
    "code": "EH",
    "name": "Western Sahara",
    "currencyCode": "MAD",
    "population": "273008",
    "capital": "Laâyoune / El Aaiún",
    "cname": "Africa"
},
{
    "code": "ER",
    "name": "Eritrea",
    "currencyCode": "ERN",
    "population": "5792984",
    "capital": "Asmara",
    "cname": "Africa"
},
{
    "code": "ES",
    "name": "Spain",
    "currencyCode": "EUR",
    "population": "46505963",
    "capital": "Madrid",
    "cname": "Europe"
},
{
    "code": "ET",
    "name": "Ethiopia",
    "currencyCode": "ETB",
    "population": "88013491",
    "capital": "Addis Ababa",
    "cname": "Africa"
},
{
    "code": "FI",
    "name": "Finland",
    "currencyCode": "EUR",
    "population": "5244000",
    "capital": "Helsinki",
    "cname": "Europe"
},
{
    "code": "FJ",
    "name": "Fiji",
    "currencyCode": "FJD",
    "population": "875983",
    "capital": "Suva",
    "cname": "Oceania"
},
{
    "code": "FK",
    "name": "Falkland Islands",
    "currencyCode": "FKP",
    "population": "2638",
    "capital": "Stanley",
    "cname": "South America"
},
{
    "code": "FM",
    "name": "Micronesia",
    "currencyCode": "USD",
    "population": "107708",
    "capital": "Palikir",
    "cname": "Oceania"
},
{
    "code": "FO",
    "name": "Faroe Islands",
    "currencyCode": "DKK",
    "population": "48228",
    "capital": "Tórshavn",
    "cname": "Europe"
},
{
    "code": "FR",
    "name": "France",
    "currencyCode": "EUR",
    "population": "64768389",
    "capital": "Paris",
    "cname": "Europe"
},
{
    "code": "GA",
    "name": "Gabon",
    "currencyCode": "XAF",
    "population": "1545255",
    "capital": "Libreville",
    "cname": "Africa"
},
{
    "code": "GB",
    "name": "United Kingdom",
    "currencyCode": "GBP",
    "population": "62348447",
    "capital": "London",
    "cname": "Europe"
},
{
    "code": "GD",
    "name": "Grenada",
    "currencyCode": "XCD",
    "population": "107818",
    "capital": "St. George's",
    "cname": "North America"
},
{
    "code": "GE",
    "name": "Georgia",
    "currencyCode": "GEL",
    "population": "4630000",
    "capital": "Tbilisi",
    "cname": "Asia"
},
{
    "code": "GF",
    "name": "French Guiana",
    "currencyCode": "EUR",
    "population": "195506",
    "capital": "Cayenne",
    "cname": "South America"
},
{
    "code": "GG",
    "name": "Guernsey",
    "currencyCode": "GBP",
    "population": "65228",
    "capital": "St Peter Port",
    "cname": "Europe"
},
{
    "code": "GH",
    "name": "Ghana",
    "currencyCode": "GHS",
    "population": "24339838",
    "capital": "Accra",
    "cname": "Africa"
},
{
    "code": "GI",
    "name": "Gibraltar",
    "currencyCode": "GIP",
    "population": "27884",
    "capital": "Gibraltar",
    "cname": "Europe"
},
{
    "code": "GL",
    "name": "Greenland",
    "currencyCode": "DKK",
    "population": "56375",
    "capital": "Nuuk",
    "cname": "North America"
},
{
    "code": "GM",
    "name": "Gambia",
    "currencyCode": "GMD",
    "population": "1593256",
    "capital": "Bathurst",
    "cname": "Africa"
},
{
    "code": "GN",
    "name": "Guinea",
    "currencyCode": "GNF",
    "population": "10324025",
    "capital": "Conakry",
    "cname": "Africa"
},
{
    "code": "GP",
    "name": "Guadeloupe",
    "currencyCode": "EUR",
    "population": "443000",
    "capital": "Basse-Terre",
    "cname": "North America"
},
{
    "code": "GQ",
    "name": "Equatorial Guinea",
    "currencyCode": "XAF",
    "population": "1014999",
    "capital": "Malabo",
    "cname": "Africa"
},
{
    "code": "GR",
    "name": "Greece",
    "currencyCode": "EUR",
    "population": "11000000",
    "capital": "Athens",
    "cname": "Europe"
},
{
    "code": "GS",
    "name": "South Georgia and the South Sandwich Islands",
    "currencyCode": "GBP",
    "population": "30",
    "capital": "Grytviken",
    "cname": "Antarctica"
},
{
    "code": "GT",
    "name": "Guatemala",
    "currencyCode": "GTQ",
    "population": "13550440",
    "capital": "Guatemala City",
    "cname": "North America"
},
{
    "code": "GU",
    "name": "Guam",
    "currencyCode": "USD",
    "population": "159358",
    "capital": "Hagåtña",
    "cname": "Oceania"
},
{
    "code": "GW",
    "name": "Guinea-Bissau",
    "currencyCode": "XOF",
    "population": "1565126",
    "capital": "Bissau",
    "cname": "Africa"
},
{
    "code": "GY",
    "name": "Guyana",
    "currencyCode": "GYD",
    "population": "748486",
    "capital": "Georgetown",
    "cname": "South America"
},
{
    "code": "HK",
    "name": "Hong Kong",
    "currencyCode": "HKD",
    "population": "6898686",
    "capital": "Hong Kong",
    "cname": "Asia"
},
{
    "code": "HM",
    "name": "Heard Island and McDonald Islands",
    "currencyCode": "AUD",
    "population": "0",
    "capital": "",
    "cname": "Antarctica"
},
{
    "code": "HN",
    "name": "Honduras",
    "currencyCode": "HNL",
    "population": "7989415",
    "capital": "Tegucigalpa",
    "cname": "North America"
},
{
    "code": "HR",
    "name": "Croatia",
    "currencyCode": "HRK",
    "population": "4284889",
    "capital": "Zagreb",
    "cname": "Europe"
},
{
    "code": "HT",
    "name": "Haiti",
    "currencyCode": "HTG",
    "population": "9648924",
    "capital": "Port-au-Prince",
    "cname": "North America"
},
{
    "code": "HU",
    "name": "Hungary",
    "currencyCode": "HUF",
    "population": "9982000",
    "capital": "Budapest",
    "cname": "Europe"
},
{
    "code": "ID",
    "name": "Indonesia",
    "currencyCode": "IDR",
    "population": "242968342",
    "capital": "Jakarta",
    "cname": "Asia"
},
{
    "code": "IE",
    "name": "Ireland",
    "currencyCode": "EUR",
    "population": "4622917",
    "capital": "Dublin",
    "cname": "Europe"
},
{
    "code": "IL",
    "name": "Israel",
    "currencyCode": "ILS",
    "population": "7353985",
    "capital": "",
    "cname": "Asia"
},
{
    "code": "IM",
    "name": "Isle of Man",
    "currencyCode": "GBP",
    "population": "75049",
    "capital": "Douglas",
    "cname": "Europe"
},
{
    "code": "IN",
    "name": "India",
    "currencyCode": "INR",
    "population": "1173108018",
    "capital": "New Delhi",
    "cname": "Asia"
},
{
    "code": "IO",
    "name": "British Indian Ocean Territory",
    "currencyCode": "USD",
    "population": "4000",
    "capital": "",
    "cname": "Asia"
},
{
    "code": "IQ",
    "name": "Iraq",
    "currencyCode": "IQD",
    "population": "29671605",
    "capital": "Baghdad",
    "cname": "Asia"
},
{
    "code": "IR",
    "name": "Iran",
    "currencyCode": "IRR",
    "population": "76923300",
    "capital": "Tehran",
    "cname": "Asia"
},
{
    "code": "IS",
    "name": "Iceland",
    "currencyCode": "ISK",
    "population": "308910",
    "capital": "Reykjavik",
    "cname": "Europe"
},
{
    "code": "IT",
    "name": "Italy",
    "currencyCode": "EUR",
    "population": "60340328",
    "capital": "Rome",
    "cname": "Europe"
},
{
    "code": "JE",
    "name": "Jersey",
    "currencyCode": "GBP",
    "population": "90812",
    "capital": "Saint Helier",
    "cname": "Europe"
},
{
    "code": "JM",
    "name": "Jamaica",
    "currencyCode": "JMD",
    "population": "2847232",
    "capital": "Kingston",
    "cname": "North America"
},
{
    "code": "JO",
    "name": "Jordan",
    "currencyCode": "JOD",
    "population": "6407085",
    "capital": "Amman",
    "cname": "Asia"
},
{
    "code": "JP",
    "name": "Japan",
    "currencyCode": "JPY",
    "population": "127288000",
    "capital": "Tokyo",
    "cname": "Asia"
},
{
    "code": "KE",
    "name": "Kenya",
    "currencyCode": "KES",
    "population": "40046566",
    "capital": "Nairobi",
    "cname": "Africa"
},
{
    "code": "KG",
    "name": "Kyrgyzstan",
    "currencyCode": "KGS",
    "population": "5776500",
    "capital": "Bishkek",
    "cname": "Asia"
},
{
    "code": "KH",
    "name": "Cambodia",
    "currencyCode": "KHR",
    "population": "14453680",
    "capital": "Phnom Penh",
    "cname": "Asia"
},
{
    "code": "KI",
    "name": "Kiribati",
    "currencyCode": "AUD",
    "population": "92533",
    "capital": "Tarawa",
    "cname": "Oceania"
},
{
    "code": "KM",
    "name": "Comoros",
    "currencyCode": "KMF",
    "population": "773407",
    "capital": "Moroni",
    "cname": "Africa"
},
{
    "code": "KN",
    "name": "Saint Kitts and Nevis",
    "currencyCode": "XCD",
    "population": "51134",
    "capital": "Basseterre",
    "cname": "North America"
},
{
    "code": "KP",
    "name": "North Korea",
    "currencyCode": "KPW",
    "population": "22912177",
    "capital": "Pyongyang",
    "cname": "Asia"
},
{
    "code": "KR",
    "name": "South Korea",
    "currencyCode": "KRW",
    "population": "48422644",
    "capital": "Seoul",
    "cname": "Asia"
},
{
    "code": "KW",
    "name": "Kuwait",
    "currencyCode": "KWD",
    "population": "2789132",
    "capital": "Kuwait City",
    "cname": "Asia"
},
{
    "code": "KY",
    "name": "Cayman Islands",
    "currencyCode": "KYD",
    "population": "44270",
    "capital": "George Town",
    "cname": "North America"
},
{
    "code": "KZ",
    "name": "Kazakhstan",
    "currencyCode": "KZT",
    "population": "15340000",
    "capital": "Astana",
    "cname": "Asia"
},
{
    "code": "LA",
    "name": "Laos",
    "currencyCode": "LAK",
    "population": "6368162",
    "capital": "Vientiane",
    "cname": "Asia"
},
{
    "code": "LB",
    "name": "Lebanon",
    "currencyCode": "LBP",
    "population": "4125247",
    "capital": "Beirut",
    "cname": "Asia"
},
{
    "code": "LC",
    "name": "Saint Lucia",
    "currencyCode": "XCD",
    "population": "160922",
    "capital": "Castries",
    "cname": "North America"
},
{
    "code": "LI",
    "name": "Liechtenstein",
    "currencyCode": "CHF",
    "population": "35000",
    "capital": "Vaduz",
    "cname": "Europe"
},
{
    "code": "LK",
    "name": "Sri Lanka",
    "currencyCode": "LKR",
    "population": "21513990",
    "capital": "Colombo",
    "cname": "Asia"
},
{
    "code": "LR",
    "name": "Liberia",
    "currencyCode": "LRD",
    "population": "3685076",
    "capital": "Monrovia",
    "cname": "Africa"
},
{
    "code": "LS",
    "name": "Lesotho",
    "currencyCode": "LSL",
    "population": "1919552",
    "capital": "Maseru",
    "cname": "Africa"
},
{
    "code": "LT",
    "name": "Lithuania",
    "currencyCode": "EUR",
    "population": "2944459",
    "capital": "Vilnius",
    "cname": "Europe"
},
{
    "code": "LU",
    "name": "Luxembourg",
    "currencyCode": "EUR",
    "population": "497538",
    "capital": "Luxembourg",
    "cname": "Europe"
},
{
    "code": "LV",
    "name": "Latvia",
    "currencyCode": "EUR",
    "population": "2217969",
    "capital": "Riga",
    "cname": "Europe"
},
{
    "code": "LY",
    "name": "Libya",
    "currencyCode": "LYD",
    "population": "6461454",
    "capital": "Tripoli",
    "cname": "Africa"
},
{
    "code": "MA",
    "name": "Morocco",
    "currencyCode": "MAD",
    "population": "33848242",
    "capital": "Rabat",
    "cname": "Africa"
},
{
    "code": "MC",
    "name": "Monaco",
    "currencyCode": "EUR",
    "population": "32965",
    "capital": "Monaco",
    "cname": "Europe"
},
{
    "code": "MD",
    "name": "Moldova",
    "currencyCode": "MDL",
    "population": "4324000",
    "capital": "Chişinău",
    "cname": "Europe"
},
{
    "code": "ME",
    "name": "Montenegro",
    "currencyCode": "EUR",
    "population": "666730",
    "capital": "Podgorica",
    "cname": "Europe"
},
{
    "code": "MF",
    "name": "Saint Martin",
    "currencyCode": "EUR",
    "population": "35925",
    "capital": "Marigot",
    "cname": "North America"
},
{
    "code": "MG",
    "name": "Madagascar",
    "currencyCode": "MGA",
    "population": "21281844",
    "capital": "Antananarivo",
    "cname": "Africa"
},
{
    "code": "MH",
    "name": "Marshall Islands",
    "currencyCode": "USD",
    "population": "65859",
    "capital": "Majuro",
    "cname": "Oceania"
},
{
    "code": "MK",
    "name": "Macedonia",
    "currencyCode": "MKD",
    "population": "2062294",
    "capital": "Skopje",
    "cname": "Europe"
},
{
    "code": "ML",
    "name": "Mali",
    "currencyCode": "XOF",
    "population": "13796354",
    "capital": "Bamako",
    "cname": "Africa"
},
{
    "code": "MM",
    "name": "Myanmar [Burma]",
    "currencyCode": "MMK",
    "population": "53414374",
    "capital": "Naypyitaw",
    "cname": "Asia"
},
{
    "code": "MN",
    "name": "Mongolia",
    "currencyCode": "MNT",
    "population": "3086918",
    "capital": "Ulan Bator",
    "cname": "Asia"
},
{
    "code": "MO",
    "name": "Macao",
    "currencyCode": "MOP",
    "population": "449198",
    "capital": "Macao",
    "cname": "Asia"
},
{
    "code": "MP",
    "name": "Northern Mariana Islands",
    "currencyCode": "USD",
    "population": "53883",
    "capital": "Saipan",
    "cname": "Oceania"
},
{
    "code": "MQ",
    "name": "Martinique",
    "currencyCode": "EUR",
    "population": "432900",
    "capital": "Fort-de-France",
    "cname": "North America"
},
{
    "code": "MR",
    "name": "Mauritania",
    "currencyCode": "MRO",
    "population": "3205060",
    "capital": "Nouakchott",
    "cname": "Africa"
},
{
    "code": "MS",
    "name": "Montserrat",
    "currencyCode": "XCD",
    "population": "9341",
    "capital": "Plymouth",
    "cname": "North America"
},
{
    "code": "MT",
    "name": "Malta",
    "currencyCode": "EUR",
    "population": "403000",
    "capital": "Valletta",
    "cname": "Europe"
},
{
    "code": "MU",
    "name": "Mauritius",
    "currencyCode": "MUR",
    "population": "1294104",
    "capital": "Port Louis",
    "cname": "Africa"
},
{
    "code": "MV",
    "name": "Maldives",
    "currencyCode": "MVR",
    "population": "395650",
    "capital": "Malé",
    "cname": "Asia"
},
{
    "code": "MW",
    "name": "Malawi",
    "currencyCode": "MWK",
    "population": "15447500",
    "capital": "Lilongwe",
    "cname": "Africa"
},
{
    "code": "MX",
    "name": "Mexico",
    "currencyCode": "MXN",
    "population": "112468855",
    "capital": "Mexico City",
    "cname": "North America"
},
{
    "code": "MY",
    "name": "Malaysia",
    "currencyCode": "MYR",
    "population": "28274729",
    "capital": "Kuala Lumpur",
    "cname": "Asia"
},
{
    "code": "MZ",
    "name": "Mozambique",
    "currencyCode": "MZN",
    "population": "22061451",
    "capital": "Maputo",
    "cname": "Africa"
},
{
    "code": "NA",
    "name": "Namibia",
    "currencyCode": "NAD",
    "population": "2128471",
    "capital": "Windhoek",
    "cname": "Africa"
},
{
    "code": "NC",
    "name": "New Caledonia",
    "currencyCode": "XPF",
    "population": "216494",
    "capital": "Noumea",
    "cname": "Oceania"
},
{
    "code": "NE",
    "name": "Niger",
    "currencyCode": "XOF",
    "population": "15878271",
    "capital": "Niamey",
    "cname": "Africa"
},
{
    "code": "NF",
    "name": "Norfolk Island",
    "currencyCode": "AUD",
    "population": "1828",
    "capital": "Kingston",
    "cname": "Oceania"
},
{
    "code": "NG",
    "name": "Nigeria",
    "currencyCode": "NGN",
    "population": "154000000",
    "capital": "Abuja",
    "cname": "Africa"
},
{
    "code": "NI",
    "name": "Nicaragua",
    "currencyCode": "NIO",
    "population": "5995928",
    "capital": "Managua",
    "cname": "North America"
},
{
    "code": "NL",
    "name": "Netherlands",
    "currencyCode": "EUR",
    "population": "16645000",
    "capital": "Amsterdam",
    "cname": "Europe"
},
{
    "code": "NO",
    "name": "Norway",
    "currencyCode": "NOK",
    "population": "5009150",
    "capital": "Oslo",
    "cname": "Europe"
},
{
    "code": "NP",
    "name": "Nepal",
    "currencyCode": "NPR",
    "population": "28951852",
    "capital": "Kathmandu",
    "cname": "Asia"
},
{
    "code": "NR",
    "name": "Nauru",
    "currencyCode": "AUD",
    "population": "10065",
    "capital": "Yaren",
    "cname": "Oceania"
},
{
    "code": "NU",
    "name": "Niue",
    "currencyCode": "NZD",
    "population": "2166",
    "capital": "Alofi",
    "cname": "Oceania"
},
{
    "code": "NZ",
    "name": "New Zealand",
    "currencyCode": "NZD",
    "population": "4252277",
    "capital": "Wellington",
    "cname": "Oceania"
},
{
    "code": "OM",
    "name": "Oman",
    "currencyCode": "OMR",
    "population": "2967717",
    "capital": "Muscat",
    "cname": "Asia"
},
{
    "code": "PA",
    "name": "Panama",
    "currencyCode": "PAB",
    "population": "3410676",
    "capital": "Panama City",
    "cname": "North America"
},
{
    "code": "PE",
    "name": "Peru",
    "currencyCode": "PEN",
    "population": "29907003",
    "capital": "Lima",
    "cname": "South America"
},
{
    "code": "PF",
    "name": "French Polynesia",
    "currencyCode": "XPF",
    "population": "270485",
    "capital": "Papeete",
    "cname": "Oceania"
},
{
    "code": "PG",
    "name": "Papua New Guinea",
    "currencyCode": "PGK",
    "population": "6064515",
    "capital": "Port Moresby",
    "cname": "Oceania"
},
{
    "code": "PH",
    "name": "Philippines",
    "currencyCode": "PHP",
    "population": "99900177",
    "capital": "Manila",
    "cname": "Asia"
},
{
    "code": "PK",
    "name": "Pakistan",
    "currencyCode": "PKR",
    "population": "184404791",
    "capital": "Islamabad",
    "cname": "Asia"
},
{
    "code": "PL",
    "name": "Poland",
    "currencyCode": "PLN",
    "population": "38500000",
    "capital": "Warsaw",
    "cname": "Europe"
},
{
    "code": "PM",
    "name": "Saint Pierre and Miquelon",
    "currencyCode": "EUR",
    "population": "7012",
    "capital": "Saint-Pierre",
    "cname": "North America"
},
{
    "code": "PN",
    "name": "Pitcairn Islands",
    "currencyCode": "NZD",
    "population": "46",
    "capital": "Adamstown",
    "cname": "Oceania"
},
{
    "code": "PR",
    "name": "Puerto Rico",
    "currencyCode": "USD",
    "population": "3916632",
    "capital": "San Juan",
    "cname": "North America"
},
{
    "code": "PS",
    "name": "Palestine",
    "currencyCode": "ILS",
    "population": "3800000",
    "capital": "",
    "cname": "Asia"
},
{
    "code": "PT",
    "name": "Portugal",
    "currencyCode": "EUR",
    "population": "10676000",
    "capital": "Lisbon",
    "cname": "Europe"
},
{
    "code": "PW",
    "name": "Palau",
    "currencyCode": "USD",
    "population": "19907",
    "capital": "Melekeok",
    "cname": "Oceania"
},
{
    "code": "PY",
    "name": "Paraguay",
    "currencyCode": "PYG",
    "population": "6375830",
    "capital": "Asunción",
    "cname": "South America"
},
{
    "code": "QA",
    "name": "Qatar",
    "currencyCode": "QAR",
    "population": "840926",
    "capital": "Doha",
    "cname": "Asia"
},
{
    "code": "RE",
    "name": "Réunion",
    "currencyCode": "EUR",
    "population": "776948",
    "capital": "Saint-Denis",
    "cname": "Africa"
},
{
    "code": "RO",
    "name": "Romania",
    "currencyCode": "RON",
    "population": "21959278",
    "capital": "Bucharest",
    "cname": "Europe"
},
{
    "code": "RS",
    "name": "Serbia",
    "currencyCode": "RSD",
    "population": "7344847",
    "capital": "Belgrade",
    "cname": "Europe"
},
{
    "code": "RU",
    "name": "Russia",
    "currencyCode": "RUB",
    "population": "140702000",
    "capital": "Moscow",
    "cname": "Europe"
},
{
    "code": "RW",
    "name": "Rwanda",
    "currencyCode": "RWF",
    "population": "11055976",
    "capital": "Kigali",
    "cname": "Africa"
},
{
    "code": "SA",
    "name": "Saudi Arabia",
    "currencyCode": "SAR",
    "population": "25731776",
    "capital": "Riyadh",
    "cname": "Asia"
},
{
    "code": "SB",
    "name": "Solomon Islands",
    "currencyCode": "SBD",
    "population": "559198",
    "capital": "Honiara",
    "cname": "Oceania"
},
{
    "code": "SC",
    "name": "Seychelles",
    "currencyCode": "SCR",
    "population": "88340",
    "capital": "Victoria",
    "cname": "Africa"
},
{
    "code": "SD",
    "name": "Sudan",
    "currencyCode": "SDG",
    "population": "35000000",
    "capital": "Khartoum",
    "cname": "Africa"
},
{
    "code": "SE",
    "name": "Sweden",
    "currencyCode": "SEK",
    "population": "9828655",
    "capital": "Stockholm",
    "cname": "Europe"
},
{
    "code": "SG",
    "name": "Singapore",
    "currencyCode": "SGD",
    "population": "4701069",
    "capital": "Singapore",
    "cname": "Asia"
},
{
    "code": "SH",
    "name": "Saint Helena",
    "currencyCode": "SHP",
    "population": "7460",
    "capital": "Jamestown",
    "cname": "Africa"
},
{
    "code": "SI",
    "name": "Slovenia",
    "currencyCode": "EUR",
    "population": "2007000",
    "capital": "Ljubljana",
    "cname": "Europe"
},
{
    "code": "SJ",
    "name": "Svalbard and Jan Mayen",
    "currencyCode": "NOK",
    "population": "2550",
    "capital": "Longyearbyen",
    "cname": "Europe"
},
{
    "code": "SK",
    "name": "Slovakia",
    "currencyCode": "EUR",
    "population": "5455000",
    "capital": "Bratislava",
    "cname": "Europe"
},
{
    "code": "SL",
    "name": "Sierra Leone",
    "currencyCode": "SLL",
    "population": "5245695",
    "capital": "Freetown",
    "cname": "Africa"
},
{
    "code": "SM",
    "name": "San Marino",
    "currencyCode": "EUR",
    "population": "31477",
    "capital": "San Marino",
    "cname": "Europe"
},
{
    "code": "SN",
    "name": "Senegal",
    "currencyCode": "XOF",
    "population": "12323252",
    "capital": "Dakar",
    "cname": "Africa"
},
{
    "code": "SO",
    "name": "Somalia",
    "currencyCode": "SOS",
    "population": "10112453",
    "capital": "Mogadishu",
    "cname": "Africa"
},
{
    "code": "SR",
    "name": "Suriname",
    "currencyCode": "SRD",
    "population": "492829",
    "capital": "Paramaribo",
    "cname": "South America"
},
{
    "code": "SS",
    "name": "South Sudan",
    "currencyCode": "SSP",
    "population": "8260490",
    "capital": "Juba",
    "cname": "Africa"
},
{
    "code": "ST",
    "name": "São Tomé and Príncipe",
    "currencyCode": "STD",
    "population": "175808",
    "capital": "São Tomé",
    "cname": "Africa"
},
{
    "code": "SV",
    "name": "El Salvador",
    "currencyCode": "USD",
    "population": "6052064",
    "capital": "San Salvador",
    "cname": "North America"
},
{
    "code": "SX",
    "name": "Sint Maarten",
    "currencyCode": "ANG",
    "population": "37429",
    "capital": "Philipsburg",
    "cname": "North America"
},
{
    "code": "SY",
    "name": "Syria",
    "currencyCode": "SYP",
    "population": "22198110",
    "capital": "Damascus",
    "cname": "Asia"
},
{
    "code": "SZ",
    "name": "Swaziland",
    "currencyCode": "SZL",
    "population": "1354051",
    "capital": "Mbabane",
    "cname": "Africa"
},
{
    "code": "TC",
    "name": "Turks and Caicos Islands",
    "currencyCode": "USD",
    "population": "20556",
    "capital": "Cockburn Town",
    "cname": "North America"
},
{
    "code": "TD",
    "name": "Chad",
    "currencyCode": "XAF",
    "population": "10543464",
    "capital": "N'Djamena",
    "cname": "Africa"
},
{
    "code": "TF",
    "name": "French Southern Territories",
    "currencyCode": "EUR",
    "population": "140",
    "capital": "Port-aux-Français",
    "cname": "Antarctica"
},
{
    "code": "TG",
    "name": "Togo",
    "currencyCode": "XOF",
    "population": "6587239",
    "capital": "Lomé",
    "cname": "Africa"
},
{
    "code": "TH",
    "name": "Thailand",
    "currencyCode": "THB",
    "population": "67089500",
    "capital": "Bangkok",
    "cname": "Asia"
},
{
    "code": "TJ",
    "name": "Tajikistan",
    "currencyCode": "TJS",
    "population": "7487489",
    "capital": "Dushanbe",
    "cname": "Asia"
},
{
    "code": "TK",
    "name": "Tokelau",
    "currencyCode": "NZD",
    "population": "1466",
    "capital": "",
    "cname": "Oceania"
},
{
    "code": "TL",
    "name": "East Timor",
    "currencyCode": "USD",
    "population": "1154625",
    "capital": "Dili",
    "cname": "Oceania"
},
{
    "code": "TM",
    "name": "Turkmenistan",
    "currencyCode": "TMT",
    "population": "4940916",
    "capital": "Ashgabat",
    "cname": "Asia"
},
{
    "code": "TN",
    "name": "Tunisia",
    "currencyCode": "TND",
    "population": "10589025",
    "capital": "Tunis",
    "cname": "Africa"
},
{
    "code": "TO",
    "name": "Tonga",
    "currencyCode": "TOP",
    "population": "122580",
    "capital": "Nuku'alofa",
    "cname": "Oceania"
},
{
    "code": "TR",
    "name": "Turkey",
    "currencyCode": "TRY",
    "population": "77804122",
    "capital": "Ankara",
    "cname": "Asia"
},
{
    "code": "TT",
    "name": "Trinidad and Tobago",
    "currencyCode": "TTD",
    "population": "1228691",
    "capital": "Port of Spain",
    "cname": "North America"
},
{
    "code": "TV",
    "name": "Tuvalu",
    "currencyCode": "AUD",
    "population": "10472",
    "capital": "Funafuti",
    "cname": "Oceania"
},
{
    "code": "TW",
    "name": "Taiwan",
    "currencyCode": "TWD",
    "population": "22894384",
    "capital": "Taipei",
    "cname": "Asia"
},
{
    "code": "TZ",
    "name": "Tanzania",
    "currencyCode": "TZS",
    "population": "41892895",
    "capital": "Dodoma",
    "cname": "Africa"
},
{
    "code": "UA",
    "name": "Ukraine",
    "currencyCode": "UAH",
    "population": "45415596",
    "capital": "Kiev",
    "cname": "Europe"
},
{
    "code": "UG",
    "name": "Uganda",
    "currencyCode": "UGX",
    "population": "33398682",
    "capital": "Kampala",
    "cname": "Africa"
},
{
    "code": "UM",
    "name": "U.S. Minor Outlying Islands",
    "currencyCode": "USD",
    "population": "0",
    "capital": "",
    "cname": "Oceania"
},
{
    "code": "US",
    "name": "United States",
    "currencyCode": "USD",
    "population": "310232863",
    "capital": "Washington",
    "cname": "North America"
},
{
    "code": "UY",
    "name": "Uruguay",
    "currencyCode": "UYU",
    "population": "3477000",
    "capital": "Montevideo",
    "cname": "South America"
},
{
    "code": "UZ",
    "name": "Uzbekistan",
    "currencyCode": "UZS",
    "population": "27865738",
    "capital": "Tashkent",
    "cname": "Asia"
},
{
    "code": "VA",
    "name": "Vatican City",
    "currencyCode": "EUR",
    "population": "921",
    "capital": "Vatican City",
    "cname": "Europe"
},
{
    "code": "VC",
    "name": "Saint Vincent and the Grenadines",
    "currencyCode": "XCD",
    "population": "104217",
    "capital": "Kingstown",
    "cname": "North America"
},
{
    "code": "VE",
    "name": "Venezuela",
    "currencyCode": "VEF",
    "population": "27223228",
    "capital": "Caracas",
    "cname": "South America"
},
{
    "code": "VG",
    "name": "British Virgin Islands",
    "currencyCode": "USD",
    "population": "21730",
    "capital": "Road Town",
    "cname": "North America"
},
{
    "code": "VI",
    "name": "U.S. Virgin Islands",
    "currencyCode": "USD",
    "population": "108708",
    "capital": "Charlotte Amalie",
    "cname": "North America"
},
{
    "code": "VN",
    "name": "Vietnam",
    "currencyCode": "VND",
    "population": "89571130",
    "capital": "Hanoi",
    "cname": "Asia"
},
{
    "code": "VU",
    "name": "Vanuatu",
    "currencyCode": "VUV",
    "population": "221552",
    "capital": "Port Vila",
    "cname": "Oceania"
},
{
    "code": "WF",
    "name": "Wallis and Futuna",
    "currencyCode": "XPF",
    "population": "16025",
    "capital": "Mata-Utu",
    "cname": "Oceania"
},
{
    "code": "WS",
    "name": "Samoa",
    "currencyCode": "WST",
    "population": "192001",
    "capital": "Apia",
    "cname": "Oceania"
},
{
    "code": "XK",
    "name": "Kosovo",
    "currencyCode": "EUR",
    "population": "1800000",
    "capital": "Pristina",
    "cname": "Europe"
},
{
    "code": "YE",
    "name": "Yemen",
    "currencyCode": "YER",
    "population": "23495361",
    "capital": "Sanaa",
    "cname": "Asia"
},
{
    "code": "YT",
    "name": "Mayotte",
    "currencyCode": "EUR",
    "population": "159042",
    "capital": "Mamoudzou",
    "cname": "Africa"
},
{
    "code": "ZA",
    "name": "South Africa",
    "currencyCode": "ZAR",
    "population": "49000000",
    "capital": "Pretoria",
    "cname": "Africa"
},
{
    "code": "ZM",
    "name": "Zambia",
    "currencyCode": "ZMW",
    "population": "13460305",
    "capital": "Lusaka",
    "cname": "Africa"
},
{
    "code": "ZW",
    "name": "Zimbabwe",
    "currencyCode": "ZWL",
    "population": "13061000",
    "capital": "Harare",
    "cname": "Africa"
}
  
];
