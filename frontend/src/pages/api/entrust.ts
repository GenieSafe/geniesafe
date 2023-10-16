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
      const config = await prisma.wallet_recovery_config.findMany({
        where: {
          ownerUserId: ownerId as string,
        },
        select: {
          id: true,
          ownerUserId: true,
          privateKey: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          isVerified: true,
          verifiers: {
            select: {
              verifierUserId: true,
              isVerified: true,
              verifiedAt: true,
              user: {
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
          `user (ID: ${ownerId}) does not exist!`
        )
      res.status(200).json(config)
    } catch (err) {
      console.log(err)
      throw new createHttpError.InternalServerError(`${err}`)
    }
  } else {
    throw new createHttpError.BadRequest(`No ownerId provided!`)
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
    const newConfig = await prisma.wallet_recovery_config.create({
      data: {
        ...rest,
      },
    })

    newVerifiers = await Promise.all(
      verifiers.map((verifier: Verifier) => {
        const { verifierUserId } = verifier

        return prisma.verifier.create({
          data: {
            user: {
              connect: {
                id: verifierUserId,
              },
            },
            wallet_recovery_config: {
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
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

const deleteConfig: NextApiHandler = async (req, res) => {
  const { ownerUserId } = req.query

  try {
    if (!ownerUserId) {
      throw new createHttpError.BadRequest(`ownerUserId is required`)
    }

    const deletedConfig = await prisma.wallet_recovery_config.delete({
      where: {
        ownerUserId: ownerUserId as string,
      },
    })

    res.status(200).json({
      message: `Successfully deleted config with ID: ${ownerUserId}`,
      data: deletedConfig,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

const updateConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query
  const { verifiers, ...rest } = req.body

  try {
    const updatedConfig = await prisma.wallet_recovery_config.update({
      where: {
        id: parseInt(walletRecoveryConfigId as string),
      },
      data: {
        ...rest,
        verifiers: {
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
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

const activateConfig: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query
  try {
    const updatedConfig = await prisma.wallet_recovery_config.update({
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
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

export default apiHandler({
  GET: getConfig,
  POST: createConfig,
  DELETE: deleteConfig,
  PATCH: updateConfig,
  PUT: activateConfig,
})
