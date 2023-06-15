import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'

type Verifier = {
  userId: string
}

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
  privateKey: Yup.string().required('privateKey is required'),
  verifiers: Yup.array().of(
    Yup.object().shape({
      userId: Yup.string().required('userId is required'),
    })
  ),
})

const createConfig: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.body, walletRecoveryConfigSchema)
  const { verifiers, ...rest } = req.body

  try {
    const newConfig = await prisma.walletRecoveryConfig.create({
      data: {
        ...rest,
      },
    })
    const newVerifiers = await prisma.verifier.createMany({
      data: verifiers.map((verifier: Verifier) => ({
        ...verifier,
        walletRecoveryConfigId: newConfig.id,
      })),
    })
    res.status(200).json({
      message: `Successfully created config with ID: ${newConfig.id}`,
      data: { newConfig, newVerifiers },
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating will with ownerId: ${req.body.ownerId}! Check if user exists.`
    )
  }
}

const deleteConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query

  try {
    const deletedConfig = await prisma.walletRecoveryConfig.delete({
      where: {
        id: parseInt(walletRecoveryConfigId as string),
      },
    })
    res.status(200).json({
      message: `Successfully deleted config with ID: ${walletRecoveryConfigId}`,
      data: deletedConfig,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error deleting config with ID: ${walletRecoveryConfigId}! Check if config exists.`
    )
  }
}

const updateConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query
  const { verifiers, ...rest } = req.body

  try {
    const updatedConfig = await prisma.walletRecoveryConfig.update({
      where: {
        id: parseInt(walletRecoveryConfigId as string),
      },
      data: {
        ...rest,
        Verifiers: {
          update: {
            userId: verifiers[0].userId,
          },
        },
      },
    })
    res.status(200).json({
      message: `Successfully updated config with ID: ${walletRecoveryConfigId}`,
      data: updatedConfig,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error updating config with ID: ${walletRecoveryConfigId}! Check if config exists.`
    )
  }
}

const activateConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query
  try {
    const updatedConfig = await prisma.walletRecoveryConfig.update({
      where: {
        id: parseInt(walletRecoveryConfigId as string),
      },
      data: {
        isActive: true,
      },
    })
    res.status(200).json({
      message: `Successfully activated config with ID: ${walletRecoveryConfigId}`,
      data: updatedConfig,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error activating config with ID: ${walletRecoveryConfigId}! Check if config exists.`
    )
  }
}

export default apiHandler({
  GET: getConfig,
  POST: createConfig,
  DELETE: deleteConfig,
  PATCH: updateConfig,
  PUT: activateConfig,
})
