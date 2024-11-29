
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_groq import ChatGroq
import pandas as pd
from sqlalchemy import create_engine, inspect, text
import re
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

class Memory:
    def __init__(self) -> None:
        self.memory = []
    
    def add(self, new_memory):
        self.memory.append(new_memory)

        if len(self.memory) > 2:
            self.memory.pop(0)

class DataAgent:
    def __init__(self, df) -> None:

        model_name = 'llama3.2'
        groq_model_name = 'llama-3.1-70b-versatile'
        self.df = df

        engine = create_engine('sqlite:///bimbo.db')
        df.to_sql('almacen', con=engine, if_exists='replace', index=False)

        inspector = inspect(engine)
        esquema = inspector.get_columns('almacen')

        self.schema = []
        for columna in esquema:
            self.schema.append(f"Nombre de columna: {columna['name']} - Tipo: {columna['type']}")

        self.sql_memory = Memory()

        #self.sql_llm = OllamaLLM(model=model_name, temperature=0)

        self.sql_llm = ChatGroq(
            api_key=os.getenv('GROQ_API_KEY'),
            model=groq_model_name,
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2
        )

        self.sql_template = """
        Esquema de la tabla: {schema}
        Nombre de la tabla: almacen
        Historial de conversación: {memory}
        Pregunta: {question}
        Instrucciones: Por favor, proporciona solamente la consulta SQL necesaria para resolver la pregunta basada 
        en el esquema de la base de datos proporcionada. No des ninguna explicación, solamente la consulta
        necesaria para resolver la pregunta.
        Consulta SQL:
        """
        self.sql_prompt = ChatPromptTemplate.from_template(self.sql_template)
        self.sql_chain = self.sql_prompt | self.sql_llm

        self.humanize_memory = Memory()

        #self.humanize_llm = OllamaLLM(model=model_name, temperature=0)

        self.humanize_llm = ChatGroq(
            api_key=os.getenv('GROQ_API_KEY'),
            model=groq_model_name,
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2
        )

        self.humanize_template = """
        Resultado: {result}
        Esquema de la base de datos: {schema}
        Instrucciones: Previamente, se calculó el resultado a una pregunta sobre una base de datos con el esquema proporcionado. 
        Eres un asistente digital amigable llamado Bimbot, tu trabajo es darle un formato humano al resultado.
        Responde solamente basandote en el resultado obtenido.
        Por favor, escribe como un humano lo haría para responder la pregunta hecha previamente, basandote en el resultado obtenido.
        Contesta siempre en español.
        Historial de conversación: {memory}
        Pregunta: {question}
        Respuesta:
        """
        self.humanize_prompt = ChatPromptTemplate.from_template(self.humanize_template)
        self.humanize_chain = self.humanize_prompt | self.humanize_llm
    
    def reset_memory(self):
        self.memory = Memory()

    def add_to_memory(self, question, human_result, sql_result):
        self.sql_memory.add(f'Pregunta: {question}, Respuesta: {sql_result}')
        self.humanize_memory.add(f'Pregunta: {question}, Respuesta: {human_result}')

    def get_code(self, question):
        res = self.sql_chain.invoke({            
            'schema': self.schema,
            'question': question,
            'memory': self.sql_memory.memory
        })
        return res
    
    def get_result(self, code):
        try:
            engine = create_engine('sqlite:///bimbo.db')
            query = text(code)
            with engine.connect() as connection:
                result = connection.execute(query)
                df_result = pd.DataFrame(result.fetchall(), columns=result.keys())
            return f'{df_result}'

        except Exception as e:
            return f'Ocurrió un error al ejecutar el codigo: {e} | Intentar otra instrucción'
    
    def humanize_result(self, question, result):
        res = self.humanize_chain.invoke({
            'question': question,
            'result': result,
            'schema': self.schema,
            'memory': self.humanize_memory.memory
        })
        return res
    
    def ask_question(self, question):
        code = self.get_code(question)
        code = code.content
        code = re.sub(r'\\', '', code)
        result = self.get_result(code)
        human_result = self.humanize_result(question, result)
        self.add_to_memory(question, human_result, result)
        return human_result.content

path = 'Utils/CC.xlsx'
x = pd.read_excel(path)
x = x[x['Descripcion de articulo'].notnull()]
articulos = x['Descripcion de articulo'].unique()

np.random.seed(42)
num_rows = 250
data = {
    'Rack': [chr(np.random.randint(65, 91)) for _ in range(num_rows)],
    'Columna': np.random.randint(1, 53, size=num_rows),
    'Fila': np.random.randint(1, 4, size=num_rows),
    'Cantidad': np.random.randint(1, 49, size=num_rows),
    'Descripcion_del_articulo': np.random.choice(articulos, size=num_rows)
}
df = pd.DataFrame(data)

def rack_to_number(rack_str):
    try:
        n = ord(rack_str.upper()) - ord('A') + 1
        return n
    except (AttributeError, TypeError):
      return

df = df.drop_duplicates(subset=['Rack', 'Columna'])
df['n'] = df['Rack'].apply(rack_to_number)
df = df[df['n'] != 0]
df['Fila'] = df['Fila'].astype(int)
df['n'] = df['n'].astype(int)
df['Ubicacion'] = df['Rack'] + "-" + df['n'].astype(str) + "-" + df['Columna'].astype(str) + "-" + df['Fila'].astype(str)

app = Flask(__name__)
CORS(app)


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

if __name__ == '__main__':
    app.run(debug=False, port=8080)