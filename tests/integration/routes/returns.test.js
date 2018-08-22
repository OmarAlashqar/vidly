const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const { User } = require('../../../models/user');
const { Rental } = require('../../../models/rental');
const { Movie } = require('../../../models/movie');
let server;
let rental;
let movie;
let customerId;
let movieId;

describe('/api/returns', () => {
    beforeEach(async () => {
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: 'movie1',
            dailyRentalRate: 2,
            genre: { name: 'genre1' },
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'customer1',
                phone: '123456'
            },
            movie: {
                _id: movieId,
                title: 'movie1',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        token = new User().genAuthToken();
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    describe('POST /', () => {

        const exec = () => {
            return request(server)
                .post('/api/returns')
                .set('x-auth-token', token)
                .send({ customerId, movieId });
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if customerId is not passed', async () => {
            customerId = undefined;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not passed', async () => {
            movieId = undefined;
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if no rental found for customer/movie', async () => {
            await Rental.remove({});
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if return is already processed', async () => {
            rental.dateReturned = new Date();
            await rental.save();
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
        });

        it('should set the returnDate if request is valid', async () => {
            await exec();
            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;
            
            expect(rentalInDb.dateReturned).toBeDefined();
            expect(diff).toBeLessThan(10);
        });

        it('should set the rentalFee if request is valid', async () => {
            rental.dateBooked = moment().add(-7, 'days').toDate();
            await rental.save();

            await exec();
            const rentalInDb = await Rental.findById(rental._id);
            
            expect(rentalInDb.rentalFee).toBe(2 * 7);
        });

        it('should increase the movie stock if request is valid', async () => {
            await exec();
            const movieInDb = await Movie.findById(movieId);
            
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return the rental if request is valid', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining([
                    'dateBooked', 'dateReturned', 'rentalFee', 'customer', 'movie'
                ])
            );
        });
    });
});