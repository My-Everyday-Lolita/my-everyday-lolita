(function (window) {
  let domains = {
    registration: '${REGISTRATION_DOMAIN}',
    login: '${KEYCLOAK_DOMAIN}',
    mel: '${API_DOMAIN}',
  };
  window["env"] = window["env"] || {
    domains
  };

})(this);
