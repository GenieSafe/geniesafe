import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'
import { Beneficiary, Validator, Will } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime'

/**
 * Handler for retrieving a will.
 * Supports retrieving a will by willId or ownerId.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const getWill: NextApiHandler = async (req, res) => {
  const { ownerId: ownerUserId } = req.query
  const { willId } = req.query

  // If willId is provided, return will with that willId
  if (willId) {
    try {
      const will = await prisma.will.findUnique({
        where: {
          id: parseInt(willId as string),
        },
      })
      if (!will)
        throw new createHttpError.NotFound(
          `Will (ID: ${willId}) does not exist!`
        )
      res.status(200).json({ data: will })
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving will with willId: ${willId}!`
      )
    }
  }

  // If ownerId is provided, return all wills with that ownerId
  if (ownerUserId) {
    try {
      const wills = await prisma.will.findMany({
        where: {
          ownerUserId: ownerUserId.toString(),
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
      if (!wills)
        throw new createHttpError.NotFound(
          `User (ID: ${ownerUserId}) does not exist!`
        )
      res.status(200).json({ data: wills })
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving wills with ownerId: ${ownerUserId}!`
      )
    }
  } else {
    // Else if ownerId is not provided or doesn't exist, throw an error
    throw new createHttpError.NotFound(
      `Query parameter (ownerId or willId) not provided!`
    )
  }
}

/**
 * Schema for validating the request body when creating a will.
 */
const willSchema = Yup.object().shape({
  ownerUserId: Yup.string().required('Owner user ID is required!'),
  title: Yup.string().required('Title is required!'),
  walletAddress: Yup.string()
    .required('Owner wallet address is required!')
    .matches(/^(0x)?[0-9a-fA-F]{40}$/i, 'Invalid wallet address format!'),
  beneficiaries: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Beneficiary name is required!'),
      walletAddress: Yup.string()
        .required('Beneficiary wallet address is required!')
        .matches(/^(0x)?[0-9a-fA-F]{40}$/i, 'Invalid wallet address format!'),
      percentage: Yup.number()
        .required('Beneficiary percentage is required!')
        .min(0, 'Percentage must be greater than or equal to 0!')
        .max(100, 'Percentage must be less than or equal to 100!'),
    })
  ),
  validators: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Validator name is required!'),
      walletAddress: Yup.string()
        .required('Owner wallet address is required!')
        .matches(/^(0x)?[0-9a-fA-F]{40}$/i, 'Invalid wallet address format!'),
    })
  ),
})

/**
 * Handler for creating a new will.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const createWill: NextApiHandler = async (req, res) => {
  // @ts-ignore
  const data = validateRequest(req.body, willSchema)
  const { ownerUserId, title, walletAddress, beneficiaries, validators } =
    req.body

  try {
    // Create will
    const newWill = await prisma.will.create({
      data: {
        title: title as unknown as string,
        Owner: {
          connect: {
            id: ownerUserId as unknown as string,
          },
        },
      },
    })

    // Create beneficiaries
    const newBeneficiaries = await Promise.all(
      beneficiaries.map(async (beneficiary: Beneficiary) => {
        const { name, walletAddress, percentage } = beneficiary

        // Retrieve beneficiary user ID by wallet address
        const beneficiaryUserId = await prisma.user.findUnique({
          where: {
            walletAddress: walletAddress as unknown as string,
          },
          select: {
            id: true,
          },
        })

        const newBeneficiary = await prisma.beneficiary.create({
          data: {
            name: beneficiary.name,
            percentage: beneficiary.percentage,
            Will: {
              connect: {
                id: newWill.id,
              },
            },
            User: {
              connect: {
                id: beneficiaryUserId?.id as unknown as string,
              },
            },
          },
        })
        return newBeneficiary
      })
    )

    // Create validators
    const newValidators = await Promise.all(
      validators.map(async (validator: Validator) => {
        const { name, walletAddress } = validator

        const validatorUserId = await prisma.user.findUnique({
          where: {
            walletAddress: walletAddress as unknown as string,
          },
          select: {
            id: true,
          },
        })

        const newValidator = await prisma.validator.create({
          data: {
            name: validator.name,
            Will: {
              connect: {
                id: newWill.id,
              },
            },
            User: {
              connect: {
                id: validatorUserId?.id as unknown as string,
              },
            },
          },
        })
        return newValidator
      })
    )

    res.status(200).json({ data: { newWill, newBeneficiaries, newValidators } })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating will for user with ownerUserId: ${ownerUserId}! Check if user exists.`
    )
  }
}

/**
 * Handler for deleting a will.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const deleteWill: NextApiHandler = async (req, res) => {
  const { willId } = req.query

  try {
    const deletedWill = await prisma.will.delete({
      where: {
        id: parseInt(willId as string),
      },
    })
    res.status(200).json({
      message: `Successfully deleted will with ID: ${willId}`,
      data: deletedWill,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error deleting will with willId: ${willId}! Check if will exists.`
    )
  }
}
/**
 * Handler for updating a will.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const updateWill: NextApiHandler = async (req, res) => {
  const { willId } = req.query

  try {
    const updatedWill = await prisma.will.update({
      where: {
        id: parseInt(willId as string),
      },
      data: {
        ...req.body,
      },
    })
    res.status(200).json({
      message: `Successfully updated will with ID: ${willId}`,
      data: updatedWill,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error updating will with ID: ${willId}! Check if will exists.`
    )
  }
}

export default apiHandler({
  GET: getWill,
  POST: createWill,
  DELETE: deleteWill,
  PATCH: updateWill,
})
