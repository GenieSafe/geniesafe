import { ObjectSchema } from 'yup'
import { ObjectShape } from 'yup'

export function validateRequest<T extends ObjectShape>(
  data: unknown,
  schema: ObjectSchema<T>
) {
  const _data = schema.validateSync(data, {
    abortEarly: false,
    strict: true,
  })
  return _data
}
