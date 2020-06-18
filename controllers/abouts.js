const models = require('../models')

const aboutBagsBySize = async (request, response) => {
  try {
    const { Size } = request.params

    const BagsSize = await models.abouts.findAll({
      where: { Size }
    })

    return BagsSize
      ? response.send(BagsSize)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve Bags by Size.')
  }
}

const aboutBagsByType = async (request, response) => {
  try {
    const { type } = request.params

    const BagsByType = await models.abouts.findAll({
      where: { type }
    })

    return BagsByType
      ? response.send(BagsByType)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve Bags by type.')
  }
}

module.exports = { aboutBagsBySize, aboutBagsByType }
