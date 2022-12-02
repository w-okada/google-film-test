FROM debian:bullseye-slim as film
#FROM gcr.io/deeplearning-platform-release/tf2-gpu.2-10:latest as film

# from tensorflow.python.client import device_lib
# device_lib.list_local_devices()
#
# https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
    python3-pip \
    git \
    wget \
    emacs \
    ffmpeg \
    mlocate \
    software-properties-common

RUN add-apt-repository contrib
RUN add-apt-repository non-free
RUN apt-key del 7fa2af80
RUN apt-get update && \
    apt-get install -y \
    nvidia-driver 

RUN wget https://developer.download.nvidia.com/compute/cuda/repos/debian11/x86_64/cuda-keyring_1.0-1_all.deb
RUN dpkg -i cuda-keyring_1.0-1_all.deb
RUN apt-get update
RUN apt-get -y install cuda


RUN apt -y remove nvidia-*
RUN apt-get install -y libcudnn8


RUN pip install tensorflow
RUN pip install apache-beam
RUN pip install mediapy
RUN pip install natsort
RUN pip install tqdm
RUN pip install tensorflowjs

RUN git clone https://github.com/google-research/frame-interpolation
COPY /model /model

WORKDIR /frame-interpolation
COPY /export_tfjs.sh /frame-interpolation/

# ENTRYPOINT ["/bin/bash", ""]
