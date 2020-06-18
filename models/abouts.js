
const abouts = (connection, Sequelize) => {
  return connection.define('abouts', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: Sequelize.STRING },
    batchSize: { type: Sequelize.STRING }
  }, { paranoid: true })
}

module.exports = abouts
