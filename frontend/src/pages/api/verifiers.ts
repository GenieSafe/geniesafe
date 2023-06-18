// TODO: GET and DELETE verifiers from a wallet recovery config

import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'
import prisma from '../../utils/prisma'
import { apiHandler } from '../../utils/api'
import * as Yup from 'yup'
import { validateRequest } from '../../utils/yup'

const getVerifiers: NextApiHandler = async (req, res) => {
  const { walletRecoveryConfigId } = req.query

  try {
    const verifiers = await prisma.verifier.findMany({
      where: {
        walletRecoveryConfigId: parseInt(walletRecoveryConfigId as string),
      },
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
        WalletRecoveryConfig: {
          select: {
            id: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            isVerified: true,
          },
        },
      },
    })
    res.status(200).json({
      message: `Successfully retrieved verifiers for config with ID: ${walletRecoveryConfigId}`,
      data: verifiers,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error retrieving verifiers for config with ID: ${walletRecoveryConfigId}! Check if config exists.`
    )
  }
}

const verifierSchema = Yup.object().shape({
  walletRecoveryConfigId: Yup.number().required(
    'walletRecoveryConfigId is required'
  ),
  // walletAddress: Yup.string()
  //   .required('walletAddress is required')
  //   .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  verifierUserId: Yup.number().required('verifierUserId is required'),
})

const deleteVerifier: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.query, verifierSchema)
  const { walletRecoveryConfigId, verifierUserId } = data
  try {
    const deletedVerifier = await prisma.verifier.delete({
      where: {
        // @ts-ignore
        walletRecoveryConfigId: walletRecoveryConfigId as unknown as number,
        userId: verifierUserId as unknown as number,
      },
    })
    res.status(200).json({
      message: `Successfully deleted verifier with ID: ${verifierUserId}`,
      data: deletedVerifier,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error deleting verifier with ID: ${verifierUserId}! Check if verifier exists.`
    )
  }
}

export default apiHandler({
  GET: getVerifiers,
  DELETE: deleteVerifier,
})
