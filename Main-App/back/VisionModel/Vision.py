import re
from PIL import Image
import numpy as np
import oci
import cv2
from oci.ai_vision.models import AnalyzeImageDetails, ImageTextDetectionFeature, InlineImageDetails
import base64
from oci.config import validate_config
from flask import Flask, request, jsonify
from flask_cors import CORS
import io

def analyze_img_oci(image_array):

    config = {
        'user': 'ocid1.user.oc1..aaaaaaaagmbp7qkvz4nd5ejwke64hy464ygkn6hkjrg4jqab3atkmglriyhq',
        'region': 'mx-queretaro-1',
        'tenancy': 'ocid1.tenancy.oc1..aaaaaaaafnp4ykozv2ffag4h3mmsefi7jihsx6sfxwuw3jsk42fmsb2jmiva',
        'key_file': 'a01656699@tec.mx_2024-11-11T23_34_55.242Z.pem',
        'fingerprint': 'e4:0b:a6:9a:be:08:47:56:f8:8a:bc:74:42:85:6f:87'
    }

    validate_config(config)

    ai_vision_client = oci.ai_vision.AIServiceVisionClient(config)

    _, buffer = cv2.imencode('.jpg', image_array)
    image_data = base64.b64encode(buffer).decode('utf-8')

    analyze_image_response = ai_vision_client.analyze_image(
        analyze_image_details=AnalyzeImageDetails(
            features=[
                ImageTextDetectionFeature(
                    feature_type="TEXT_DETECTION"
                )
            ],
            image=InlineImageDetails(
                data=image_data
            ),
            compartment_id="ocid1.tenancy.oc1..aaaaaaaafnp4ykozv2ffag4h3mmsefi7jihsx6sfxwuw3jsk42fmsb2jmiva"
        )
    )

    return analyze_image_response.data

def preprocessing(image_array):
    img = image_array
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY_INV)
    blurred = cv2.medianBlur(thresh, 1)
    return blurred

def get_text_list_oci(img_arr):
    #processed = preprocessing(img_arr)
    analysis = analyze_img_oci(img_arr)
    texts = []
    for line in analysis.image_text.lines:
        text = line.text
        text = re.sub(r'[^a-zA-Z0-9]', '', text)
        texts.append(text)
    return texts

def is_text_present_oci(img_arr, text):
    text = re.sub(r'[^a-zA-Z0-9]', '', text)
    texts = get_text_list_oci(img_arr)
    print(texts)
    if text in texts:
        return True
    return False


app = Flask(__name__)
CORS(app)

@app.route('/check_image', methods=['POST'])
def upload_file():

    text = request.form.get('text')
    image_file = request.files.get('image')
    
    if image_file:
        image = Image.open(io.BytesIO(image_file.read()))
        np_img = np.array(image)
        isEqual = is_text_present_oci(img_arr=np_img, text=text)
        response = {
            'isEqual': isEqual
        }
    else:
        response = {
            'error': 'No se recibió ninguna imagen'
        }
    
    print(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=False, port=8080)