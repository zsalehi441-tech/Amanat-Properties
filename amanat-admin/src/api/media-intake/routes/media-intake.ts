export default {
    routes: [
        {
            method: 'POST',
            path: '/property',
            handler: 'media-intake.uploadProperty',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/document',
            handler: 'media-intake.uploadDocument',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/ping',
            handler: 'media-intake.ping',
            config: {
                auth: false,
            },
        },
    ],
};
