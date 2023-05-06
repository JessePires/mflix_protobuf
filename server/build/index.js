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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var movies_pb_1 = require("./generated/src/proto/movies_pb");
var mongodb_1 = require("mongodb");
var uri = process.env.MONGO_URI || '';
var database = process.env.DB_NAME || "sample_mflix";
var table = process.env.COLLECTION_NAME || "movies";
var client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function createMovieProtobuf(movie) {
    var _a, _b, _c, _d, _e, _f;
    try {
        var protoMovie = new movies_pb_1.Movie();
        var protoGenres = (_a = movie.genres) === null || _a === void 0 ? void 0 : _a.map(function (value) {
            var genre = new movies_pb_1.Genre();
            genre.setName(value);
            return genre;
        });
        var protoCasts = (_b = movie.cast) === null || _b === void 0 ? void 0 : _b.map(function (value) {
            var cast = new movies_pb_1.Cast();
            cast.setActor(value);
            return cast;
        });
        var protoLanguages = (_c = movie.languages) === null || _c === void 0 ? void 0 : _c.map(function (value) {
            var language = new movies_pb_1.Language();
            language.setName(value);
            return language;
        });
        var protoDirectors = (_d = movie.directors) === null || _d === void 0 ? void 0 : _d.map(function (value) {
            var director = new movies_pb_1.Director();
            director.setName(value);
            return director;
        });
        var protoWriters = (_e = movie.writers) === null || _e === void 0 ? void 0 : _e.map(function (value) {
            var writer = new movies_pb_1.Writer();
            writer.setName(value);
            return writer;
        });
        var protoCountries = (_f = movie.countries) === null || _f === void 0 ? void 0 : _f.map(function (value) {
            var contry = new movies_pb_1.Country();
            contry.setName(value);
            return contry;
        });
        protoMovie.setId(String(movie._id));
        if (movie === null || movie === void 0 ? void 0 : movie.plot)
            protoMovie.setPlot(movie.plot);
        if (protoGenres)
            protoMovie.setGenresList(protoGenres);
        if (movie === null || movie === void 0 ? void 0 : movie.runtime)
            protoMovie.setRuntime(movie.runtime);
        if (protoCasts)
            protoMovie.setCastList(protoCasts);
        if (movie === null || movie === void 0 ? void 0 : movie.numMFlixComments)
            protoMovie.setNumMflixComments(movie.numMFlixComments);
        if (movie === null || movie === void 0 ? void 0 : movie.poster)
            protoMovie.setPoster(movie.poster);
        if (movie === null || movie === void 0 ? void 0 : movie.title)
            protoMovie.setTitle(movie.title);
        if (movie === null || movie === void 0 ? void 0 : movie.fullplot)
            protoMovie.setFullplot(movie.fullplot);
        if (protoLanguages)
            protoMovie.setLanguagesList(protoLanguages);
        if (movie === null || movie === void 0 ? void 0 : movie.released)
            protoMovie.setReleased(movie.released);
        if (protoDirectors)
            protoMovie.setDirectorsList(protoDirectors);
        if (protoWriters)
            protoMovie.setWritersList(protoWriters);
        if (movie === null || movie === void 0 ? void 0 : movie.lastupdated)
            protoMovie.setLastupdated(movie.lastupdated);
        if (movie === null || movie === void 0 ? void 0 : movie.year)
            protoMovie.setYear(movie.year);
        if (protoCountries)
            protoMovie.setCountriesList(protoCountries);
        if (movie === null || movie === void 0 ? void 0 : movie.type)
            protoMovie.setType(movie.type);
        return protoMovie;
    }
    catch (error) {
        throw error;
    }
}
function getMovieById(collections, id) {
    return __awaiter(this, void 0, void 0, function () {
        var query, mongoMovie, protoMovie, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_1.ObjectId(id) };
                    return [4 /*yield*/, collections.findOne(query)];
                case 1:
                    mongoMovie = _a.sent();
                    if (!mongoMovie)
                        return [2 /*return*/, null];
                    protoMovie = createMovieProtobuf(mongoMovie);
                    return [2 /*return*/, protoMovie];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteMovie(collections, id) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_1.ObjectId(id) };
                    return [4 /*yield*/, collections.deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (!result || !result.deletedCount) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAllMovies(collection) {
    return __awaiter(this, void 0, void 0, function () {
        var moviesMongo, protoMovies, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, collection.find({}).toArray()];
                case 1:
                    moviesMongo = _a.sent();
                    protoMovies = moviesMongo.map(function (item) { return createMovieProtobuf(item); });
                    return [2 /*return*/, protoMovies];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createMovie(collection, movie) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonMovie, created, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    jsonMovie = movie.toObject();
                    return [4 /*yield*/, collection.insertOne({
                            plot: jsonMovie.plot,
                            genres: jsonMovie.genresList.map(function (obj) { return obj.name; }),
                            runtime: jsonMovie.runtime,
                            cast: jsonMovie.castList.map(function (obj) { return obj.actor; }),
                            num_mflix_comments: jsonMovie.numMflixComments,
                            title: jsonMovie.title,
                            fullplot: jsonMovie.fullplot,
                            countries: jsonMovie.countriesList.map(function (obj) { return obj.name; }),
                            released: jsonMovie.released,
                            directors: jsonMovie.directorsList.map(function (obj) { return obj.name; }),
                            rated: jsonMovie.rated,
                            lastupdate: jsonMovie.lastupdated,
                            year: jsonMovie.year,
                            type: jsonMovie.type,
                            writers: jsonMovie.writersList.map(function (obj) { return obj.name; }),
                            languages: jsonMovie.languagesList.map(function (obj) { return obj.name; }),
                        })];
                case 1:
                    created = _a.sent();
                    if (!created)
                        return [2 /*return*/, null];
                    return [2 /*return*/, String(created.insertedId)];
                case 2:
                    error_4 = _a.sent();
                    console.log('error', error_4);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createFakeMovieInBytes() {
    var fakeProtoMovie = new movies_pb_1.Movie();
    var genre = new movies_pb_1.Genre();
    genre.setName("genre 1");
    var cast = new movies_pb_1.Cast();
    cast.setActor("jhonatan");
    var country = new movies_pb_1.Country();
    country.setName("country");
    var director = new movies_pb_1.Director();
    director.setName("diretor jhonatan");
    fakeProtoMovie.setPlot("plot");
    fakeProtoMovie.setGenresList([genre]);
    fakeProtoMovie.setRuntime(1);
    fakeProtoMovie.setCastList([cast]);
    fakeProtoMovie.setNumMflixComments(20);
    fakeProtoMovie.setTitle("Titulo");
    fakeProtoMovie.setFullplot("fullplot");
    fakeProtoMovie.setCountriesList([country]);
    fakeProtoMovie.setReleased("1893-05-09T00:00:00.000Z");
    fakeProtoMovie.setDirectorsList([director]);
    fakeProtoMovie.setRated("UNRATED");
    fakeProtoMovie.setLastupdated("2015-08-26 00:03:50.133000000");
    fakeProtoMovie.setYear("2023");
    fakeProtoMovie.setType("movie");
    return fakeProtoMovie.serializeBinary();
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var db, collection, binaryMovie, protoMovie, id, movieMongo, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 8]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    db = client.db(database);
                    collection = db.collection(table);
                    binaryMovie = createFakeMovieInBytes();
                    protoMovie = movies_pb_1.Movie.deserializeBinary(binaryMovie);
                    return [4 /*yield*/, createMovie(collection, protoMovie)];
                case 2:
                    id = _a.sent();
                    if (!id) return [3 /*break*/, 4];
                    return [4 /*yield*/, getMovieById(collection, id)];
                case 3:
                    movieMongo = _a.sent();
                    console.log("movieMongo", movieMongo === null || movieMongo === void 0 ? void 0 : movieMongo.toObject());
                    _a.label = 4;
                case 4: return [3 /*break*/, 8];
                case 5:
                    error_5 = _a.sent();
                    console.log('erro conexão', error_5);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, client.close()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
run().catch(function (error) { return console.dir(error); });
