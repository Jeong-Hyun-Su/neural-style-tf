FROM hyunsu/neural

WORKDIR /app
COPY . .

CMD python server.py