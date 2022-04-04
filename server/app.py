import pytesseract
from PIL import Image
from flask import Flask, request
from flask_cors import cross_origin
import uuid
import os

app = Flask(__name__)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def getUniqueFileName():
  return str(uuid.uuid4())

@app.route("/")
@cross_origin()
def index():
  return "Sample route", 200


@app.route("/save/file", methods=['POST'])
@cross_origin()
def save_file():
  try:
    if request.method == 'POST':
      try:
        image = request.files['userImage']

        fileName = getUniqueFileName()
        fileExt = os.path.splitext(image.filename)[1]
        path = "./files/" + fileName + fileExt
        image.save(path)
        return fileName + fileExt
      except:
        return "ERR", 500
  except:
        return "ERR", 500

@app.route("/get/epic")
@cross_origin()
def get_epic():
  try:
    fileName = request.args.get("fileName")
    path = "./files/" + fileName

    text = pytesseract.image_to_string(Image.open(path))
    if text == None:
      os.remove(path)
      return "No text found", 400

    text = list(filter(lambda x: len(x) != 0, text.split('\n')))
    if len(text) == 0:
      os.remove(path)
      return "No text found", 400

    text = list(filter(lambda x: "epic" in x.lower(), text))
    if len(text) == 0:
      os.remove(path)
      return "EPIC Number not found", 400

    text = text[0][::-1].strip()

    res = ""
    for char in text:
      if char.isalpha() or char.isdigit():
        res = char + res 
      else:
        break

    if len(res) == 0:
      os.remove(path)
      return "EPIC number not found", 400

    os.remove(path)
    return res, 200
  except:
    return "Error", 500
app.run()


# def test():
#   path = "./files/voter-id.PNG"
#   text = pytesseract.image_to_string(Image.open(path))
#   text = list(filter(lambda x: len(x) != 0, text.split('\n')))
#   text = list(filter(lambda x: "epic" in x.lower(), text))
#   text = text[0][::-1]
#   text = text.strip()

#   res = ""
#   for char in text:
#     if char.isalpha() or char.isdigit():
#       res = char + res 
#     else:
#       break

#   print(res)

# test()
