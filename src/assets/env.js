(function (window) {
  let domains = {
    registration: 'http://192.168.1.22:3000',
    login: 'http://192.168.1.22:8080',
    mel: 'http://192.168.1.22:3001',
  };
  let links = {
    patreon: 'https://www.patreon.com/BittersweetRockuu',
    rockuu: {
      youtube: 'https://www.youtube.com/channel/UCjfM56pJDJi2ZcAdipvm6zA',
      youtubeLolita: 'https://www.youtube.com/channel/UCGO6htDbOylZVtR6SmPnL-w',
      instagram: 'https://www.instagram.com/bittersweet.rockuu/',
      facebook: 'https://www.facebook.com/Bittersweet.Rockuu'
    }
  };
  window["env"] = window["env"] || {
    domains,
    links
  };

})(this);
