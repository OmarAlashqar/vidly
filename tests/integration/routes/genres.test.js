const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../../index') });
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre given a valid id', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 for an invalid id', async () => {
            const res = await request(server).get(`/api/genres/1`);

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().genAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 1 character', async () => {      
            name = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is greater than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {

        let token;
        let name;
        let id;
        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().genAuthToken();
            name = 'genre1';
            id = new mongoose.Types.ObjectId().toHexString();
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 'a';
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid genre is passed', async () => {
            name = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre with given id is not found', async () => {
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return the updated genre if it is valid', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre._id;
            name = genre.name;

            const res = await exec();

            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /:id', () => {

        let token;
        let id;
        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(() => {
            token = new User({ isAdmin: true }).genAuthToken();
            id = new mongoose.Types.ObjectId().toHexString();
        });

        it('should return 404 if invalid id is passed', async () => {
            id = 'a';
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not admin', async () => {
            token = new User().genAuthToken();
            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if no genre with given id exists', async () => {
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return the genre if it is valid', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            id = genre._id;

            const res = await exec();

            expect(res.status).toBe(200);
        });
    });
});