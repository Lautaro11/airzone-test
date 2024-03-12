import request from 'supertest';
import app from '../../app.js';
import assert from 'assert';

describe('Endpoint /getWeather', () => {
  it('Debería devolver datos climaticos para una ubicacion valida', (done) => {
    request(app)
      .get('/weather?lat=12.345&lon=67.890')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(typeof res.body, 'object');

        assert.strictEqual(res.body.hasOwnProperty('hourly'), true);

        assert.strictEqual(Array.isArray(res.body.hourly), true);
        assert.strictEqual(res.body.hourly.length > 0, true);

        assert.strictEqual(res.body.hasOwnProperty('daily'), true);

        assert.strictEqual(Array.isArray(res.body.daily), true);
        assert.strictEqual(res.body.daily.length > 0, true);

        done();
      });
  });

  it('Deberia manejar errores para ubicacion invalida', (done) => {
    request(app)
      .get('/weather?lat=333&lon=555')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(typeof res.body, 'object');

        assert.strictEqual(res.body.hasOwnProperty('message'), true);

        done();
      });
  });
});
