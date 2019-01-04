/**
 * @Author: alassane
 * @Date:   2018-12-11T00:59:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-11T01:41:38+01:00
 */

// example url google : https://drive.google.com/open?id=1mHQl0a1PrHcWRvrBVcUP4yOxOaq49lRQ
// 'open' must be replaced by 'uc'
// and add '&authuser=0&export=download'

// example url dropbox : https://www.dropbox.com/s/g170nxr6yva81gv/percussions.mp3?dl=0
// 'dl=0' must be replaced by 'raw=1'

class Music {

  static getDownloadLink(url = null, callback) {
    if (url.includes('https://drive.google.com/open'))
      Music.parseGoogleLink(url, callback);

    else if (url.includes('https://www.dropbox.com'))
      Music.parseDropboxLink(url, callback);

    // all avalaible url

    else if (callback) // at the end
      callback(url);
  }

  static parseGoogleLink(url = null, callback) {
    let link = url.replace('/open?', '/uc?');
    link += '&authuser=0&export=download';

    if (callback)
      callback(link);
  }

  static parseDropboxLink(url = null, callback) {
    let link = url.replace('dl=0', 'raw=1');

    if (callback)
      callback(link);
  }

}

module.exports = {
  Music
};
