// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
    cloudFunctionsUrl:  'http://localhost:5001/app-3dhomes-int/us-central1'
  },
  mangoPay: {
    url: 'https://api.mangopay.com',
    clientId: 'succeedprod'
  },
  paypal: {
    client_id: "AYbq8tIvOV3o3xc4GFxM9H6gbTkpBpveKweOh_E0_ETWbjt0G6TtE0mFwiaW6IuMqRRSkDNKqCDMzV5s"
  },
  zoomToShowPrice: 9,
  mailToContactUs: 'info@coachhub.me',
  gcpApiKey: 'AIzaSyD9pJdqNNJzNMBL5SVVyGHALyLiNUTaWqs'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
