const pg = require('./index.js').pg;

const newUserSignup = function(signupData, startingAmount) {
  let userId = undefined;
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
      userId = id[0];
      return userId;
    })
    .then(id => {
      return pg.table('balance')
      .transacting(userInsert)
      .insert({
        user_id: id,
        amount: startingAmount
      })
    })
    .then(userInsert.commit)
  })
  .then(() => {
    return userId;
  })
}

module.exports = {
  newUserSignup: newUserSignup
}