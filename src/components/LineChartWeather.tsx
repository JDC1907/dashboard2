import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LineChartWeatherProps {
  variable: string;
  data: number[];
  labels: string[];
}

export default function LineChartWeather({ variable, data, labels }: LineChartWeatherProps) {
  const maxValue = Math.max(...data, 0) + 10; // Ajuste dinámico del eje Y
  const lastDays = labels.slice(-3); // Últimos 3 días

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" align="center">Última semana</Typography>
      <LineChart
        width={700}
        height={300}
        series={[
          { data: data, label: variable, color: "#8884d8", area: true, curve: "monotoneX" }
        ]}
        xAxis={[{ scaleType: 'point', data: labels }]}
        yAxis={[{ min: 0, max: maxValue, label: `${variable} (%)` }]}
        grid={{ vertical: true, horizontal: true }}
      />
      {/* Recuadros de los últimos días */}
      <Box display="flex" justifyContent="space-around" mt={2}>
        {lastDays.map((day, index) => (
          <Paper key={index} sx={{ p: 2, textAlign: "center", width: "100px" }}>
            <Typography variant="body1" fontWeight="bold">{new Date(day).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</Typography>
            <Typography variant="h6" color="primary">{data[data.length - 3 + index]}%</Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
