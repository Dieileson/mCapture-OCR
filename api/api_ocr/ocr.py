import pytesseract as ocr
import numpy as np
import cv2
import base64
from io import BytesIO

from PIL import Image

def configure_ocr():
    # aponta para a instalação do tesseract
    ocr.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def capture(image, lang):
    # chamada ao tesseract OCR por meio de seu wrapper
    return ocr.image_to_string(image, lang=lang)

def handle_canals(image, r, g, b):
    # convertendo em um array editável de numpy[x, y, CANALS]
    np_image = np.asarray(image).astype(np.uint8)  

    # diminuição dos ruidos antes da binarização
    if r != -1:
        np_image[:, :, 0] = r # mudando o canal R (RED)
    if g != -1:
        np_image[:, :, 1] = g # mudando o canal G (GREEN)
    if b != -1:
        np_image[:, :, 2] = b # mudando o canal B (BLUE)

    return np_image

def handle_gray_scale(image):
    # atribuição em escala de cinza
    return cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) 

def handle_intensity(image, rate):
    # aplicação da truncagem binária para a intensidade
    # pixels de intensidade de cor abaixo de 127 serão convertidos para 0 (PRETO)
    # pixels de intensidade de cor acima de 127 serão convertidos para 255 (BRANCO)
    # A atrubição do THRESH_OTSU incrementa uma análise inteligente dos nivels de truncagem
    ret, thresh = cv2.threshold(image, rate, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU) 

    # reconvertendo o retorno do threshold em um objeto do tipo PIL.Image
    return Image.fromarray(thresh) 

# tipando a leitura para os canais de ordem RGB



def getbase64picture(imgbase64):
    image = Image.open(BytesIO(base64.b64decode(imgbase64)))


    image = handle_canals(image, 0, -1, 0)
    image = handle_gray_scale(image)
    image = handle_intensity(image, 127)

    configure_ocr()
    return capture(image, 'por')