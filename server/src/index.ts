import * as dotenv from 'dotenv'
dotenv.config()

import { Movie} from './generated/src/proto/movies_pb'
import {  MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { Collection } from 'mongodb';
import { createMovieProtobuf } from './utils/createMovieProtobuf';
import { createFakeMovieInBytes } from './utils/createFakeMovieInBytes';

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



