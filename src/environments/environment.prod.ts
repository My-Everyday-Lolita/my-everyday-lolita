export const environment = {
  production: true,
  theme: 'sweet',
  domains: (window as any).env.domains,
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
