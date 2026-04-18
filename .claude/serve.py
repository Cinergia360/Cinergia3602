import http.server, os
os.chdir("/Users/palomafarfan/Downloads/Cinergia3602")
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=5050, bind="127.0.0.1")
