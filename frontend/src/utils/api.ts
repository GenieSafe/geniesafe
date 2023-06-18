// API Routes Global Error Handling and Clean Code Practices
// Source: https://dev.to/sneakysensei/nextjs-api-routes-global-error-handling-and-clean-code-practices-3g9p

import createHttpError from 'http-errors'
import { ValidationError } from 'yup'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { Method } from 'axios'

// Shape of the response when an error is thrown
interface ErrorResponse {
  error: {
    message: string
    err?: any // Sent for unhandled errors resulting in 500
  }
  status?: number // Sent for unhandled errors resulting in 500
}

// Define type for HTTP method handlers
type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler
}

/**
 * Wrapper function for API route handlers.
 * Handles global error handling and method validation.
 * @param handler - Object containing method handlers for each supported HTTP method.
 * @returns NextApiHandler - A function that handles API requests.
 */
export function apiHandler(handler: ApiMethodHandlers): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
    try {
      const method = req.method
        ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
        : undefined

      // Check if handler supports current HTTP method
      if (!method)
        throw new createHttpError.MethodNotAllowed(
          `No method specified on path ${req.url}!`
        )

      const methodHandler = handler[method]
      if (!methodHandler)
        throw new createHttpError.MethodNotAllowed(
          `Method ${req.method} Not Allowed on path ${req.url}!`
        )

      // Call method handler
      await methodHandler(req, res)
    } catch (err) {
      // Global error handler
      errorHandler(err, res)
    }
  }
}

/**
 * Handles error responses based on the type of error.
 * @param err - The error object to be handled.
 * @param res - The HTTP response object.
 * @returns void
 */
function errorHandler(err: unknown, res: NextApiResponse<ErrorResponse>): void {
  // Errors with statusCode >= 500 should not be exposed
  if (createHttpError.isHttpError(err) && err.expose) {
    // Handle all errors thrown by the http-errors module
    return res.status(err.statusCode).json({ error: { message: err.message } })
  } else if (err instanceof ValidationError) {
    // Handle yup validation errors
    return res.status(400).json({ error: { message: err.errors.join(', ') } })
  } else {
    // Default to 500 server error
    console.error(err)
    return res.status(500).json({
      error: { message: 'Internal Server Error', err: err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    })
  }
}
