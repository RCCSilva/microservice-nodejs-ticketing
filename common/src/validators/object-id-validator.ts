import mongoose from 'mongoose'

type valueType = Parameters<typeof mongoose.Types.ObjectId.isValid>[0]

export const objectIdValidator = async (
  value: valueType
) => {
  const isValid = mongoose.Types.ObjectId.isValid(value)
  if (!isValid) {
    return Promise.reject('Invalid ObjectId')
  }
}
