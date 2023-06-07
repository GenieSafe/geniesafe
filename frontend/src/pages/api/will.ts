import createHttpError from 'http-errors'
import * as Yup from 'yup'
import { NextApiHandler } from 'next'

import { apiHandler } from '../../utils/api'
import prisma from '../../utils/prisma'
import { validateRequest } from '../../utils/yup'

/**
 * Handler for retrieving a will.
 * Supports retrieving a will by willId or ownerId.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const getWill: NextApiHandler = async (req, res) => {
  const { ownerId } = req.query
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
  if (ownerId) {
    try {
      const wills = await prisma.will.findMany({
        where: {
          ownerId: ownerId.toString(),
        },
      })
      if (!wills)
        throw new createHttpError.NotFound(
          `User (ID: ${ownerId}) does not exist!`
        )
      res.status(200).json({ data: wills })
    } catch (err) {
      console.log(err)
      throw new createHttpError.NotFound(
        `Error retrieving wills with ownerId: ${ownerId}!`
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
  ownerId: Yup.string().required('Owner ID is required!'),
})

/**
 * Handler for creating a new will.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns Promise<void>
 */
const createWill: NextApiHandler = async (req, res) => {
  const data = validateRequest(req.body, willSchema)
  const ownerId = req.body.ownerId

  try {
    const newWill = await prisma.will.create({
      data: {
        ...req.body,
      },
    })
    res.status(200).json({ data: newWill })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error creating will with ownerId: ${ownerId}! Check if user exists.`
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
      message: `Successfully deleted will (ID: ${willId})`,
      data: deletedWill,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error deleting will with willId: ${willId}!`
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
      message: `Successfully updated will (ID: ${willId})`,
      data: updatedWill,
    })
  } catch (err) {
    console.log(err)
    throw new createHttpError.NotFound(
      `Error updating will with willId: ${willId}!`
    )
  }
}

export default apiHandler({
  GET: getWill,
  POST: createWill,
  DELETE: deleteWill,
  PATCH: updateWill,
})
