// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   firebase: {
//     apiKey:             'AIzaSyBVvvDqq8QBaRmbVhVnJrUbw4EdKeSD7Gw',
//     authDomain:         'app-3dhomes-prod.firebaseapp.com',
//     databaseURL:        'https://app-3dhomes-prod.firebaseio.com',
//     projectId:          'app-3dhomes-prod',
//     storageBucket:      'app-3dhomes-prod.appspot.com',
//     messagingSenderId:  '938975470837',
//     cloudFunctionsUrl:  'https://us-central1-app-3dhomes-prod.cloudfunctions.net'
//   },
//   mangoPay: {
//     url: 'https://api.mangopay.com',
//     clientId: 'succeedprod'
//   },
//   zoomToShowPrice: 9,
//   mailToContactUs: 'info@coachhub.me',
//   gcpApiKey: 'AIzaSyD9pJdqNNJzNMBL5SVVyGHALyLiNUTaWqs'
// };
export const environment = {
  production: false,
  paymentMethod: { paypal: true },
  firebase: {
    apiKey:             'AIzaSyAw0iqC2gTa7tC9u4jVagIfzetSN1RBu4Q',
    authDomain:         'app-3dhomes-int.firebaseapp.com',
    databaseURL:        'https://app-3dhomes-int.firebaseio.com',
    projectId:          'app-3dhomes-int',
    storageBucket:      'app-3dhomes-int.appspot.com',
    messagingSenderId:  '10937372111',
    cloudFunctionsUrl:  'https://us-central1-app-3dhomes-int.cloudfunctions.net'
  },
  mangoPay: {
    url: 'https://api.sandbox.mangopay.com',
    clientId: 'suceed'
  },
  paypal: {
    client_id: "AW6RAPsLvAfGf-dL_mrL9iQdxr8-ObIy_7VOwRkSZm1Va6q1yBdeBM7JMArAOrMDPBPdl2ie0hj-WkVf"
  },
  zoomToShowPrice: 10,
  mailToContactUs: 'info@coachhub.me',
  gcpApiKey: 'AIzaSyCZZux7VgMu54CxWTVabEVVurQwiOm0H4E'
};

