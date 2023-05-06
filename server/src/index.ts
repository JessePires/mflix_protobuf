import * as dotenv from 'dotenv'
dotenv.config()

import { Movie } from './generated/src/proto/movies_pb'


const movie = new Movie();
movie.setYear("2012");

console.log(movie.getYear(), process.env.COLLECTION_NAME)