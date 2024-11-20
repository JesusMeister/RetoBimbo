import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const DataFramePlot = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('Mapa del almacen');
  const [plotData, setPlotData] = useState([]);
  const [clusteredData, setClusteredData] = useState([]);
  const [route, setRoute] = useState({});
  const [routeNumber, setRouteNumber] = useState(0);
  const [routeExists, setRouteExists] = useState(false);

  const fetchData = () => {
    const config = {
      method: 'GET',
      url: `http://localhost:8080/get_data`,
    };

    axios(config)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchClusteredData = (payload = null) => {
    const config = {
      method: 'POST',
      url: `http://localhost:8080/get_clustered_data`,
      data: payload,
    };

    axios(config)
      .then(response => {
        setClusteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchRoute = (payload = null) => {
    const config = {
      method: 'POST',
      url: `http://localhost:8080/get_best_route`,
      data: payload,
    };

    axios(config)
      .then(response => {
        setRoute(response.data);
        setRouteExists(true);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    const newPlotData = [{
      x: data.map(item => item.Rack),
      y: data.map(item => item.Columna),
      showlegend: true,
      type: 'scatter',
      mode: 'markers',
      name: '',
      marker: {
        color: data.map(item => item.Cantidad),
        colorscale: 'Viridis',
        size: 8,
        showscale: true,
        colorbar: {
          title: 'Cantidad',
          titleside: 'right'
        }
      },
    }];
    setPlotData(newPlotData);
  }, [data]);

  useEffect(() => {
    const colorPalette = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
    if (route.length > 0) {
      const trace = {
        x: route.map(item => item.Rack),
        y: route.map(item => item.Columna),
        name: `Mejor Ruta Grupo ${routeNumber}`,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
          color: 'red',
          size: 8
        }
      };
      setPlotData([...plotData, trace]);
    }
  }, [route]);

  useEffect(() => {
    const clusters = [...new Set(clusteredData.map(item => item.Cluster))];
    const colorPalette = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
    const newClusterPlotData = clusters.map((cluster, index) => {
      const newClusterData = clusteredData.filter(item => item.Cluster === cluster);
      return {
        x: newClusterData.map(item => item.Rack),
        y: newClusterData.map(item => item.Columna),
        showlegend: true,
        type: 'scatter',
        mode: 'markers',
        name: `Grupo ${cluster}`,
        marker: {
          color: colorPalette[index % colorPalette.length],
          size: 8,
          colorbar: false
        }
      };
    });
    setPlotData(newClusterPlotData);
  }, [clusteredData]);

  const handleGetData = () => {
    setTitle('Mapa del almacen');
    fetchData();
  };

  const handleGetClusteredData = () => {
    const n = prompt('¿Cuantas grupos necesitas?:');
    if (n) {
      setTitle(`Clustered Data (n=${n})`);
      fetchClusteredData({ n: parseInt(n) });
    }
  };

  const handleGetBestRoute = () => {
    const n = prompt('¿De que grupo buscas encontrar la mejor ruta?');
    if (n) {
      setRouteNumber(n);
      setTitle(`Best Route (n=${n})`);
      fetchRoute({ n: parseInt(n) });
    }
  };

  const ruta = (route) => {
    return route.map((item, index) => `${item.Rack}-${item.Columna}`).join(' -> ');
  }

  return (
    <div className="mx-auto p-4 w-full text-center mt-1">
      <div className="mb-4 flex flex-row font-bold justify-center">
        <button onClick={handleGetData} className="bg-blue-800 text-white rounded mr-2 p-2">Ver estado actual del almacen</button>
        <button onClick={handleGetClusteredData} className="bg-blue-800 text-white rounded mr-2 p-2">Agrupar</button>
        <button onClick={handleGetBestRoute} className="bg-blue-800 text-white rounded p-2">Encontrar mejor ruta</button>
      </div>
      <div>
      <Plot
        data={plotData} 
        layout={{ 'title': 'Mapa del almacén',
          width: '10%',
          config: {responsive: true},
          autosize: true,
          xaxis: {title: 'Rack'},
          yaxis: {title: 'Columna'}
         }}
      />
      </div>
      {routeExists && ruta(route)}
    </div>
  );
};

export default DataFramePlot;
