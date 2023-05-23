import socket
from datetime import datetime

from generated.movies_pb2 import Request
from generated.movies_pb2 import Response
from generated.movies_pb2 import Movie
from generated.movies_pb2 import Genre
from generated.movies_pb2 import Cast
from generated.movies_pb2 import Language
from generated.movies_pb2 import Director
from generated.movies_pb2 import Writer
from generated.movies_pb2 import Country


HOST = '127.0.0.1'
PORT = 6666

CREATE_MOVIE_REQUEST_ID = 1
FIND_MOVIE_BY_ID_REQUEST_ID = 2
UPDATE_MOVIE_REQUEST_ID = 3
DELETE_MOVIE_REQUEST_ID = 4
FIND_MOVIE_BY_ACTOR_REQUEST_ID = 5
FIND_MOVIE_BY_CATEGORY_REQUEST_ID = 6


def close(connection):
    connection.close()


def send_request(connection, request_id, movie, data):
    request = Request()
    request.request_id = request_id

    if movie is not None:
        # Assuming 'movie' is a list of Movie objects

        if request_id == 1 or request_id == 3:
            request.movie.CopyFrom(movie)
        else:
            request.movies.CopyFrom(movie)

    if data is not None:
        request.data = data

    request_bytes = request.SerializeToString()

    connection.sendall(request_bytes)

    # Receive the response data in chunks until all data is received
    response = b""
    buffer_size = 4096  # Adjust the buffer size as needed

    while True:
        data = connection.recv(buffer_size)
        if data == b"END_OF_STREAM":
            break

        response += data

    response_message = Response()
    response_message.ParseFromString(response)

    return response_message


def print_movies(movies):
    for movie in movies:
        print("\n\n==========", movie.title, "==========")
        print("\nEnredo: ", movie.plot)

        print("Gêneros: ", end="")
        genres_list = [genre.name for genre in movie.genres]
        print(", ".join(genres_list))

        print("Duração do filme: ", movie.runtime, " minutos")

        print("Elenco: ", end="")
        actors_list = [cast.actor for cast in movie.cast]
        print(", ".join(actors_list))

        print("Idiomas: ", end="")
        languages_list = [language.name for language in movie.languages]
        print(", ".join(languages_list))

        print("Diretores: ", end="")
        directors_list = [director.name for director in movie.directors]
        print(", ".join(directors_list))

        print("Escritores: ", end="")
        writers_list = [writer.name for writer in movie.writers]
        print(", ".join(writers_list))

        print("Países disponíveis: ", end="")
        countries_list = [country.name for country in movie.countries]
        print(", ".join(countries_list))

        print("Tipo do filme: ", movie.type)

        print("Classificação: ", movie.rated)

        print("\nEnredo completo: ", movie.fullplot)

def print_message(message):
    print("\n")
    print("-" * len(message))
    print(message)
    print("-" * len(message))
    print("\n")


def create_movie(connection):
    movie = Movie()
    movie.plot = input("Fale sobre a história do filme: ")
    genres = input(
        "Informe os gêneros do filme separados por espaço: ").split(" ")

    for genre in genres:
        new_genre = Genre()
        new_genre.name = genre
        movie.genres.append(new_genre)

    movie.runtime = int(input("Informe a duração do filme em minutos: "))
    movie.rated = input("Informe a classificação do filme: ")

    cast = input(
        "Informe os nomes dos atores que fazem parte do elenco: ").split(" ")

    for actor in cast:
        new_actor = Cast()
        new_actor.actor = actor
        movie.cast.append(new_actor)

    movie.num_mflix_comments = int(
        input("Informe a quantidade de comentários: "))
    movie.poster = input("Informe o link para a URL do poster filme: ")
    movie.title = input("Informe o título do filme: ")
    movie.fullplot = input("Informe a sinopse completa do filme: ")

    movie.year = input("Informe o ano de criação do filme: ")

    languages = input(
        "Informe os idiomas em que o filme está disponível: ").split(" ")

    for language in languages:
        new_language = Language()
        new_language.name = language
        movie.languages.append(new_language)

    movie.released = input("Informe a data de lançamento: ")

    directors = input("Informe os diretores do filme: ").split(" ")

    for director in directors:
        new_director = Director()
        new_director.name = director
        movie.directors.append(new_director)

    writers = input("Informe os escritores do filme: ").split(" ")

    for writer in writers:
        new_writer = Writer()
        new_writer.name = writer
        movie.writers.append(new_writer)

    countries = input(
        "Informe os países em que o filme está disponível: ").split(" ")

    for country in countries:
        new_country = Country()
        new_country.name = country
        movie.countries.append(new_country)

    movie.type = input("Informe o tipo do filme: ")

    create_movie_response = send_request(
        connection, CREATE_MOVIE_REQUEST_ID, movie, None)

    print_message(create_movie_response.message)  


def find_movie_by_id(connection):
    movie_id = input("Informe o id do filme: ")

    response = send_request(
        connection, FIND_MOVIE_BY_ID_REQUEST_ID, None, movie_id)

    print_movies(response.movies)


def update(connection):
    movie_id = input("Informe o id do filme: ")
    
    founded_movie = send_request(connection, FIND_MOVIE_BY_ID_REQUEST_ID, None, movie_id)
    founded_movie = founded_movie.movies[0]

    update_message = "Informe os dados a serem atualizados (Caso deseje manter algum deles, basta não preencher o campo)"
    print_message(update_message)

    plot = input("Fale sobre a história do filme: ")
    founded_movie.plot = plot if plot.strip() != "" else founded_movie.plot

    genres = input(
        "Informe os gêneros do filme separados por espaço: ").split(" ")

    if len(genres) > 0 and genres[0] != "":
        del founded_movie.genres[:]

        for genre in genres:
            new_genre = Genre()
            new_genre.name = genre
            founded_movie.genres.append(new_genre)

    runtime = input("Informe a duração do filme em minutos: ")
    founded_movie.runtime = int(runtime) if runtime.strip() != "" else founded_movie.runtime

    rated = input("Informe a classificação do filme: ")
    founded_movie.rated = rated if rated.strip() != "" else founded_movie.rated


    cast = input(
        "Informe os nomes dos atores que fazem parte do elenco: ").split(" ")

    if len(cast) > 0 and cast[0] != "":
        del founded_movie.cast[:]
        
        for actor in cast:
            new_actor = Cast()
            new_actor.actor = actor
            founded_movie.cast.append(new_actor)

    num_mflix_comments = input("Informe a quantidade de comentários: ")
    founded_movie.num_mflix_comments = int(num_mflix_comments) if num_mflix_comments.strip() != "" else founded_movie.num_mflix_comments
    
    poster = input("Informe o link para a URL do poster filme: ")
    founded_movie.poster = poster if poster != "" else founded_movie.poster
    
    title = input("Informe o título do filme: ")
    founded_movie.title = title if title.strip() != "" else founded_movie.title
    
    fullplot = input("Informe a sinopse completa do filme: ")
    founded_movie.fullplot = fullplot if fullplot.strip() != "" else founded_movie.fullplot

    year = input("Informe o ano de criação do filme: ")
    founded_movie.year = int(year) if year.strip() != "" else founded_movie.year

    languages = input(
        "Informe os idiomas em que o filme está disponível: ").split(" ")

    if len(languages) > 0 and languages[0] != "":
        del founded_movie.languages[:]

        for language in languages:
            new_language = Language()
            new_language.name = language
            founded_movie.languages.append(new_language)

    released = input("Informe a data de lançamento: ")
    founded_movie.released = int(released) if released.strip() != "" else founded_movie.released

    directors = input("Informe os diretores do filme: ").split(" ")

    if len(directors) > 0 and directors[0] != "":
        del founded_movie.directors[:]

        for director in directors:
            new_director = Director()
            new_director.name = director
            founded_movie.directors.append(new_director)

    writers = input("Informe os escritores do filme: ").split(" ")

    if len(writers) > 0 and writers[0] != "":
        del founded_movie.writers[:]

        for writer in writers:
            new_writer = Writer()
            new_writer.name = writer
            founded_movie.writers.append(new_writer)

    countries = input(
        "Informe os países em que o filme está disponível: ").split(" ")

    if len(countries) > 0 and countries[0] != "":
        del founded_movie.countries[:]

        for country in countries:
            new_country = Country()
            new_country.name = country
            founded_movie.countries.append(new_country)

    movie_type = input("Informe o tipo do filme: ")
    founded_movie.type = movie_type if movie_type.strip() != "" else founded_movie.type

    update_response = send_request(connection, UPDATE_MOVIE_REQUEST_ID, founded_movie, movie_id)

    print_message(update_response.message)


def delete(connection):
    movie_id = input("Informe o id do filme a ser deletado: ")

    delete_movie_response = send_request(connection, DELETE_MOVIE_REQUEST_ID, None, movie_id)

    print_message(delete_movie_response.message)
    

def find_by_actor(connection):
    actor_name = input("Informe o nome do ator: ")

    response = send_request(
        connection, FIND_MOVIE_BY_ACTOR_REQUEST_ID, None, actor_name)

    print_movies(response.movies)


def find_by_category(connection):
    category_name = input("Informe a categoria: ")

    response = send_request(
        connection, FIND_MOVIE_BY_CATEGORY_REQUEST_ID, None, category_name)

    print_movies(response.movies)


def choose_option():
    print("\n\n--------------------Escolha uma opção--------------------")
    print("0 -> Encerra a execução")
    print("1 -> criar um novo filme")
    print("2 -> Procurar pelo id do filme")
    print("3 -> Atualizar um filme existe")
    print("4 -> Deletar um filme")
    print("5 -> Encontrar filmes com base no ator")
    print("6 -> Encontrar filmes com base na categoria")
    print("---------------------------------------------------------")

    option = int(input("\nSua opção: "))

    return option


def main():
    connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    connection.connect((HOST, PORT))
    print("Estabelecendo conexão com o servidor...")

    option = choose_option()

    while (True):
        if option == 1:
            create_movie(connection)

        elif option == 2:
            find_movie_by_id(connection)

        elif option == 3:
            update(connection)

        elif option == 4:
            delete(connection)

        elif option == 5:
            find_by_actor(connection)

        elif option == 6:
            find_by_category(connection)

        elif option == 0:
            print("Finalizando conexão...")
            close(connection)
            break

        option = choose_option()


main()