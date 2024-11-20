from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
from Routes.Routes import cluster, df_2D, get_best_route
from AgentModel.DataAgent import DataAgent, df
from VisionModel.Vision import is_text_present_oci

app = Flask(__name__)
CORS(app)

@app.route('/get_data', methods=['GET'])
def get_dataframe():
    return jsonify(df_2D.to_dict(orient='records'))

@app.route('/get_clustered_data', methods=['POST'])
def post_get_clustered_dataframe():
    data = request.get_json()
    n = data.get('n')
    n = int(n)
    cluster(n)
    return jsonify(df_2D.to_dict(orient='records'))

@app.route('/get_best_route', methods=['POST'])
def post_tuples():
    data = request.get_json()
    n = data.get('n')
    n = int(n)
    res = get_best_route(n)
    return jsonify(res)

da = DataAgent(df)

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    print(data)
    question = data.get('question')
    
    answer = da.ask_question(question)
    
    return jsonify({'answer': answer})

@app.route('/reset_memory', methods=['GET'])
def reset_memory():
    da.reset_memory()
    return jsonify({'result': 'memory_reset'})

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