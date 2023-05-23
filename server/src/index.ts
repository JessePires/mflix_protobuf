import Net, { Socket } from 'net'
import * as dotenv from 'dotenv'
dotenv.config()

import { Movie, Cast, Genre, Request, Response } from './generated/src/proto/movies_pb'
import {  MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { Collection } from 'mongodb';
import { createMovieProtobuf } from './utils/createMovieProtobuf';

const OP = {
  'CREATE': 1,
  'FIND_BY_ID': 2,
  'UPDATE': 3,
  'DELETE': 4,
  'FIND_BY_ACTOR': 5,
  'FIND_BY_CATEGORY': 6,
}

// SERVIDOR MONGO
const uri = process.env.MONGO_URI || '';
const database = process.env.DB_NAME || "sample_mflix";
const table = process.env.COLLECTION_NAME || "movies";
let db;
let collection: Collection;


// SERVIDOR SOCKET
const port = 6666;
const server = new Net.Server();


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

    console.log({mongoMovie});
    const protoMovie = createMovieProtobuf(mongoMovie);


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

async function getMoviesByGenre(collection: Collection, genre: Genre){
  try {

    const value = genre.getName();
    const query = { genres: { $elemMatch: { $eq: value } } };

    const moviesMongo = await collection.find(query).toArray();
    const protoMovies = moviesMongo.map(item => createMovieProtobuf(item));

    return protoMovies;
  } catch (error) {
    return []
  }
}

async function getMoviesByActor(collection: Collection, cast: Cast){
  try {

    const actor = cast.getActor();

    const query = { cast: { $elemMatch: { $eq: actor } } };

    const moviesMongo = await collection.find(query).toArray();
    const protoMovies = moviesMongo.map(item => createMovieProtobuf(item));

    return protoMovies;
  } catch (error) {
    return []
  }
}

async function updateMovie(collection: Collection, id: string, movie: Movie){
  try {

    const jsonMovie = movie.toObject();
    const idObject = new ObjectId(id);

    const { acknowledged } = await collection.updateOne({ _id: idObject }, { $set: {
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
    } });

    return acknowledged;
  } catch (error) {
    throw error;
  }
}


async function handleSocketRequest(socket: Socket, req: Request){
  const protoResponse = new Response();

  try{
    const id: number = req.getRequestId();
    const movie: Movie | undefined = req.getMovie();
    const data: string = req.getData();

    let response;
    protoResponse.setResponseId(id);


    switch(id){
      case OP.CREATE:
          if(movie){
            response = await createMovie(collection, movie)

            if(!response){
              protoResponse.setMessage(`Erro na tentativa de criação do filme`);
              protoResponse.setSucess(false);
            }else{
              protoResponse.setMessage(`Filme criado com sucesso`);
              protoResponse.setSucess(true);
              const createdMovie = await getMovieById(collection, response);
              if(createdMovie) protoResponse.addMovies(createdMovie)
            }
          }


        break;
      case OP.FIND_BY_ID:
          response = await getMovieById(collection, data)

          if(!response){
            protoResponse.setMessage(`Erro na busca do filme com o id ${data}`);
            protoResponse.setSucess(false);
          }else{
            protoResponse.setMessage(`Filme encontrado com sucesso`);
            protoResponse.setSucess(true);
            protoResponse.addMovies(response);
          }

        break;
      case OP.UPDATE:
          if(movie){
            response = await updateMovie(collection, data, movie);

            if(!response){
              protoResponse.setMessage(`Erro na tentativa de atualização do filme com o id ${movie.getId()}`);
              protoResponse.setSucess(false);
            }else{
              protoResponse.setMessage(`Filme atualizado com sucesso`);
              protoResponse.setSucess(true);
              protoResponse.addMovies(movie);
            }

          }
        break;
      case OP.DELETE:
          response = await deleteMovie(collection, data);

          if(!response){
            protoResponse.setMessage(`Erro na tentativa de deleção do filme com o id ${data}`);
            protoResponse.setSucess(false);
          }else{
            protoResponse.setMessage(`Filme deletado com sucesso`);
            protoResponse.setSucess(true);
          }

        break;
      case OP.FIND_BY_ACTOR:
          const cast = new Cast();
          cast.setActor(data);
          response = await getMoviesByActor(collection, cast);
          response.map((movie) => protoResponse.addMovies(movie));

          if(!response.length){
            protoResponse.setMessage(`Nenhum filme do ator ${data} foi encontrado`);
            protoResponse.setSucess(false);
          }else{
            protoResponse.setMessage(`Busca concluída com sucesso`);
            protoResponse.setSucess(true);
          }

        break;
      case OP.FIND_BY_CATEGORY:
          const genre = new Genre();
          genre.setName(data);
          response = await getMoviesByGenre(collection, genre);
          response.map((movie) => protoResponse.addMovies(movie));

          if(!response.length){
            protoResponse.setMessage(`Nenhum filme da categoria ${data} foi encontrado`);
            protoResponse.setSucess(false);
          }else{
            protoResponse.setMessage(`Busca concluída com sucesso`);
            protoResponse.setSucess(true);
          }

        break;
      default:
        protoResponse.setMessage(`Identificador de requisição inválido (${id})`);
        protoResponse.setSucess(false);
        break;
      }

      // socket.write(protoResponse.serializeBinary());

    const responseBytes = protoResponse.serializeBinary();
    const chunkSize = 4096;
    let offset;

    for (offset = 0; offset < responseBytes.length; offset += chunkSize) {
      if (offset > responseBytes.length) {
        offset = responseBytes.length
      }

      const chunk = responseBytes.slice(offset, offset + chunkSize);
      socket.write(chunk);
    }

    const endOfStreamMessage = "END_OF_STREAM";
    socket.write(endOfStreamMessage);
  }catch(error){
    console.log('error[handleSocketRequest]:', error);
    protoResponse.setMessage(JSON.stringify(error));
    protoResponse.setSucess(false);
    // socket.write(protoResponse.serializeBinary());

    const responseBytes = protoResponse.serializeBinary();
    const chunkSize = 4096;

    for (let offset = 0; offset < responseBytes.length; offset += chunkSize) {
      const chunk = responseBytes.slice(offset, offset + chunkSize);
      socket.write(chunk);
    }
  }
}


server.listen(port, async function() {
  console.log(`Servidor socket TCP iniciado em http://localhost:${port}`);

  await client.connect();
  db = client.db(database);
  collection = db.collection(table);
});

server.on('connection', function(socket: Socket) {
  console.log('Uma nova conexão foi estabelecida.');

  socket.on('data', function(chunk: Buffer) {
    console.log('chunk', chunk);
    const req = Request.deserializeBinary(chunk);
    handleSocketRequest(socket, req);
  });

  socket.on('error', function(err: Error) {
      console.log(`Error: ${err}`);
  });
});
