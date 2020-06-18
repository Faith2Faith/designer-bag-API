const models = require('../models')

const getBagsByTags = async (request, response) => {
  try {
    const { tag } = request.params

    const BagsByTag = await models.tags.findAll({
      include: [{
        model: models.Bags
      }],
      where: { tag },
    })

    return BagsByTag
      ? response.send(BagsByTag)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve Bag by tag, please try again.')
  }
}

module.exports = { getBagsByTags }
