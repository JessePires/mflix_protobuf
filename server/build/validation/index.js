"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDeleteValidation = exports.requestGetValidation = exports.requestUpdateValidation = exports.requestCreateValidation = exports.Movie = void 0;
var Yup = __importStar(require("yup"));
exports.Movie = Yup.object({
    plot: Yup.string().required("Por favor, informe a trama do filme."),
    genres: Yup.array().of(Yup.object().shape({
        name: Yup.string(),
    })).required("Por favor, informe os gêneros do filme."),
    runtime: Yup.number().required("Por favor, informe o runtime do filme."),
    rated: Yup.string().required("Por favor, informe a avaliação do filme."),
    cast: Yup.array().of(Yup.object().shape({
        actor: Yup.string(),
    })).required("Por favor, informe o elenco do filme."),
    num_mflix_comments: Yup.number().required("Por favor, informe o número de comentarios do filme."),
    poster: Yup.string().required("Por favor, informe o poster do filme."),
    title: Yup.string().required("Por favor, informe o titulo do filme."),
    fullplot: Yup.string().required("Por favor, informe o enredo completo do filme."),
    languages: Yup.array().of(Yup.object().shape({
        name: Yup.string(),
    })).required("Por favor, informe as linguagens do filme."),
    released: Yup.string().required("Por favor, informe a data de lançamento do filme."),
    directors: Yup.array().of(Yup.object().shape({
        name: Yup.string(),
    })).required("Por favor, informe os diretores do filme."),
    writers: Yup.array().of(Yup.object().shape({
        name: Yup.string(),
    })).required("Por favor, informe os escritores do filme."),
    lastupdated: Yup.string(),
    year: Yup.string().required("Por favor, informe o ano do filme."),
    countries: Yup.array().of(Yup.object().shape({
        name: Yup.string(),
    })).required("Por favor, informe o país do filme."),
    type: Yup.string().required("Por favor, informe o tipo do filme."),
});
exports.requestCreateValidation = Yup.object({
    request_id: Yup.number().required("Por favor, informe o id da requisição."),
    movie: exports.Movie.required("Por favor, envie os dados do filme."),
    data: Yup.string().nullable(),
});
exports.requestUpdateValidation = Yup.object({
    request_id: Yup.number().required("Por favor, informe o id da requisição."),
    movie: exports.Movie.required("Por favor, envie os dados do filme."),
    data: Yup.string().required("Por favor, informe o id do filme."),
});
exports.requestGetValidation = Yup.object({
    request_id: Yup.number().required("Por favor, informe o id da requisição."),
    movie: exports.Movie.nullable(),
    data: Yup.string().required("Por favor, preencha campo data da requisição."),
});
exports.requestDeleteValidation = Yup.object({
    request_id: Yup.number().required("Por favor, informe o id da requisição."),
    movie: exports.Movie.nullable(),
    data: Yup.string().required("Por favor, informe o id do filme."),
});
