import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'

const getConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query

  if (walletRecoveryConfigId) {
    try {
      const config = await prisma.walletRecoveryConfig.findUnique({
        where: {
          id: parseInt(walletRecoveryConfigId as string),
        },
      })
      if (!config)
        throw new createHttpError.NotFound(
          `Config (ID: ${walletRecoveryConfigId}) does not exist!`
        )
      res.status(200).json({ data: config })
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving config with configId: ${walletRecoveryConfigId}!`
      )
    }
  } else {
    throw new createHttpError.NotFound(`No walletRecoveryConfigId provided!`)
  }
}

const createConfig: NextApiHandler = async (req, res) => {
  const walletRecoveryConfigId = req.body.walletRecoveryConfigId

  try {
    const newConfig = await prisma.walletRecoveryConfig.create({
      data: {
        ...req.body,
      },
    })
    res.status(200).json({ data: newConfig })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating will with ownerId: ${walletRecoveryConfigId}! Check if config exists.`
    )
  }
}

export default apiHandler({
  GET: getConfig,
  POST: createConfig,
  //   DELETE: deleteConfig,
  //   PATCH: updateConfig,
})
