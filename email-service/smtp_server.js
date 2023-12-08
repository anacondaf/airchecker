'use strict';

const config = require('./config.json');
const SMTPServer = require('smtp-server').SMTPServer;
const logger = require("./logger");

const server = new SMTPServer({

    // log to console
    logger: true,

    // not required but nice-to-have
    banner: 'AirChecker SMTP Server',

    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ['STARTTLS'],

    // Accept messages up to 50 MB. This is a soft limit
    size: 50 * 1024 * 1024,

    // Setup authentication
    // Allow all usernames and passwords, no account checking
    onAuth(auth, session, callback) {
        return callback(null, {
            user: {
                username: auth.username
            }
        });
    },

    // Handle message stream
    onData(stream, session, callback) {
        console.log('Streaming message from user %s', session.user.username);
        console.log('------------------');
        stream.pipe(process.stdout);
        stream.on('end', () => {
            console.log(''); // ensure linebreak after the message
            callback(null, 'Message queued as ' + Date.now()); // accept the message once the stream is ended
        });
    }
});

server.on('error', err => {
    console.log('Error occurred');
    console.log(err);
});

server.listen(config.server.port, config.server.host, () => {
    logger.info(`SMTP serves at ${config.server.host}:${config.server.port}`)
});