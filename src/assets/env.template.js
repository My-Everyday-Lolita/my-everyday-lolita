(function (window) {
  let domains = {
    registration: '${REGISTRATION_DOMAIN}',
    login: '${KEYCLOAK_DOMAIN}',
    mel: '${API_DOMAIN}',
  };
  let links = {
    patreon: '${PATREON_URL}',
    rockuu: {
      youtube: '${YOUTUBE_URL}',
      youtubeLolita: '${YOUTUBE_LOLITA_URL}',
      instagram: '${INSTAGRAM_URL}',
      facebook: '${FACEBOOK_URL}'
    }
  };
  window["env"] = window["env"] || {
    domains,
    links
  };

})(this);
