import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Slider from './Slider';

const DataFramePlot = () => {
  const [data, setData] = useState([]);
  const [plotData, setPlotData] = useState([]);
  const [clusteredData, setClusteredData] = useState([]);
  const [clusterQuantities, setClusterQuantities] = useState({});
  const [route, setRoute] = useState({});
  const [routeNumber, setRouteNumber] = useState(0);
  const [clusterNumber, setClusterNumber] = useState(1);
  const [needRouteNumber, setNeedRouteNumber] = useState(false);
  const [needClutserNumber, setNeedClusterNumber] = useState(false);

  const fetchData = () => {
    const config = {
      method: 'GET',
      url: `http://localhost:8080/get_data`,
    };

    axios(config)
      .then(response => {
        setData(response.data);
        setRoute({});
        setClusterQuantities({});
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
        setClusteredData(response.data.data);
        setClusterQuantities(response.data.quantities);
        setRoute({});
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
      setPlotData([...plotData.slice(0, -1), trace]);
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
    fetchData();
  };
  
  const handleGetClusteredData = (clusterNumber) => {
    if (clusterNumber) {
      setClusterNumber(clusterNumber);
      fetchClusteredData({ n: parseInt(clusterNumber) });}
      setNeedClusterNumber(false);
  };

  const handleGetBestRoute = (routeNumber) => {
    if (routeNumber) {
      setRouteNumber(routeNumber);
      fetchRoute({ n: parseInt(routeNumber) });
      setNeedRouteNumber(false);
    }
  };

  const clusterNumberSlider = () => {
    return <Slider min={1} max={data.length} title={"¿Cuantas personas van a realizar el conteo?"} onAccept={handleGetClusteredData}></Slider>
  }

  const routeNumberSlider = () => {
    return <Slider min={1} max={clusterQuantities.length} title={"¿De que grupo te gustaría encontrar la ruta más corta?"} onAccept={handleGetBestRoute}></Slider>
  }

  const table = (data) => {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cantidad total por grupo</h1>
        <div className="overflow-auto max-h-64">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 border">Cantidad</th>
                <th className="px-4 py-2 text-left text-gray-700 border">Grupo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{row.Cantidad}</td>
                  <td className="px-4 py-2 border">{row.Cluster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };  

  const Recorrido = (recorridoData) => {
    return (
      <div className="flex flex-col items-center h-96 w-36 overflow-y-auto rounded-lg">
        <h1 className='font-bold p-4'>Recorrido para grupo {routeNumber}</h1>
        {recorridoData.map((location, index) => (
          <div key={location.Index} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div
                className='w-8 h-8 rounded-full text-white flex items-center justify-center font-bold bg-green-500'>
                {location.Rack}
              </div>
              {index !== recorridoData.length - 1 && (
                <div className="h-8 w-1 bg-gray-300"></div>
              )}
            </div>
            <div className="text-gray-700">
              <p className="text-sm font-semibold">Rack: {location.Rack}</p>
              <p className="text-xs font-semibold">Columna: {location.Columna}</p>
              <p className='text-xs font-semibold'>Cantidad: {location.Cantidad}</p>
              <p></p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto p-4 w-full text-center mt-1">
      {needClutserNumber && clusterNumberSlider()}
      {needRouteNumber && routeNumberSlider()}
      <div className="mb-4 flex flex-row font-bold justify-center">
        <button onClick={handleGetData} className="m-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-600 font-bold shadow-md">Ver estado actual del almacen</button>
        <button onClick={() => {setNeedClusterNumber(true)}} className="m-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-600 transition duration-300 font-bold shadow-md">Agrupar</button>
        <button onClick={() => {setNeedRouteNumber(true)}} className="m-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-600 transition duration-300 font-bold shadow-md">Encontrar mejor ruta</button>
      </div>
      <div className="flex flex-row justify-evenly">
        <div className="flex-shrink-0">
          <Plot
            data={plotData} 
            layout={{
              title: 'Mapa del almacén',
              width: '100%',
              config: { responsive: true },
              autosize: true,
              xaxis: { title: 'Rack' },
              yaxis: { title: 'Columna' }
            }}
          />
        </div>
        {route.length > 0 && (
        <div className="flex-grow">
          {Recorrido(route)}
        </div>
      )}
    </div>
      {clusterQuantities.length > 0 && table(clusterQuantities)}
    </div>
  );
};

export default DataFramePlot;
