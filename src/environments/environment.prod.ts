export const environment = {
  production: true,
  theme: 'sweet',
  domains: {
    registration: 'http://192.168.1.22:3000',
    login: 'http://192.168.1.22:8080',
    mel: 'http://192.168.1.22:3001',
  },
  api: {
    auth: {
      realm: 'my-everyday-lolita-realm',
      client_id: 'web-lolita',
      grant_type: 'password',
      scope: 'openid',
    }
  }
};
