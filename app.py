import http.server
import webbrowser
import threading
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def open_browser():
    webbrowser.open(f"http://localhost:{PORT}/ukrant_quiz.html")

threading.Timer(1, open_browser).start()
httpd = http.server.HTTPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print(f"Serving at http://localhost:{PORT} — press Ctrl+C to stop")
httpd.serve_forever()