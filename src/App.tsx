import Item from './interface/Item';
import Grid from '@mui/material/Grid2';
import './App.css';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  let [indicators, setIndicators] = useState<Indicator[]>([]);
  let [items, setItems] = useState<Item[]>([]); // Datos de la tabla

  const [selectedVariable, setSelectedVariable] = useState<string>("Precipitación"); // Variable seleccionada
  const [chartData, setChartData] = useState<number[]>([]); // Datos de la gráfica
  const [xLabels, setXLabels] = useState<string[]>([]); // Fechas de la gráfica

  const handleVariableChange = (variable: string) => {
    setSelectedVariable(variable); // Actualiza la variable seleccionada
  };

  useEffect(() => {
    const request = async () => {
      const API_KEY = "6e4d25d80f777aee491567f2de1118ba";
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
      const savedTextXML = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators: Indicator[] = [];
      let dataToItems: Item[] = [];
      let precipitation: number[] = [];
      let humidity: number[] = [];
      let clouds: number[] = [];
      let labels: string[] = [];

      // Información General
      let name = xml.getElementsByTagName("name")[0]?.innerHTML || "";
      dataToIndicators.push({ title: "Location", subtitle: "City", value: name });

      let location = xml.getElementsByTagName("location")[1];
      let latitude = location?.getAttribute("latitude") || "";
      let longitude = location?.getAttribute("longitude") || "";
      let altitude = location?.getAttribute("altitude") || "";

      dataToIndicators.push({ title: "Location", subtitle: "Latitude", value: latitude });
      dataToIndicators.push({ title: "Location", subtitle: "Longitude", value: longitude });
      dataToIndicators.push({ title: "Location", subtitle: "Altitude", value: altitude });
      
       // Obtener fechas de la semana actual (lunes a domingo)
    const today = new Date();
    const currentWeekDays: string[] = [];
    for (let i = 1; i <= 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - today.getDay() + i);
      currentWeekDays.push(day.toISOString().split("T")[0]);
    }


      // Procesamiento de datos de tiempo
      const timeNodes = xml.getElementsByTagName("time");
      for (let i = 0; i < Math.min(7, timeNodes.length); i++) {
        let timeNode = timeNodes[i];
        let dateStart = timeNode.getAttribute("from") || "";
        let dateEnd = timeNode.getAttribute("to") || "";

        // Manejo de formato de fecha y hora (validación)
        //let dateStartParts = dateStart.includes("T") ? dateStart.split("T") : ["", ""];
        //let dateEndParts = dateEnd.includes("T") ? dateEnd.split("T") : ["", ""];
        let precipitationNode = timeNode.querySelector("precipitation")?.getAttribute("probability") || "";
        let humidityNode = timeNode.querySelector("humidity")?.getAttribute("value") || "";
        let cloudsNode = timeNode.querySelector("clouds")?.getAttribute("all") || "";
        labels.push(dateStart.split("T")[0]); // Extraer la fecha
        precipitation.push(parseFloat(precipitationNode) * 100);
        humidity.push(parseInt(humidityNode));
        clouds.push(parseInt(cloudsNode));

        dataToItems.push({
          dateStart: dateStart.split("T")[0], // Fecha de inicio
          timeStart: dateStart.split("T")[1], // Hora de inicio
          dateEnd: dateEnd.split("T")[0],     // Fecha de fin (correcta)
          timeEnd: dateEnd.split("T")[1],     // Hora de fin (correcta)
          precipitation: precipitationNode,
          humidity: humidityNode,
          clouds: cloudsNode,
        });
      }
// Agrupar y promediar valores por día
let groupedData: { [key: string]: { precipitation: number[]; humidity: number[]; clouds: number[] } } = {};
labels.forEach((date, index) => {
  if (!groupedData[date]) {
    groupedData[date] = { precipitation: [], humidity: [], clouds: [] };
  }
  groupedData[date].precipitation.push(precipitation[index]);
  groupedData[date].humidity.push(humidity[index]);
  groupedData[date].clouds.push(clouds[index]);
});

let averagedData: number[] = [];
let uniqueLabels: string[] = currentWeekDays; // Días lunes a domingo

switch (selectedVariable) {
  case "Precipitación":
    averagedData = uniqueLabels.map(date => {
      let values = groupedData[date]?.precipitation || [0];
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    });
    break;
  case "Humedad":
    averagedData = uniqueLabels.map(date => {
      let values = groupedData[date]?.humidity || [0];
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    });
    break;
  case "Nubosidad":
    averagedData = uniqueLabels.map(date => {
      let values = groupedData[date]?.clouds || [0];
      return values.reduce((acc, val) => acc + val, 0) / values.length;
    });
    break;
}

// Actualizar estados
setIndicators(dataToIndicators);
setItems(dataToItems);
setChartData(averagedData);
setXLabels(uniqueLabels.map(date => new Date(date).toLocaleDateString('es-ES', { weekday: 'long' })));
};

request();
}, [selectedVariable]); 


  return (
    <Grid container spacing={5}>
      {/* Indicadores */}
      {indicators.map((indicator, idx) => (
        <Grid key={idx} size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather
            title={indicator.title}
            subtitle={indicator.subtitle}
            value={indicator.value}
          />
        </Grid>
      ))}

      {/* Tabla */}
      <Grid size={{ xs: 12, sm: 8 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <ControlWeather onVariableChange={handleVariableChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <TableWeather itemsIn={items} />
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <LineChartWeather variable={selectedVariable} data={chartData} labels={xLabels} />
      </Grid>
    </Grid>
  );
}

export default App;
