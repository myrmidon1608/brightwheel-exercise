let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../app');

chai.use(chaiHttp);

let expect = chai.expect;

describe("Device service tests", function () {

    this.afterAll(() => {
        let repository = require('../repository/DeviceRepository');
        let validation = require('../services/DeviceValidationService');
        repository.clear();
        validation.clear();
    });

    it("call to list of devices returns an empty response", function (done) {
        chai.request(server)
            .get('/api/devices')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });

    it("call to a non-existent device returns an empty response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').that.is.empty;
                done();
            });
    });

    it("call to device count for a non-existent device returns an empty response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/count')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').that.is.empty;
                done();
            });
    });

    it("call to device latest for a non-existent device returns an empty response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/latest')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').that.is.empty;
                done();
            });
    });

    it("attempt to find a device with malformed id throws an error", function (done) {
        chai.request(server)
            .get('/api/devices/invalid')
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Invalid id" });
                done();
            });
    });

    it("post to endpoint with valid id is successful", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "36d5658a-6908-479e-887e-a949ec199272",
                "readings": [
                    {
                        "timestamp": "2021-09-29T16:08:15+01:00",
                        "count": 2
                    },
                    {
                        "timestamp": "2021-09-29T16:09:15+01:00",
                        "count": 15
                    }
                ]
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "36d5658a-6908-479e-887e-a949ec199272",
                    count: 17,
                    latestReading: {
                        "timestamp": "2021-09-29T16:09:15+01:00",
                        "count": 15
                    },
                    readings: [
                        {
                            "timestamp": "2021-09-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-09-29T16:09:15+01:00",
                            "count": 15
                        }
                    ]
                });
                done();
            });
    });

    it("post to endpoint with invalid id throws an error", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "invalid",
                "readings": [
                    {
                        "timestamp": "2021-09-29T16:08:15+01:00",
                        "count": 2
                    },
                    {
                        "timestamp": "2021-09-29T16:09:15+01:00",
                        "count": 15
                    }
                ]
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Invalid id" });
                done();
            });
    });

    it("post to endpoint with no body throws an error", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send()
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Invalid request" });
                done();
            });
    });

    it("post to endpoint with no readings throws an error", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "36d5658a-6908-479e-887e-a949ec199272"
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Invalid readings" });
                done();
            });
    });

    it("post to endpoint with empty readings throws an error", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "36d5658a-6908-479e-887e-a949ec199272",
                readings: []
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Invalid readings" });
                done();
            });
    });

    it("post to endpoint with same request throws an error", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "36d5658a-6908-479e-887e-a949ec199272",
                "readings": [
                    {
                        "timestamp": "2021-09-29T16:08:15+01:00",
                        "count": 2
                    },
                    {
                        "timestamp": "2021-09-29T16:09:15+01:00",
                        "count": 15
                    }
                ]
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.be.an('object').and.to.eql({ error: "Duplicate request" });
                done();
            });
    });

    it("call to list of devices returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('array').and.to.eql([
                    {
                        id: "36d5658a-6908-479e-887e-a949ec199272",
                        count: 17,
                        latestReading: {
                            "timestamp": "2021-09-29T16:09:15+01:00",
                            "count": 15
                        },
                        readings: [
                            {
                                "timestamp": "2021-09-29T16:08:15+01:00",
                                "count": 2
                            },
                            {
                                "timestamp": "2021-09-29T16:09:15+01:00",
                                "count": 15
                            }
                        ]
                    }
                ]);
                done();
            });
    });

    it("call to device returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "36d5658a-6908-479e-887e-a949ec199272",
                    count: 17,
                    latestReading: {
                        "timestamp": "2021-09-29T16:09:15+01:00",
                        "count": 15
                    },
                    readings: [
                        {
                            "timestamp": "2021-09-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-09-29T16:09:15+01:00",
                            "count": 15
                        }
                    ]
                });
                done();
            });
    });

    it("call to device count returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/count')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({ count: 17 });
                done();
            });
    });

    it("call to device latest returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/latest')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    "timestamp": "2021-09-29T16:09:15+01:00",
                    "count": 15
                });
                done();
            });
    });

    it("post to endpoint with same valid id is successful", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "36d5658a-6908-479e-887e-a949ec199272",
                "readings": [
                    {
                        "timestamp": "2021-11-29T16:08:15+01:00",
                        "count": 3
                    },
                    {
                        "timestamp": "2021-10-29T16:09:15+01:00",
                        "count": 12
                    }
                ]
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "36d5658a-6908-479e-887e-a949ec199272",
                    count: 32,
                    latestReading: {
                        "timestamp": "2021-11-29T16:08:15+01:00",
                        "count": 3
                    },
                    readings: [
                        {
                            "timestamp": "2021-11-29T16:08:15+01:00",
                            "count": 3
                        },
                        {
                            "timestamp": "2021-10-29T16:09:15+01:00",
                            "count": 12
                        },
                        {
                            "timestamp": "2021-09-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-09-29T16:09:15+01:00",
                            "count": 15
                        }
                    ]
                });
                done();
            });
    });

    it("call to device returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "36d5658a-6908-479e-887e-a949ec199272",
                    count: 32,
                    latestReading: {
                        "timestamp": "2021-11-29T16:08:15+01:00",
                        "count": 3
                    },
                    readings: [
                        {
                            "timestamp": "2021-11-29T16:08:15+01:00",
                            "count": 3
                        },
                        {
                            "timestamp": "2021-10-29T16:09:15+01:00",
                            "count": 12
                        },
                        {
                            "timestamp": "2021-09-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-09-29T16:09:15+01:00",
                            "count": 15
                        }
                    ]
                });
                done();
            });
    });

    it("call to device count returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/count')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({ count: 32 });
                done();
            });
    });

    it("call to device latest returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/36d5658a-6908-479e-887e-a949ec199272/latest')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    "timestamp": "2021-11-29T16:08:15+01:00",
                    "count": 3
                });
                done();
            });
    });

    it("post to endpoint with new valid id is successful", function (done) {
        chai.request(server)
            .post('/api/devices')
            .set('content-type', 'application/json')
            .send({
                "id": "45d5658b-6908-479e-887d-a656ec199213",
                "readings": [
                    {
                        "timestamp": "2021-02-29T16:08:15+01:00",
                        "count": 2
                    },
                    {
                        "timestamp": "2021-03-29T16:09:15+01:00",
                        "count": 14
                    }
                ]
            })
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "45d5658b-6908-479e-887d-a656ec199213",
                    count: 16,
                    latestReading: {
                        "timestamp": "2021-03-29T16:09:15+01:00",
                        "count": 14
                    },
                    readings: [
                        {
                            "timestamp": "2021-02-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-03-29T16:09:15+01:00",
                            "count": 14
                        }
                    ]
                });
                done();
            });
    });

    it("call to new device returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/45d5658b-6908-479e-887d-a656ec199213')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    id: "45d5658b-6908-479e-887d-a656ec199213",
                    count: 16,
                    latestReading: {
                        "timestamp": "2021-03-29T16:09:15+01:00",
                        "count": 14
                    },
                    readings: [
                        {
                            "timestamp": "2021-02-29T16:08:15+01:00",
                            "count": 2
                        },
                        {
                            "timestamp": "2021-03-29T16:09:15+01:00",
                            "count": 14
                        }
                    ]
                });
                done();
            });
    });

    it("call to new device count returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/45d5658b-6908-479e-887d-a656ec199213/count')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({ count: 16 });
                done();
            });
    });

    it("call to new device latest returns an updated response", function (done) {
        chai.request(server)
            .get('/api/devices/45d5658b-6908-479e-887d-a656ec199213/latest')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('object').and.to.eql({
                    "timestamp": "2021-03-29T16:09:15+01:00",
                    "count": 14
                });
                done();
            });
    });
    
    it("call to list of devices returns both added devices", function (done) {
        chai.request(server)
            .get('/api/devices')
            .end((err, response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.an('array').and.to.eql([
                    {
                        id: "36d5658a-6908-479e-887e-a949ec199272",
                        count: 32,
                        latestReading: {
                            "timestamp": "2021-11-29T16:08:15+01:00",
                            "count": 3
                        },
                        readings: [
                            {
                                "timestamp": "2021-11-29T16:08:15+01:00",
                                "count": 3
                            },
                            {
                                "timestamp": "2021-10-29T16:09:15+01:00",
                                "count": 12
                            },
                            {
                                "timestamp": "2021-09-29T16:08:15+01:00",
                                "count": 2
                            },
                            {
                                "timestamp": "2021-09-29T16:09:15+01:00",
                                "count": 15
                            }
                        ]
                    },
                    {
                        id: "45d5658b-6908-479e-887d-a656ec199213",
                        count: 16,
                        latestReading: {
                            "timestamp": "2021-03-29T16:09:15+01:00",
                            "count": 14
                        },
                        readings: [
                            {
                                "timestamp": "2021-02-29T16:08:15+01:00",
                                "count": 2
                            },
                            {
                                "timestamp": "2021-03-29T16:09:15+01:00",
                                "count": 14
                            }
                        ]
                    }
                ]);
                done();
            });
    });
});