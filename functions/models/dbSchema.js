//! The schema is not really used in our project, it's just a reference of our DB structure fields

let db = {
    users: [
        {
            userId: 'fasdf1231asdfasdf',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2020-06-13T20:31:03.281Z',
            imageUrl: 'image/fasdfasdfa/asdfasdfa',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Toronto, ON',
        },
    ],
    scream: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-06-13T20:31:03.281Z',
            likeCount: 5,
            commentCount: 2,
        },
    ],
};

let userDetails = {
    // Redux data
    credentials: [
        {
            userId: 'fasdf1231asdfasdf',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2020-06-13T20:31:03.281Z',
            imageUrl: 'image/fasdfasdfa/asdfasdfa',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Toronto, ON',
        },
    ],
    likes: [
        {
            userHandle: 'user',
            screamId: 'asdfasdfasdfasdfasdfad',
        },
        {
            userHandle: 'user',
            screamId: 'fasdfasdfasdfasdfasdfd',
        },
    ],
};
