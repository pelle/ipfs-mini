const assert = require('chai').assert;
const IPFS = require('../index.js');

describe('ipfs-mini', () => {
  describe('constructor', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });
      assert.equal(typeof ipfs.provider, 'object');
      assert.throws(() => IPFS({}), Error); // eslint-disable-line
      done();
    });
  });

  describe('setProvider', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS();

      ipfs.setProvider({ host: 'something', port: 2001 });

      assert.equal(typeof ipfs.provider, 'object');
      assert.equal(ipfs.provider.host, 'something');
      assert.equal(ipfs.provider.port, 2001);
      assert.equal(ipfs.provider.protocol, 'http');
      assert.equal(ipfs.provider.base, '/api/v0');

      ipfs.setProvider({ host: 'something', protocol: 'https' });

      assert.equal(ipfs.provider.host, 'something');
      assert.equal(ipfs.provider.port, 5001);
      assert.equal(ipfs.provider.protocol, 'https');
      assert.equal(ipfs.provider.base, '/api/v0');

      done();
    });

    it('should throw when invalid', () => {
      const ipfs = new IPFS();

      assert.throws(() => ipfs.setProvider(2342353535), Error);
    });
  });

  describe('sendAsync', () => {
    it('should handle no callback', () => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: '',
        uri: '/cat/QmbhrsdhbvQy3RyNiDdStgF4YRVc4arteS3wL5ES5M6cVd',
        accept: 'application/json' });
    });

    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: '',
        uri: '/cat/QmbhrsdhbvQy3RyNiDdStgF4YRVc4arteS3wL5ES5M6cVd',
        accept: 'application/json' }, (err, result) => {
        assert.equal(err, null);
        assert.equal(typeof result, 'string');

        done();
      });
    });

    it('handle invalid request', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'http' });

      ipfs.sendAsync({ payload: '',
        uri: '/cat/Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck',
        accept: 'application/json' }, (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });

    it('handle invalid JSON parse', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: '',
        uri: '/cat/Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck',
        accept: 'application/json', jsonParse: true }, (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });

    it('handle invalid payload', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: ipfs.sendAsync,
        uri: '/cat/Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck',
        accept: 'application/json' }, (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });

    it('handle invalid payload with Null', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: null,
        uri: '/add',
        accept: 'application/json' }, (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });

    it('handle invalid payload with add', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.sendAsync({ payload: 'Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck',
        uri: '/add',
        accept: 'application/json' }, (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });
  });

  describe('add', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      const testVal = 'hello world!';

      ipfs.add(testVal, (err, ipfsHash) => {
        assert.equal(err, null);
        assert.equal(typeof ipfsHash, 'string');

        ipfs.cat(ipfsHash, (catError, catResult) => {
          assert.equal(catError, null);
          assert.equal(typeof catResult, 'string');
          assert.equal(catResult, testVal);

          done();
        });
      });
    });

    it('should add a JPEG buffer', (done) => {
      const jpgBuffer = new Buffer('ffd8ffe000104a46494600010101006000600000ffe1001645786966000049492a0008000000000000000000ffdb00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ffdb00430101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101ffc00011080001000103012200021101031101ffc400150001010000000000000000000000000000000affc40014100100000000000000000000000000000000ffc40014010100000000000000000000000000000000ffc40014110100000000000000000000000000000000ffda000c03010002110311003f00bf8001ffd9', 'hex');
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.add(jpgBuffer, (addError, ipfsHash) => {
        assert.equal(addError, null);
        assert.equal(typeof ipfsHash, 'string');

        done();
      });
    });
  });

  describe('stat', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      const testVal = { hello: 'world!!!' };

      ipfs.addJSON(testVal, (err, ipfsHash) => {
        assert.equal(err, null);
        assert.equal(typeof ipfsHash, 'string');

        ipfs.catJSON(ipfsHash, (catError, catResult) => {
          assert.equal(catError, null);
          assert.equal(typeof catResult, 'object');
          assert.deepEqual(catResult, testVal);

          ipfs.stat(ipfsHash, (statError, statResult) => {
            assert.equal(statError, null);
            assert.equal(typeof statResult, 'object');

            done();
          });
        });
      });
    });
  });

  describe('addJSON', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      const testVal = { hello: 'world!!!' };

      ipfs.addJSON(testVal, (err, ipfsHash) => {
        assert.equal(err, null);
        assert.equal(typeof ipfsHash, 'string');

        ipfs.catJSON(ipfsHash, (catError, catResult) => {
          assert.equal(catError, null);
          assert.equal(typeof catResult, 'object');
          assert.deepEqual(catResult, testVal);

          done();
        });
      });
    });
  });

  describe('cat', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.cat('QmbhrsdhbvQy3RyNiDdStgF4YRVc4arteS3wL5ES5M6cVd', (err, result) => {
        assert.equal(err, null);
        assert.equal(typeof result, 'string');

        done();
      });
    });
  });

  describe('catJSON', () => {
    it('should function normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.catJSON('QmbhrsdhbvQy3RyNiDdStgF4YRVc4arteS3wL5ES5M6cVd', (err, result) => {
        assert.equal(err, null);
        assert.equal(typeof result, 'object');

        done();
      });
    });

    it('should handle invalid data call', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'http' });

      ipfs.catJSON('Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck', (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });

    it('should handle invalid JSON data normally', (done) => {
      const ipfs = new IPFS({ host: 'ipfs.infura.io', protocol: 'https' });

      ipfs.catJSON('Qma2uQEvt39zhpdT1fRC3UzS48RXPRPKaPyVoyEqwZADck', (err, result) => {
        assert.equal(typeof err, 'object');
        assert.equal(result, null);

        done();
      });
    });
  });
});
