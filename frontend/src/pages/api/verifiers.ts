// TODO: GET and DELETE verifiers from a wallet recovery config

import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'
import prisma from '../../utils/prisma'
import { apiHandler } from '../../utils/api'
import * as Yup from 'yup'
import { validateRequest } from '../../utils/yup'

const getVerifiers: NextApiHandler = async (req, res) => {
  const { configId } = req.query

  try {
    const verifiers = await prisma.verifier.findMany({
      where: {
        configId: parseInt(configId as string),
      },
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
        wallet_recovery_config: {
          select: {
            id: true,
            ownerUserId: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            isVerified: true,
          },
        },
      },
    })
    res.status(200).json(verifiers)
  } catch (err) {
    console.log(err)
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

const verifierSchema = Yup.object().shape({
  configId: Yup.number().required('configId is required'),
  // walletAddress: Yup.string()
  //   .required('walletAddress is required')
  //   .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  verifierUserId: Yup.number().required('verifierUserId is required'),
})

const deleteVerifier: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.query, verifierSchema)
  const { configId, verifierUserId } = data
  try {
    const deletedVerifier = await prisma.verifier.delete({
      where: {
        // @ts-ignore
        configId: configId as unknown as number,
        userId: verifierUserId as unknown as number,
      },
    })
    res.status(200).json({
      message: `Successfully deleted verifier with ID: ${verifierUserId}`,
      data: deletedVerifier,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.InternalServerError(`${err}`)
  }
}

export default apiHandler({
  GET: getVerifiers,
  DELETE: deleteVerifier,
})
