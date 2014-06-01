var assert = require("assert")
var expect = require('expect.js'),
Browser = require('zombie'),
browser = new Browser();


describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

// describe('Loads pages', function(){

//     it('Google.com', function(done){

//         browser.visit("http://www.google.com.hk", function () {
//             expect(browser.text("title")).to.equal('google');
//             done();
//         });
//     });

// });
/*
var Sails = require('sails');
var sinon = require('sinon'); // Mocking/stubbing/spying
var assert = require('chai').assert; // Assertions
var nock = require('nock'); // HTTP Request Mocking
var constants = require('../constants/externalSystemsConstants');
var Battlefield4Service = require('./battlefield4Service');

describe('External Services', function () {

    // create a variable to hold the instantiated sails server
    var app, battlefield4Service;

    // Global before hook
    before(function (done) {

        // Lift Sails and start the server
        Sails.lift({

            log: {
                level: 'error'
            }

        }, function (err, sails) {
            app = sails;
            done(err, sails);
        });
    });

    // Global after hook
    after(function (done) {
        app.lower(done);
    });

    describe('Battlefield 4 Service', function () {
        var userName, platform, kills, skill, deaths, killAssists, shotsHit, shotsFired;

        before(function () {

            // Mock data points
            userName = 'dummyUser';
            platform = 'ps3';
            kills = 200;
            skill = 300;
            deaths = 220;
            killAssists = 300;
            shotsHit = 2346;
            shotsFired = 7800;

            var mockReturnJson = {
                player: {
                    name: userName,
                    plat: platform
                },
                stats: {
                    kills: kills,
                    skill: skill,
                    deaths: deaths,
                    killAssists: killAssists,
                    shotsHit: shotsHit,
                    shotsFired: shotsFired
                }
            };

            // Mock response from BF4 API
            battlefield4Service = nock('http://' + constants.BF4_SERVICE_URI_HOST)
                .get(constants.BF4_SERVICE_URI_PATH.replace('[platform]', platform).replace('[name]', userName))
                .reply(200, mockReturnJson);
        });

        it('Should translate BF4 API data to FPSStatsDTO', function (done) {
            var service = new Battlefield4Service();
            service.getPlayerInfo(userName, platform, function (fpsStats) {
                assert(fpsStats !== null);
                assert(fpsStats !== undefined);
                assert(fpsStats.kills === kills, 'kills');
                assert(fpsStats.deaths === deaths, 'deaths');
                assert(fpsStats.killAssists === killAssists, 'deaths')
                assert(fpsStats.kdr === kills / deaths, 'kdr');
                assert(fpsStats.shotsFired === shotsFired, 'shotsFired');
                assert(fpsStats.shotsHit === shotsHit, 'shotsHit');
                assert(fpsStats.shotsAccuracy === shotsHit / shotsFired, 'shotsAccuracy');
                assert(fpsStats.userName === userName, 'userName');
                assert(fpsStats.platform === platform, 'platform');
                done();
            });
        });
    });
});
*/