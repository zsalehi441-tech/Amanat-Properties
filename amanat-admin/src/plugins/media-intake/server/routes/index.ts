export default {
    'admin': {
        type: 'admin',
        routes: [
            {
                method: 'POST',
                path: '/property',
                handler: 'mediaIntake.uploadProperty',
                config: {
                    policies: [],
                },
            },
            {
                method: 'POST',
                path: '/document',
                handler: 'mediaIntake.uploadDocument',
                config: {
                    policies: [],
                },
            },
            {
                method: 'GET',
                path: '/ping',
                handler: 'mediaIntake.ping',
                config: {
                    auth: false,
                },
            },
        ],
    },
};
