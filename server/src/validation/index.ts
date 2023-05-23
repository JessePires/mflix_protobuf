import * as Yup from 'yup'


export const Movie = Yup.object({
  plot: Yup.string().required("Por favor, informe a trama do filme."),
  genres: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
    })
  ).required("Por favor, informe os gêneros do filme."),
  runtime: Yup.number().required("Por favor, informe o runtime do filme."),
  rated: Yup.string().required("Por favor, informe a avaliação do filme."),
  cast: Yup.array().of(
    Yup.object().shape({
      actor: Yup.string(),
    })
  ).required("Por favor, informe o elenco do filme."),
  num_mflix_comments: Yup.number().required("Por favor, informe o número de comentarios do filme."),
  poster: Yup.string().required("Por favor, informe o poster do filme."),
  title: Yup.string().required("Por favor, informe o titulo do filme."),
  fullplot: Yup.string().required("Por favor, informe o enredo completo do filme."),
  languages: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
    })
  ).required("Por favor, informe as linguagens do filme."),
  released: Yup.string().required("Por favor, informe a data de lançamento do filme."),
  directors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
    })
  ).required("Por favor, informe os diretores do filme."),
  writers: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
    })
  ).required("Por favor, informe os escritores do filme."),
  lastupdated: Yup.string(),
  year: Yup.string().required("Por favor, informe o ano do filme."),
  countries: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
    })
  ).required("Por favor, informe o país do filme."),
  type: Yup.string().required("Por favor, informe o tipo do filme."),
})

export const requestCreateValidation = Yup.object({
  request_id: Yup.number().required("Por favor, informe o id da requisição."),
  movie: Movie.required("Por favor, envie os dados do filme."),
  data: Yup.string().nullable(),
})

export const requestUpdateValidation = Yup.object({
  request_id: Yup.number().required("Por favor, informe o id da requisição."),
  movie: Movie.required("Por favor, envie os dados do filme."),
  data: Yup.string().required("Por favor, informe o id do filme."),
})

export const requestGetValidation = Yup.object({
  request_id: Yup.number().required("Por favor, informe o id da requisição."),
  movie: Movie.nullable(),
  data: Yup.string().required("Por favor, preencha campo data da requisição."),
})

export const requestDeleteValidation = Yup.object({
  request_id: Yup.number().required("Por favor, informe o id da requisição."),
  movie: Movie.nullable(),
  data: Yup.string().required("Por favor, informe o id do filme."),
})
