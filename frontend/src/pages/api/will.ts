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
  const { ownerUserId } = req.query
  const { willId } = req.query

  // If ownerId is provided, return all wills with that ownerId
  if (ownerUserId) {
    try {
      const wills = await prisma.user.findUnique({
        where: { id: ownerUserId as string },
        include: {
          Wills: {
            include: {
              Beneficiaries: {
                include: {
                  User: true,
                },
              },
              Validators: {
                include: {
                  User: true,
                },
              },
            },
          },
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
  }

  // TODO: Make implementation match the one above
  // If willId is provided, return will with that willId
  if (willId) {
    try {
      const will = await prisma.will.findUnique({
        where: { id: parseInt(willId as string) },
        include: {
          Beneficiaries: {
            include: {
              User: true,
            },
          },
          Validators: {
            include: {
              User: true,
            },
          },
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
      // walletAddress: Yup.string()
      //   .required('Beneficiary wallet address is required!')
      //   .matches(/^(0x)?[0-9a-fA-F]{40}$/i, 'Invalid wallet address format!'),
      beneficiaryUserId: Yup.string().required(
        'Beneficiary user ID is required!'
      ),
      percentage: Yup.number()
        .required('Beneficiary percentage is required!')
        .min(0, 'Percentage must be greater than or equal to 0!')
        .max(100, 'Percentage must be less than or equal to 100!'),
    })
  ),
  validators: Yup.array().of(
    Yup.object().shape({
      // walletAddress: Yup.string()
      //   .required('Owner wallet address is required!')
      //   .matches(/^(0x)?[0-9a-fA-F]{40}$/i, 'Invalid wallet address format!'),
      validatorUserId: Yup.string().required('Validator user ID is required!'),
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
        const { beneficiaryUserId, percentage } = beneficiary

        // // Retrieve beneficiary user ID by wallet address
        // const beneficiaryUserId = await prisma.user.findUnique({
        //   where: {
        //     walletAddress: beneficiaryUserId as unknown as string,
        //   },
        //   select: {
        //     id: true,
        //   },
        // })

        const newBeneficiary = await prisma.beneficiary.create({
          data: {
            percentage: beneficiary.percentage,
            Will: {
              connect: {
                id: newWill.id,
              },
            },
            User: {
              connect: {
                id: beneficiaryUserId as unknown as string,
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
        const { validatorUserId } = validator

        // const validatorUserId = await prisma.user.findUnique({
        //   where: {
        //     id: validatorUserId as unknown as string,
        //   },
        //   select: {
        //     id: true,
        //   },
        // })

        const newValidator = await prisma.validator.create({
          data: {
            Will: {
              connect: {
                id: newWill.id,
              },
            },
            User: {
              connect: {
                id: validatorUserId as unknown as string,
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
        updatedAt: new Date(), // Add this line to update the updatedAt field
        Beneficiaries: {
          deleteMany: {},
          createMany: {
            data: req.body.Beneficiaries.map((beneficiary: Beneficiary) => ({
              beneficiaryUserId: beneficiary.beneficiaryUserId,
              percentage: beneficiary.percentage,
            })),
          },
        },
        Validators: {
          deleteMany: {},
          createMany: {
            data: req.body.Validators.map((validator: Validator) => ({
              validatorUserId: validator.validatorUserId,
            })),
          },
        },
      },
      include: {
        Beneficiaries: true,
        Validators: true,
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
