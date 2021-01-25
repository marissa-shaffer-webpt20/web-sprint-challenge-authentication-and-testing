const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('./auth/auth-middleware');
const authRouter = require('./auth/auth-router');
const jokesRouter = require('./jokes/jokes-router');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, checkRole('user'), jokesRouter);

server.get("/", (req, res) => {
    res.send("Sprint code for AH");
});

module.exports = server;

function checkRole(user) {
    return (req, res, next) => {
        if (
            req.decodedToken &&
            req.decodedToken.role &&
            req.decodedToken.role.toLowerCase() === user
        ) {
            next()
        } else {
            res.status(403).json({ message: 'Must be logged in' })
        }
    }
}
