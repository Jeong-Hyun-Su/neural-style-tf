FROM avoli/tensorflow-gpu

RUN apt-get update
RUN pip install --upgrade pip
RUN apt-get install -y libgl1-mesa-dev

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install waitress

WORKDIR /app
COPY . .

VOLUME ./examples ./examples
