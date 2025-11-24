import Joi from 'joi';

export const loginSchema = Joi.object({
  matricula: Joi.string().required().messages({
    'any.required': 'Matrícula é obrigatória'
  }),
  senha: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória'
  })
});
