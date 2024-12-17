import React from "react";
import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {DateField, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {TradeService} from "../../service/trade.service";
import {tradeSocket} from "../../service/socket.service";
import {Stock} from "../stocks/stocks";
import "dayjs/locale/ru.js";

const tradeService: TradeService = new TradeService();
const socket = tradeSocket;

function Settings() {
    const [currentDate, setDate] = React.useState(new Date());
    const [stocks, setStocks] = React.useState([] as Stock[]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const date = formJson.date as string;
        const step = formJson.step as number;

        tradeService.startTrade(date, step);
    };

    const handleStop = () => {
        tradeService.stopTrade();
    };

    React.useEffect(() => {
        tradeService.getInfo()
            .then(data => {
                setDate(data.date);
                setStocks(data.stocks);
            });
    }, []);

    React.useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        function onUpdateTrade(data: { date: Date, stocks: Stock[] }) {
            setDate(data.date);
            setStocks(data.stocks);
        }

        socket.on("update-trade", onUpdateTrade);

        return () => {
            socket.off("update-trade", onUpdateTrade);
        };
    }, []);

    return (
        <main className='main'>
            <h2 style={{marginLeft: '50px'}}>Текущая дата торгов: {dayjs(currentDate).format('DD.MM.YYYY')}</h2>

            <Box component="form" onSubmit={handleSubmit}
                 sx={{display: 'flex', flexDirection: 'column', width: '30%', m: '0 auto'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                    <DateField label="Дата начала" format="DD.MM.YYYY" required name="date"
                               minDate={dayjs(currentDate)} maxDate={dayjs(currentDate).add(1, 'month')}/>
                </LocalizationProvider>
                <TextField label="Шаг в секундах" type="number" required name="step" margin="normal"/>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit">Начать торги</Button>
                    <Button variant="contained" onClick={handleStop}>Завершить торги</Button>
                </Stack>
            </Box>

            <TableContainer component={Paper}
                            sx={{width: '30%', m: '30px auto 0', minWidth: '200px', maxWidth: '500px'}}>
                <Table sx={{width: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Обозначение</TableCell>
                            <TableCell align="right">Текущая стоимость</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map(stock => (
                            <TableRow key={stock.symbol} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell align="right">{stock.symbol}</TableCell>
                                <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}

export default Settings;