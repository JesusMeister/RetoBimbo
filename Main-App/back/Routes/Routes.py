import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from flask import Flask, jsonify, request
from flask_cors import CORS

def rack_to_pos(rack_str):
    try:
        rack_num = ord(rack_str.upper()) - ord('A') + 1
        rack_num = 6*rack_num - 5
        return rack_num if rack_num >= 1 else 1
    except (AttributeError, TypeError):
      return 0

def rack_to_number(rack_str):
    try:
        rack_num = ord(rack_str.upper()) - ord('A') + 1
        return rack_num
    except (AttributeError, TypeError):
      return

np.random.seed(42)
num_rows = 120
data = {
    'Rack': [chr(np.random.randint(65, 91)) for _ in range(num_rows)],
    'Columna': np.random.randint(1, 53, size=num_rows),
    'Fila': np.random.randint(1, 4, size=num_rows),
    'Cantidad': np.random.randint(1, 100, size=num_rows),
}

df_2D = pd.DataFrame(data)
df_2D = df_2D.drop_duplicates(subset=['Rack', 'Columna'])
df_2D['Rack_pos'] = df_2D['Rack'].apply(rack_to_pos)
df_2D = df_2D[df_2D['Rack_pos'] != 0]
df_2D['Fila'] = df_2D['Fila'].astype(int)
df_2D['Rack_pos'] = df_2D['Rack_pos'].astype(int)
df_2D['Cluster'] = [0]*len(df_2D.index)
df_2D = df_2D.sort_values(by='Rack')


def cluster(n):

    X = df_2D[['Rack_pos', 'Columna']]
    
    agg_clustering = AgglomerativeClustering(n_clusters=n)
    agg_clustering.fit(X)

    labels = agg_clustering.labels_
    df_2D['Cluster'] = labels

import random
class AntColonyOptimization:
    def __init__(self, distances, n_ants, n_iterations, alpha=1, beta=1, rho=0.5, q=1):
        self.distances = distances
        self.n_ants = n_ants
        self.n_iterations = n_iterations
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.q = q
        self.pheromone = np.ones_like(distances) / len(distances)

    def run(self):
        best_path = None
        min_distance = float('inf')
        for _ in range(self.n_iterations):
            paths = []
            for _ in range(self.n_ants):
                path, distance = self.find_path()
                paths.append((path, distance))
                if distance < min_distance:
                    min_distance = distance
                    best_path = path
            self.update_pheromone(paths)
        return best_path

    def find_path(self):
        current_node = random.randint(0, len(self.distances) - 1)
        path = [current_node]
        visited = set([current_node])
        distance = 0
        while len(visited) < len(self.distances):
            probabilities = self.calculate_probabilities(current_node, visited)
            next_node = self.choose_next_node(probabilities)
            path.append(next_node)
            visited.add(next_node)
            distance += self.distances[current_node][next_node]
            current_node = next_node
        return path, distance

    def calculate_probabilities(self, current_node, visited):
        probabilities = []
        for next_node in range(len(self.distances)):
            if next_node not in visited:
                pheromone = self.pheromone[current_node][next_node]
                distance = self.distances[current_node][next_node]
                probability = (pheromone ** self.alpha) * ((1 / distance) ** self.beta)
                probabilities.append((next_node, probability))
        return probabilities

    def choose_next_node(self, probabilities):
        total_prob = sum([prob for _, prob in probabilities])
        random_value = random.uniform(0, total_prob)
        current_prob = 0
        for node, prob in probabilities:
            current_prob += prob
            if current_prob >= random_value:
                return node
        return probabilities[-1][0] 

    def update_pheromone(self, paths):
        self.pheromone *= (1 - self.rho)
        for path, distance in paths:
            for i in range(len(path) - 1):
                self.pheromone[path[i]][path[i+1]] += self.q / distance

def get_best_route(n):
    cluster_n_df = df_2D[df_2D['Cluster'] == n]
    coordinates = cluster_n_df[['Rack_pos', 'Columna']].values

    distances = np.zeros((len(coordinates), len(coordinates)))
    for i in range(len(coordinates)):
        for j in range(i + 1, len(coordinates)):
            distance = np.linalg.norm(coordinates[i] - coordinates[j])
            distances[i, j] = distances[j, i] = distance

    aco = AntColonyOptimization(distances, n_ants=10, n_iterations=100)
    best_path = aco.run()

    route = cluster_n_df.iloc[best_path][['Rack', 'Columna']].values

    data = [{'Index': index, 'Rack': item[0], 'Columna': item[1]} for index, item in enumerate(route)]

    return data


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

if __name__ == '__main__':
    app.run(debug=False, port=8080)