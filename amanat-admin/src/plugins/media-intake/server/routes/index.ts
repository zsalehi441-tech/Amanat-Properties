export default [
    {
        method: 'POST',
        path: '/property',
        handler: 'mediaIntake.uploadProperty',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'POST',
        path: '/document',
        handler: 'mediaIntake.uploadDocument',
        config: {
            policies: [],
            auth: false,
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
];

