/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { afterEach, beforeEach, describe, it } = require('mocha')
const { BagsList, singleBags, BagsSize, tagsList } = require('../mocks/Bags')
const { getAllBags, saveNewBags, getBagsByNameWithaboutId, deleteBagsByName } = require('../../controllers/bags')
const { aboutBagsBySize, aboutBagsByType } = require('../../controllers/abouts')
const { getBagsByTags } = require('../../controllers/tags')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Bags', () => {
  let sandbox
  let stubbedFindOne
  let stubbedFindAll
  let stubbedCreate
  let stubbedDestroy
  let stubbedAboutsFindAll
  let stubbedTagsFindAll
  let response
  let stubbedStatusSend

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    stubbedStatusSend = sandbox.stub()

    response = {
      send: sandbox.stub(),
      status: sandbox.stub().returns({ send: stubbedStatusSend }),
      sendStatus: sandbox.stub(),
    }

    stubbedFindOne = sandbox.stub(models.Bags, 'findOne')
    stubbedFindAll = sandbox.stub(models.Bags, 'findAll')
    stubbedCreate = sandbox.stub(models.Bags, 'create')
    stubbedDestroy = sandbox.stub(models.Bags, 'destroy')

    stubbedAboutsFindAll = sandbox.stub(models.abouts, 'findAll')

    stubbedTagsFindAll = sandbox.stub(models.tags, 'findAll')
  })

  afterEach(() => {
    sandbox.reset()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getAllBags', () => {
    it('retrieves a list of all Bags from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(BagsList)

      await getAllBags({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(response.send).to.have.been.calledWith(BagsList)
    })

    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllBags({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Bags, please try again')
    })
  })

  describe('saveNewBags', () => {
    it('accepts new hero details and saves them as a new Bags, returning the saved record with a 201 status', async () => {
      const request = { body: { name: 'Chanel', description: 'Classic Flap Shoulder Diana Vintage Quilted Medium Midnight Navy Blue Lambskin Leather Cross Body Bag.', aboutId: 4 } }

      stubbedCreate.returns(singleBags)

      await saveNewBags(request, response)

      expect(stubbedCreate).to.have.been.calledWith({ name: 'Chanel', description: 'Classic Flap Shoulder Diana Vintage Quilted Medium Midnight Navy Blue Lambskin Leather Cross Body Bag.', aboutId: 4 })
      expect(response.status).to.have.been.calledWith(201)
      expect(stubbedStatusSend).to.have.been.calledWith(singleBags)
    })

    it('returns a 400 when a new Bags cannot be saved because of missing data', async () => {
      const request = { body: { name: 'not-found' } }

      await saveNewBags(request, response)

      expect(stubbedCreate).to.have.been.callCount(0)
      expect(response.status).to.have.been.calledWith(400)
      expect(stubbedStatusSend).to.have.been.calledWith('Required information: name, description, type, size, and tags.')
    })

    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedCreate.throws('ERROR')

      const request = { body: { name: 'Chanel', description: 'Classic Flap Shoulder Diana Vintage Quilted Medium Midnight Navy Blue Lambskin Leather Cross Body Bag.', aboutId: 4 } }

      await saveNewBags(request, response)

      expect(stubbedCreate).to.have.been.calledWith({ name: 'Chanel', description: 'Classic Flap Shoulder Diana Vintage Quilted Medium Midnight Navy Blue Lambskin Leather Cross Body Bag.', aboutId: 4 })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unknown error when creating new Bags')
    })
  })

  describe('getBagsByNameWithaboutId', () => {
    it('retrieves a Bags by name and the corresponding aboutId and calls response.send() with that Bags', async () => {
      stubbedFindOne.returns(singleBags)
      const request = { params: { name: 'Chanel' } }

      await getBagsByNameWithaboutId(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        include: [{ model: models.abouts }],
        where: { name: 'Chanel' }
      })
      expect(response.send).to.have.been.calledWith(singleBags)
    })

    it('returns a 404 when no Bags is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { name: 'not-found' } }

      await getBagsByNameWithaboutId(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({
        include: [{ model: models.abouts }],
        where: { name: 'not-found' }
      })
      expect(response.sendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedFindOne.throws('ERROR')
      const request = { params: { name: 'Chanel' } }

      await getBagsByNameWithaboutId(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ include: [{ model: models.abouts }], where: { name: 'Chanel' }, })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Bags, please try again')
    })
  })

  describe('deleteBagsByName', () => {
    it('responds with a success message when the Bags is deleted', async () => {
      stubbedFindOne.returns(singleBags)
      const request = { params: { name: 'Chanel' } }

      await deleteBagsByName(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { name: 'Chanel' } })
      expect(stubbedDestroy).to.have.been.calledWith({ where: { name: 'Chanel' } })
      expect(response.send).to.have.been.calledWith('Successfully deleted the Bags with the name: Chanel')
    })

    it('responds with a 404 when no Bags can be found with the name passed in', async () => {
      stubbedFindOne.returns(null)

      const request = { params: { name: 'not-found' } }

      await deleteBagsByName(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { name: 'not-found' } })
      expect(stubbedDestroy).to.have.callCount(0)
      expect(response.status).to.have.been.calledWith(404)
      expect(stubbedStatusSend).to.have.been.calledWith('Unknown Bags with name: not-found')
    })

    it('returns a 500 error when the database calls fails', async () => {
      stubbedFindOne.returns(singleBags)
      stubbedDestroy.throws('ERROR!')

      const request = { params: { name: 'Chanel' } }

      await deleteBagsByName(request, response)

      expect(stubbedDestroy).to.have.been.been.calledWith({
        where: { name: 'Chanel' }
      })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to delete Bags, please try again')
    })
  })

  describe('aboutBagsBySize', () => {
    it('returns a list of Bags by the searched Size and calls response.send with that list', async () => {
      stubbedAboutsFindAll.returns(BagsSize)
      const request = { params: { Size: 'medium' } }

      await aboutBagsBySize(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { Size: 'medium' } })
      expect(response.send).to.have.been.calledWith(BagsSize)
    })

    it('returns a 404 when no Size is found', async () => {
      stubbedAboutsFindAll.returns(null)
      const request = { params: { Size: 'medium' } }

      await aboutBagsBySize(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { Size: 'medium' } })
      expect(response.sendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 error when database call fails', async () => {
      stubbedAboutsFindAll.throws('ERROR')
      const request = { params: { Size: 'throw-error' } }

      await aboutBagsBySize(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { Size: 'throw-error' } })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Bags by Size.')
    })
  })

  describe('aboutBagsByType', () => {
    it('returns a list of Bags by the searched type and calls response.send with that list', async () => {
      stubbedAboutsFindAll.returns(BagsSize)
      const request = { params: { type: 'drop' } }

      await aboutBagsByType(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { type: 'drop' } })
      expect(response.send).to.have.been.calledWith(BagsSize)
    })

    it('returns a 404 when no matching type is found', async () => {
      stubbedAboutsFindAll.returns(null)
      const request = { params: { type: 'square' } }

      await aboutBagsByType(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { type: 'square' } })
      expect(response.sendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 error when database call fails', async () => {
      stubbedAboutsFindAll.throws('ERROR')
      const request = { params: { type: 'throw-error' } }

      await aboutBagsByType(request, response)

      expect(stubbedAboutsFindAll).to.have.been.calledWith({ where: { type: 'throw-error' } })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Bags by type.')
    })
  })

  describe('getBagsByTags', () => {
    it('returns a list of Bags by the searched tag', async () => {
      stubbedTagsFindAll.returns(tagsList)
      const request = { params: { tag: 'crossbody' } }

      await getBagsByTags(request, response)

      expect(stubbedTagsFindAll).to.have.been.calledWith({ include: [{ model: models.Bags }], where: { tag: 'crossbody' } })
      expect(response.send).to.have.been.calledWith(tagsList)
    })

    it('returns a 404 when no Bags is found with the searched tag', async () => {
      stubbedTagsFindAll.returns(null)
      const request = { params: { tag: 'blue' } }

      await getBagsByTags(request, response)

      expect(stubbedTagsFindAll).to.have.been.calledWith({ include: [{ model: models.Bags }], where: { tag: 'blue' } })
      expect(response.sendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 error when database call fails', async () => {
      stubbedTagsFindAll.throws('ERROR')
      const request = { params: { tag: 'crossbody' } }

      await getBagsByTags(request, response)

      expect(stubbedTagsFindAll).to.have.been.calledWith({ include: [{ model: models.Bags }], where: { tag: 'crossbody' }, })
      expect(response.status).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Bag by tag, please try again.')
    })
  })
})


