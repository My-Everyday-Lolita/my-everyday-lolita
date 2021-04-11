// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  theme: 'sweet',
  domains: {
    registration: 'http://192.168.1.22:3000',
    login: 'http://192.168.1.22:8080',
    mel: 'http://192.168.1.22:3001',
  },
  links: (window as any).env.links,
  api: {
    auth: {
      realm: 'my-everyday-lolita-realm',
      client_id: 'web-lolita',
      grant_type: 'password',
      scope: 'openid',
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
