import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'
import { Beneficiary, Validator, Will } from '@prisma/client'

/**
 * Handler for retrieving a will.
 * Supports retrieving a will by willId or ownerId.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const getUserByWalletAddress: NextApiHandler = async (req, res) => {
  const { walletAddress } = req.query

  if (walletAddress) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          walletAddress: walletAddress.toString(),
        },
      })
      if (!user)
        throw new createHttpError.NotFound(
          `User with wallet address ${walletAddress}) does not exist!`
        )
      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving user with wallet address ${walletAddress}!`
      )
    }
  }
}

export default apiHandler({
  GET: getUserByWalletAddress,
})
