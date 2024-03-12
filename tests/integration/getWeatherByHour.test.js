import request from 'supertest';
import app from '../../app.js';
import assert from 'assert';

describe('Endpoint /getWeatherByHour', () => {
  it('Debería devolver datos climaticos para una hora exacta', (done) => {
    request(app)
      .get('/weather/hour?lat=12.345&lon=67.890&hour=21:00')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        console.log(process.env.NODE_ENV);
        assert.strictEqual(typeof res.body, 'object');

        assert.strictEqual(res.body.hasOwnProperty('lat'), true);
        assert.strictEqual(res.body.hasOwnProperty('lon'), true);
        assert.strictEqual(res.body.hasOwnProperty('hourly'), true);
        assert.strictEqual(res.body.hasOwnProperty('searchedAt'), true);

        assert.strictEqual(Array.isArray(res.body.hourly), true);
        assert.strictEqual(res.body.hourly.length > 0, true);

        done();
      });
  });

  it('Debería devolver datos para una hora exacta', (done) => {
    request(app)
      .get('/weather/hour?lat=12.345&lon=67.890&hour=21')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(typeof res.body, 'object');

        assert.strictEqual(res.body.hasOwnProperty('lat'), true);
        assert.strictEqual(res.body.hasOwnProperty('lon'), true);
        assert.strictEqual(res.body.hasOwnProperty('hourly'), true);
        assert.strictEqual(res.body.hasOwnProperty('searchedAt'), true);

        assert.strictEqual(Array.isArray(res.body.hourly), true);
        assert.strictEqual(res.body.hourly.length > 0, true);

        done();
      });
  });



  it('Debería manejar errores para hora invalida', (done) => {
    request(app)
      .get('/weather/hour?lat=12.345&lon=67.890&hour=99:00')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(typeof res.body, 'object');

        assert.strictEqual(res.body.hasOwnProperty('message'), true);

        done();
      });
  });
});
