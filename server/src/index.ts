import * as dotenv from 'dotenv'
dotenv.config()

import { Movie, Genre, Cast, Language, Director, Writer, Country } from './generated/src/proto/movies_pb'
import { Document, MongoClient, ObjectId, ServerApiVersion, WithId } from 'mongodb';
import { Collection } from 'mongodb';
import { log } from 'console';

const uri = process.env.MONGO_URI || '';
const database = process.env.DB_NAME || "sample_mflix";
const table = process.env.COLLECTION_NAME || "movies";

const client = new MongoClient(uri,  {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function createMovieProtobuf(movie: WithId<Document>): Movie{
  try {
    const protoMovie = new Movie();

    const protoGenres = movie.genres?.map((value: string) => {
      const genre = new Genre();
      genre.setName(value);
      return genre;
    })

    const protoCasts = movie.cast?.map((value: string) => {
      const cast = new Cast();
      cast.setActor(value);
      return cast;
    })

    const protoLanguages = movie.languages?.map((value: string) => {
      const language = new Language();
      language.setName(value);
      return language;
    })

    const protoDirectors = movie.directors?.map((value: string) => {
      const director = new Director();
      director.setName(value);
      return director;
    })

    const protoWriters = movie.writers?.map((value: string) => {
      const writer = new Writer();
      writer.setName(value);
      return writer;
    })

    const protoCountries = movie.countries?.map((value: string) => {
      const contry = new Country();
      contry.setName(value);
      return contry;
    })

    protoMovie.setId(String(movie._id));
    if(movie?.plot) protoMovie.setPlot(movie.plot);
    if(protoGenres) protoMovie.setGenresList(protoGenres);
    if(movie?.runtime) protoMovie.setRuntime(movie.runtime);
    if(protoCasts) protoMovie.setCastList(protoCasts);
    if(movie?.numMFlixComments) protoMovie.setNumMflixComments(movie.numMFlixComments);
    if(movie?.poster) protoMovie.setPoster(movie.poster);
    if(movie?.title) protoMovie.setTitle(movie.title);
    if(movie?.fullplot) protoMovie.setFullplot(movie.fullplot);
    if(protoLanguages) protoMovie.setLanguagesList(protoLanguages);
    if(movie?.released) protoMovie.setReleased(movie.released);
    if(protoDirectors) protoMovie.setDirectorsList(protoDirectors);
    if(protoWriters) protoMovie.setWritersList(protoWriters);
    if(movie?.lastupdated) protoMovie.setLastupdated(movie.lastupdated);
    if(movie?.year) protoMovie.setYear(movie.year);
    if(protoCountries) protoMovie.setCountriesList(protoCountries);
    if(movie?.type) protoMovie.setType(movie.type);


    return protoMovie;
  } catch (error) {
    throw error;
  }
}

async function getMovieById(collections: Collection, id: string){
  try {
    const query = { _id: new ObjectId(id) };
    const mongoMovie = await collections.findOne(query);

    if(!mongoMovie) return null;

    const protoMovie = createMovieProtobuf(mongoMovie)

    return protoMovie;
  } catch (error) {
    return null;
  }
}

async function deleteMovie(collections: Collection, id: string): Promise<boolean>{
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.deleteOne(query);

    if(!result || !result.deletedCount){
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function getAllMovies(collection: Collection){
  try {
    const moviesMongo = await collection.find({}).toArray();
    const protoMovies = moviesMongo.map(item => createMovieProtobuf(item));

    return protoMovies;
  } catch (error) {
    return [];
  }
}


async function createMovie(collection: Collection, movie: Movie): Promise<string | null>{
  try {

    const jsonMovie = movie.toObject();

    const created = await collection.insertOne({
      plot: jsonMovie.plot,
      genres: jsonMovie.genresList.map(obj => obj.name),
      runtime: jsonMovie.runtime,
      cast: jsonMovie.castList.map(obj => obj.actor),
      num_mflix_comments: jsonMovie.numMflixComments,
      title: jsonMovie.title,
      fullplot: jsonMovie.fullplot,
      countries: jsonMovie.countriesList.map(obj => obj.name),
      released: jsonMovie.released,
      directors: jsonMovie.directorsList.map(obj => obj.name),
      rated: jsonMovie.rated,
      lastupdate: jsonMovie.lastupdated,
      year: jsonMovie.year,
      type: jsonMovie.type,
      writers: jsonMovie.writersList.map(obj => obj.name),
      languages: jsonMovie.languagesList.map(obj => obj.name),
    });

    if(!created) return null;

    return String(created.insertedId);
  } catch (error) {
    console.log('error', error);

    return null;
  }
}

function createFakeMovieInBytes(): Uint8Array{
  const fakeProtoMovie = new Movie();

  const genre = new Genre();
  genre.setName("genre 1")

  const cast = new Cast();
  cast.setActor("jhonatan");

  const country = new Country();
  country.setName("country")

  const director = new Director();
  director.setName("diretor jhonatan")

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

async function run() {
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(table);


    const binaryMovie:Uint8Array = createFakeMovieInBytes();
    const protoMovie = Movie.deserializeBinary(binaryMovie);

    const id = await createMovie(collection, protoMovie);
    if(id){
      const movieMongo = await getMovieById(collection, id);
      console.log("movieMongo", movieMongo?.toObject())
    }
    // console.log("serializeBinary", protoMovies[0].serializeBinary());
    // console.log("toObject", protoMovies[0].toObject());

  }catch(error){
    console.log('erro conexão', error);

  } finally {
    await client.close();
  }
}

run().catch(error => console.dir(error));



