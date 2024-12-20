import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

// Crear la interfaz MyProp
interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {
  // Crear la variable de estado y función de actualización
  const [rows, setRows] = useState<Item[]>([]);

  // useEffect que actualiza la variable de estado con props.itemsIn
  useEffect(() => {
    setRows(props.itemsIn);
  }, [props.itemsIn]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* Cambiar nombres de las cabeceras */}
            <TableCell>Fecha de inicio</TableCell>
            <TableCell align="right">Hora de inicio</TableCell>
            <TableCell align="right">Fecha de fin</TableCell>
            <TableCell align="right">Hora de fin</TableCell>
            <TableCell align="right">Precipitación</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Iterar en la variable de estado rows */}
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateStart} {/* Fecha de inicio */}
              </TableCell>
              <TableCell align="right">
                {row.timeStart || "00:00"} {/* Hora de inicio */}
              </TableCell>
              <TableCell align="right">
                {row.dateEnd} {/* Fecha de fin */}
              </TableCell>
              <TableCell align="right">
                {row.timeEnd || "00:00"} {/* Hora de fin */}
              </TableCell>
              <TableCell align="right">
                {row.precipitation || "0"}
              </TableCell>
              <TableCell align="right">
                {row.humidity || "0"}
              </TableCell>
              <TableCell align="right">
                {row.clouds || "0"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
