const pg = require('./index.js').pg;

module.exports = {
  loginOrCreate: (user) => {
    let username = user.email.split('@')[0];
    let formattedUser = {id: user.sub, username: username, first_name: user.given_name, last_name: user.family_name, email: user.email, avatar_url: user.picture, amount:100};
    return pg.raw(
      `INSERT INTO USERS (id, username, first_name, last_name, email, avatar_url)
      VALUES (:id, :username, :first_name, :last_name, :email, :avatar_url)
      ON CONFLICT (id) DO NOTHING
      returning *`, 
      formattedUser
    )
      .then(() => {
        return pg.raw(
          `INSERT INTO BALANCE (user_id, amount)
          VALUES (:id, :amount)
          ON CONFLICT (user_id) DO NOTHING
          returning *`,
          formattedUser
        )
    })
  }

}
