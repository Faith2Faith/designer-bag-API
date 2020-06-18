const BagsTags = (connection, Sequelize, Bags, tags) => {
  return connection.define('BagsTags', {
    cookieId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: Bags, key: 'id' } },
    tagsId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: tags, key: 'id' } }
  }, { paranoid: true })
}

module.exports = BagsTags
