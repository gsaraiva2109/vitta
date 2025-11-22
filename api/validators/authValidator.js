import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória'
  })
});
