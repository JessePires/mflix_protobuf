import socket

from generated.movies_pb2 import Request

HOST = '127.0.0.1'
PORT = 6666

def connect():
    connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    connection.connect((HOST, PORT))

    return connection

def close(connection):
    connection.close()
    