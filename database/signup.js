const pg = require('./index.js').pg;

const newUserSignup = function(signupData, startingAmount) {
  console.log('hopefully connected to:', process.env.DATABASE_URL);
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
    .then(userInsert.commit)
  })
  .then(() => {
    return pg.transaction(balanceInsert => {
      return pg.table('balance')
      .transacting(balanceInsert)
      .insert({
        user_id: userId,
        amount: startingAmount
      })
      .then(balanceInsert.commit)
    })
  })
  .then(() => {
    return userId;
  })
}

module.exports = {
  newUserSignup: newUserSignup
}