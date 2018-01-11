const pg = require('./index.js').pg;

const newUserSignup = function(signupData, startingAmount) {
  console.log('signing up user:', signupData);
  let userId = undefined;
  let errorReason = undefined;
  return pg.transaction(userInsert => {
    return pg.table('users')
      .transacting(userInsert)
      .returning('id')
      .insert({
        username: signupData.username,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        // TODO: hash password upon insertion
        password: signupData.password,
        phone: signupData.phone,
        email: signupData.email,
        avatar_url: signupData.avatarUrl ? signupData.avatarUrl : null
      })
      .then(id => {
        console.log('signup returned id[0]:', id[0]);
        userId = id[0];
      })
      .then(userInsert.commit, err => {
        console.error('rollback new user insert for error:', err);
        if(err.constraint.includes('email')) {
          errorReason = 'email';
        } else if(err.constraint.includes('user')) {
          errorReason = 'user';
        } else if(err.constraint.includes('phone')) {
          errorReason = 'phone';
        } else {
          errorReason = 'some other reason...';
        }
        userInsert.rollback();
        console.error('rejecting...');
        reject(errorReason);
      })
      .then(() => {
        pg.transaction(balanceInsert => {
          return pg.table('balance')
            .transacting(balanceInsert)
            .insert({
              user_id: userId,
              amount: startingAmount
            })
          })
          .then(balanceInsert.commit, err => {
            console.error('rollback new balance insert for error:', err);
            balanceInsert.rollback();
            throw err;
          })
      })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      resolve(userId);
    })
  })
}

module.exports = {
  newUserSignup: newUserSignup
}