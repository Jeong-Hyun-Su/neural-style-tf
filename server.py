import os
import sys
sys.path.append("/app")

from flask import Flask, render_template, request, Response, send_file, jsonify
from PIL import Image
from io import BytesIO
from queue import Queue, Empty
import threading
import time
import cv2

from neural_style import *
# Server & Handling Setting
app = Flask(__name__)

requests_queue = Queue()
BATCH_SIZE = 1
CHECK_INTERVAL = 0.1

if not os.path.exists("./image_input"):
    os.makedirs("./image_input")
if not os.path.exists("./styles"):
    os.makedirs("./styles")


# Queue 핸들링
def handle_requests_by_batch():
    while True:
        requests_batch = []
        while not (len(requests_batch) >= BATCH_SIZE):
            try:
                requests_batch.append(requests_queue.get(timeout=CHECK_INTERVAL))
            except Empty:
                continue

            for requests in requests_batch:
                requests['output'] = run(requests['input'][0], requests['input'][1], requests['input'][2])


# 쓰레드
threading.Thread(target=handle_requests_by_batch).start()


@app.route("/")
def main():
    return render_template("index.html")


# Sketch Start
def run(content, style, ranges):
    # 전달받은 이미지 저장 및 변환
    content_dir = "./image_input/input.png"
    style_dir = "./styles/styles.png"
    output_dir = "./image_output/result/result.png"

    content.save(content_dir)
    style.save(style_dir)

    # 변환
    start(ranges)

    output = Image.open(output_dir)

    # 사진 체크 후 삭제
    if os.path.isfile(content_dir):
        os.remove(content_dir)
    if os.path.isfile(style_dir):
        os.remove(style_dir)
    if os.path.isfile(output_dir):
        os.remove(output_dir)

    byte_io = BytesIO()
    output.save(byte_io, "PNG")
    byte_io.seek(0)

    return byte_io


@app.route("/neural", methods=['POST'])
def neural():
    # 큐에 쌓여있을 경우,
    if requests_queue.qsize() > BATCH_SIZE:
        return jsonify({'error': 'TooManyReqeusts'}), 429

    # 웹페이지로부터 이미지와 스타일 정보를 얻어옴.
    try:
        content = request.files['content']
        style = request.files['style']
        ranges = int(request.form['range'])

    except Exception:
        print("error : not contain image")
        return Response("fail", status=400)

    # Queue - put data
    req = {
        'input': [content, style, ranges]
    }
    requests_queue.put(req)

    # Queue - wait & check
    while 'output' not in req:
        time.sleep(CHECK_INTERVAL)

    # Get Result & Send Image
    byte_io = req['output']

    return send_file(byte_io, mimetype="image/png")


# Health Check
@app.route("/healthz", methods=["GET"])
def healthCheck():
    return "", 200


if __name__ == "__main__":
    from waitress import serve
    serve(app, host='0.0.0.0', port=80)

