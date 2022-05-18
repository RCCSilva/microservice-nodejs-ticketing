import { body } from "express-validator";

export const ticketAttrValidator = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Invalid price')
]
