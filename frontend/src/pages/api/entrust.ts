import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'

type Verifier = {
  verifierUserId: string
}

const getConfig: NextApiHandler = async (req, res) => {
  const { ownerId } = req.query

  if (ownerId) {
    try {
      const config = await prisma.walletRecoveryConfig.findMany({
        where: {
          ownerId: ownerId as string,
        },
        select: {
          id: true,
          ownerId: true,
          privateKey: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          isVerified: true,
          Verifiers: {
            select: {
              verifierUserId: true,
              isVerified: true,
              verifiedAt: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      })
      if (!config)
        throw new createHttpError.NotFound(
          `User (ID: ${ownerId}) does not exist!`
        )
      res.status(200).json(config)
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving config with userId: ${ownerId}!`
      )
    }
  } else {
    throw new createHttpError.NotFound(`No ownerId provided!`)
  }
}

const walletRecoveryConfigSchema = Yup.object().shape({
  ownerId: Yup.string().required('ownerId is required'),
  privateKey: Yup.string().required('privateKey is required'),
  verifiers: Yup.array().of(
    Yup.object().shape({
      verifierUserId: Yup.string().required('userId is required'),
    })
  ),
})

const createConfig: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.body, walletRecoveryConfigSchema)
  const { verifiers, ...rest } = req.body
  let newVerifiers = []

  try {
    const newConfig = await prisma.walletRecoveryConfig.create({
      data: {
        ...rest,
      },
    })

    newVerifiers = await Promise.all(
      verifiers.map((verifier: Verifier) => {
        const { verifierUserId } = verifier

        return prisma.verifier.create({
          data: {
            User: {
              connect: {
                id: verifierUserId,
              },
            },
            WalletRecoveryConfig: {
              connect: {
                id: newConfig.id,
              },
            },
          },
        })
      })
    )
    res.status(200).json({
      message: `Successfully created config with ID: ${newConfig.id}`,
      data: { newConfig, newVerifiers },
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating config with ownerId: ${req.body.ownerId}!`
    )
  }
}

const deleteConfig: NextApiHandler = async (req, res) => {
  const { ownerUserId } = req.query

  try {
    if (!ownerUserId) {
      throw new createHttpError.BadRequest(`ownerUserId is required`)
    }

    // If ownerUserId is an array, you can choose how to handle it. This example takes the first element.
    const ownerId = Array.isArray(ownerUserId) ? ownerUserId[0] : ownerUserId

    const deletedConfig = await prisma.walletRecoveryConfig.delete({
      where: {
        ownerId: ownerId,
      },
    })

    res.status(200).json({
      message: `Successfully deleted config with ID: ${ownerId}`,
      data: deletedConfig,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error deleting config with ID: ${ownerUserId}! Check if config exists.`
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
          // delete before creating new verifiers
          deleteMany: {},
          createMany: {
            data: verifiers,
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
