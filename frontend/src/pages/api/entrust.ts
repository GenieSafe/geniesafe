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

const walletRecoveryConfigSchema = Yup.object().shape({
  ownerId: Yup.string().required('ownerId is required'),
  verifiers: Yup.array().of(
    Yup.object().shape({
      userId: Yup.string().required('userId is required'),
    })
  ),
})

const createConfig: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.body, walletRecoveryConfigSchema)
  const ownerId = req.body.ownerId

  try {
    const newConfig = await prisma.walletRecoveryConfig.create({
      data: {
        ownerId: ownerId,
        Verifiers: {
          // TODO: How to create multiple verifiers?
          create: {
            userId: req.body.verifiers[0].userId,
          },
        },
      },
    })
    res.status(200).json({ data: newConfig })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating will with ownerId: ${ownerId}! Check if config exists.`
    )
  }
}

export default apiHandler({
  GET: getConfig,
  POST: createConfig,
  //   DELETE: deleteConfig,
  //   PATCH: updateConfig,
})
