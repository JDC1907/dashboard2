import Paper from '@mui/material/Paper';
//import { LineChart } from '@mui/x-charts/LineChart';



export default function LineChartWeather() {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
            {/* <LineChart
                width={400}
                height={250}
                series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
            /> */}
        </Paper>
    );
}