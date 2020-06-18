const models = require('../models')

const BagsPage = async (request, response) => {
  const api = await models.Bags.findAll()

  return response.render('index', { api })
}

const getAllBags = async (request, response) => {
  try {
    const allBags = await models.Bags.findAll()

    return response.send(allBags)
  } catch (error) {
    return response.status(500).send('Unable to retrieve Bags, please try again')
  }
}

const saveNewBags = async (request, response) => {
  try {
    const {
      name, description, aboutId
    } = request.body

    if (!name || !description || !aboutId) {
      return response.status(400).send('Required information: name, description, type, size, and tags.')
    }

    const newBags = await models.Bags.create({
      name, description, aboutId
    })

    return response.status(201).send(newBags)
  } catch (error) {
    return response.status(500).send('Unknown error when creating new Bags')
  }
}

const getBagsByNameWithaboutId = async (request, response) => {
  try {
    const { name } = request.params

    const BagsByNameaboutId = await models.Bags.findOne({
      include: [{
        model: models.abouts
      }],
      where: { name }
    })

    return BagsByNameaboutId
      ? response.send(BagsByNameaboutId)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve Bags, please try again')
  }
}

const patchBagsByName = async (request, response) => {
  const { id } = request.params

  const { name } = request.body

  const nameUpdate = await models.Bags.findOne({ where: { id } })

  if (!nameUpdate) return response.status(404).send('Unknown name')

  if (name) { await models.Bags.update({ name: name }, { where: { id: id } }) }

  return response.status(201).send('Successfully patched the name item')
}

const deleteBagsByName = async (request, response) => {
  try {
    const { name } = request.params
    const Bags = await models.Bags.findOne({ where: { name } })

    if (!Bags) return response.status(404).send(`Unknown Bags with name: ${name}`)

    await models.Bags.destroy({ where: { name } })

    return response.send(`Successfully deleted the Bags with the name: ${name}`)
  } catch (error) {
    return response.status(500).send('Unable to delete Bags, please try again')
  }
}

module.exports = {
  BagsPage, getAllBags, saveNewBags, getBagsByNameWithaboutId, deleteBagsByName, patchBagsByName
}
