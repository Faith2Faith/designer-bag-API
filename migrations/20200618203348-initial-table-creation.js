

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.createTable('abouts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.STRING },
      batchSize: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: Sequelize.DATE },
    })

    await queryInterface.createTable('tags', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tag: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: Sequelize.DATE },
    })

    await queryInterface.createTable('Bags', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      aboutId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'abouts', key: 'id' } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: Sequelize.DATE },
    })

    return queryInterface.createTable('BagsTags', {
      cookieId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'Bags', key: 'id' } },
      tagsId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'tags', key: 'id' } },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: Sequelize.DATE },
    })
  },

  down: async (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('BagsTags')
    await queryInterface.dropTable('Bags')
    await queryInterface.dropTable('tags')

    return queryInterface.dropTable('abouts')
  }
}
