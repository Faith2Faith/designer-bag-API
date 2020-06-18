const Sequelize = require('sequelize')
const aboutsModel = require('./abouts')
const BagsModel = require('./Bags')
const BagsTagsModel = require('./BagsTags')
const tagsModel = require('./tags')

const connection = new Sequelize('BagsApi', 'Bags', 'C0ok!#$', {
  host: 'localhost', dialect: 'mysql'
})

const abouts = aboutsModel(connection, Sequelize)
const Bags = BagsModel(connection, Sequelize)
const BagsTags = BagsTagsModel(connection, Sequelize)
const tags = tagsModel(connection, Sequelize)

Bags.belongsToMany(tags, { through: 'BagsTags', foreignKey: 'cookieId' })
tags.belongsToMany(Bags, { through: 'BagsTags', foreignKey: 'tagsId' })

Bags.belongsTo(abouts)
abouts.hasMany(Bags)




module.exports = {
  Op: Sequelize.Op,
  abouts,
  Bags,
  BagsTags,
  tags,
}
