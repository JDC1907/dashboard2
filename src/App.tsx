import Item from './interface/Item'; // Importar la interfaz Item
// Grid version 2
import Grid from '@mui/material/Grid2';
import './App.css';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';

//import { useEffect } from 'react';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([]);
  let [items, setItems] = useState<Item[]>([]); // Variable de estado añadida

  {/* Hook: useEffect */ }
  useEffect(() => {

    let request = async () => {

      {/* Request */ }
      let API_KEY = "6e4d25d80f777aee491567f2de1118ba";
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
      let savedTextXML = await response.text();

      {/* XML Parser */ }
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      {/* Arreglo para agregar los resultados */ }
      let dataToIndicators: Indicator[] = new Array<Indicator>();
      let dataToItems: Item[] = []; // Arreglo temporal añadido

      {/* 
            Análisis, extracción y almacenamiento del contenido del XML 
            en el arreglo de resultados
        */}

      let name = xml.getElementsByTagName("name")[0].innerHTML || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name });

      let location = xml.getElementsByTagName("location")[1];

      let latitude = location.getAttribute("latitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude });

      let longitude = location.getAttribute("longitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude });

      let altitude = location.getAttribute("altitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude });

      // Extraer datos del XML y almacenarlos en dataToItems
      let timeNodes = xml.getElementsByTagName("time");
      for (let i = 0; i < Math.min(6, timeNodes.length); i++) {
        let timeNode = timeNodes[i];

        let dateStart = timeNode.getAttribute("from") || "";
        let dateEnd = timeNode.getAttribute("to") || "";

        let precipitationNode = timeNode.querySelector("precipitation");
        let precipitation = precipitationNode?.getAttribute("probability") || "";

        let humidityNode = timeNode.querySelector("humidity");
        let humidity = humidityNode?.getAttribute("value") || "";

        let cloudsNode = timeNode.querySelector("clouds");
        let clouds = cloudsNode?.getAttribute("all") || "";

        // Crear objeto de tipo Item y agregarlo al arreglo temporal
        dataToItems.push({ dateStart, dateEnd, precipitation, humidity, clouds });
      }

      {/* Modificación de la variable de estado mediante la función de actualización */ }
      setIndicators(dataToIndicators);
      setItems(dataToItems); // Actualizar estado con los datos procesados
    };

    request();
  }, []);

  return (
    <Grid container spacing={5}>
      {/* Indicadores */}
      {
        indicators
          .map(
            (indicator, idx) => (
              <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                <IndicatorWeather
                  title={indicator["title"]}
                  subtitle={indicator["subtitle"]}
                  value={indicator["value"]} />
              </Grid>
            )
          )
      }


      {/* Tabla */}
      <Grid size={{ xs: 12, sm: 9 }}>


        {/* Grid Anidado */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
          <TableWeather itemsIn={items} />
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, sm: 7 }}>

          <LineChartWeather />
        </Grid>

      </Grid>
    </Grid >
  );
}

export default App;
