const sampleFeed = [
  {
    transactionId: 123,
    amount: 12.45,
    timestamp: '2017-102 T 10:15 UTC',
    note: '🍴 Dinner Plans!',
    payee: {
      userId: 1234,
      username: 'sarah-jacobs',
      fullName: 'Sarah Jacobs',
      firstName: 'Sarah',
      lastName: 'Jacobs'
    },
    payer: {
      userId: 1435,
      displayName: 'Daniel Rimmings',
      username: 'daniel-dog',
      fullName: 'Daniel Rimmings',
      firstName: 'Daniel',
      lastName: 'Rimmings',
      avatar_url: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
    }
  },
  {
    transactionId: 124,
    amount: 80.99,
    timestamp: '2017-082 T 10:15 UTC',
    note: '🏡 Rent due',
    payee: {
      userId: '1435',
      displayName: 'Daniel Rimmings',
      username: 'daniel-dog',
      fullName: 'Daniel Rimmings',
      firstName: 'Daniel',
      lastName: 'Rimmings'
    },
    payer: {
      userId: '1234',
      username: 'sarah-jacobs',
      fullName: 'Sarah Jacobs',
      firstName: 'Sarah',
      lastName: 'Jacobs',
      avatar_url: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/45.png'
    }
  }
];

module.exports.sampleFeed = sampleFeed;
