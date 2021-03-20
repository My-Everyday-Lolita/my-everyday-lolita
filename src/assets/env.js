(function (window) {
  let domains = {
    registration: 'http://192.168.1.22:3000',
    login: 'http://192.168.1.22:8080',
    mel: 'http://192.168.1.22:3001',
  };
  window["env"] = window["env"] || {
    domains
  };

})(this);
