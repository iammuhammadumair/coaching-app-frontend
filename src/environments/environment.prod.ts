// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  paymentMethod: { paypal: true },
  firebase: {
    apiKey:             'AIzaSyBVvvDqq8QBaRmbVhVnJrUbw4EdKeSD7Gw',
    authDomain:         'app-3dhomes-prod.firebaseapp.com',
    databaseURL:        'https://app-3dhomes-prod.firebaseio.com',
    projectId:          'app-3dhomes-prod',
    storageBucket:      'app-3dhomes-prod.appspot.com',
    messagingSenderId:  '938975470837',
    cloudFunctionsUrl:  'https://us-central1-app-3dhomes-prod.cloudfunctions.net'
  },
  mangoPay: {
    url: 'https://api.mangopay.com',
    clientId: 'succeedprod'
  },
  paypal: {
    client_id: "AW6RAPsLvAfGf-dL_mrL9iQdxr8-ObIy_7VOwRkSZm1Va6q1yBdeBM7JMArAOrMDPBPdl2ie0hj-WkVf"
  },
  zoomToShowPrice: 9,
  mailToContactUs: 'info@coachhub.me',
  gcpApiKey: 'AIzaSyD9pJdqNNJzNMBL5SVVyGHALyLiNUTaWqs'
};
