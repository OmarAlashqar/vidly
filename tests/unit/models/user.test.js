const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'secret123';

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(payload);
        const token = user.genAuthToken();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        expect(decoded).toMatchObject(payload);
    });
});