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
        request.movie.CopyFrom(movie)

    if data is not None:
        request.data = data

    request_bytes = request.SerializeToString()

    connection.sendall(request_bytes)
    response = connection.recv(9000000)

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

        print("\nEnredo completo: ", movie.fullplot, "\n\n")


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
    movie.rated = input("Informe a avaliação do filme: ")

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

    print("\n\n------------------------------")
    print(create_movie_response.message)
    print("------------------------------\n\n")


def find_movie_by_id(connection):
    movie_id = input("Informe o id do filme: ")

    response = send_request(
        connection, FIND_MOVIE_BY_ID_REQUEST_ID, None, movie_id)

    print(response.movies)
    print_movies(response.movies)


def update():
    print("update")


def delete():
    print("delete")


def find_by_actor():
    print("find by actor")


def find_by_category():
    print("find by category")


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
            update()

        elif option == 4:
            delete()

        elif option == 5:
            find_by_actor()

        elif option == 6:
            find_by_category()

        elif option == 0:
            print("Finalizando conexão...")
            close(connection)
            break

        option = choose_option()


main()
