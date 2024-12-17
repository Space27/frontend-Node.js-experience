import React from "react";
import {
    Checkbox,
    Dialog, DialogContent, DialogTitle,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {Chart, registerables} from 'chart.js';
import {Line} from "react-chartjs-2";
import {StocksService} from "../../service/stocks.service";
import {stocksSocket} from "../../service/socket.service";
import dayjs from "dayjs";

Chart.register(...registerables);

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    isTrade: boolean;
}

export interface StockDataElement {
    date: string;
    price: number;
}

const stocksService: StocksService = new StocksService();
const socket = stocksSocket;

function Stocks() {
    const [stocks, setStocks] = React.useState([] as Stock[]);

    const [stock, setStock] = React.useState({symbol: '', data: [] as StockDataElement[]});

    const [openTable, setOpenTable] = React.useState(false);
    const [openChart, setOpenChart] = React.useState(false);

    const handleOpenTable = (symbol: string) => {
        if (symbol && stock.symbol !== symbol)
            stocksService.getStockHistory(symbol)
                .then(data => {
                    setStock({symbol, data});
                    setOpenTable(true);
                });
        else
            setOpenTable(true);
    }
    const handleOpenChart = (symbol: string) => {
        if (symbol && stock.symbol !== symbol)
            stocksService.getStockHistory(symbol)
                .then(data => {
                    setStock({symbol, data});
                    setOpenChart(true);
                });
        else
            setOpenChart(true);
    }

    const handleCloseTable = () => setOpenTable(false);
    const handleCloseChart = () => setOpenChart(false);

    const handleStock = (stock: Stock) => {
        stock.isTrade = !stock.isTrade;
        stocksService.setStockTrade(stock.symbol, stock.isTrade);
    };

    React.useEffect(() => {
        stocksService.getStocks()
            .then(data => setStocks(data));
    }, []);

    React.useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        function onUpdateStocks(stocks: Stock[]) {
            setStocks(stocks);
        }

        function onUpdateStockHistory() {
            const oldStock = stock.symbol;

            if ((openChart || openTable) && stock.symbol && stock.symbol === oldStock) {
                stocksService.getStockHistory(stock.symbol)
                    .then(data => {
                        if ((openChart || openTable) && oldStock === stock.symbol)
                            setStock({symbol: stock.symbol, data});
                    });
            }
        }

        socket.on("update-stocks", onUpdateStocks);
        socket.on("update-stocks-history", onUpdateStockHistory);

        return () => {
            socket.off("update-stocks", onUpdateStocks);
            socket.off("update-stocks-history", onUpdateStockHistory);
        };
    }, [openTable, openChart, stock]);

    return (
        <main className='main'>
            <TableContainer component={Paper} sx={{width: '40%', m: '0 auto', minWidth: '600px', maxWidth: '800px'}}>
                <Table sx={{width: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right">Обозначение</TableCell>
                            <TableCell align="right">Название компании</TableCell>
                            <TableCell align="right">Текущая стоимость</TableCell>
                            <TableCell align="right">История</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map(stock => (
                            <TableRow key={stock.symbol} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    <Checkbox checked={stock.isTrade} onClick={() => handleStock(stock)}/>
                                </TableCell>
                                <TableCell align="right">{stock.symbol}</TableCell>
                                <TableCell align="right">{stock.name}</TableCell>
                                <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end"}}>
                                        <IconButton
                                            onClick={() => handleOpenChart(stock.symbol)}><ShowChartIcon/></IconButton>
                                        <IconButton
                                            onClick={() => handleOpenTable(stock.symbol)}><TextSnippetIcon/></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openTable} onClose={handleCloseTable}>
                <DialogTitle>Исторические данные для {stock.symbol}</DialogTitle>
                <DialogContent sx={{maxHeight: '600px', width: '400px', overflowY: 'scrollable'}}>
                    <TableContainer component={Paper} sx={{m: '0 auto'}}>
                        <Table sx={{width: '100%'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Дата</TableCell>
                                    <TableCell align="right">Стоимость</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stock.data.map(stockDataElement => (
                                    <TableRow key={dayjs(stockDataElement.date).format('DD.MM.YYYY')}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell
                                            align="right">{dayjs(stockDataElement.date).format('DD.MM.YYYY')}</TableCell>
                                        <TableCell align="right">{stockDataElement.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            <Dialog open={openChart} onClose={handleCloseChart} fullWidth maxWidth='lg'>
                <DialogTitle>Исторические данные для {stock.symbol}</DialogTitle>
                <DialogContent>
                    <Line data={formatStockData(stock.data, stock.symbol)} width="1000px" height="600px" options={{
                        maintainAspectRatio: false,
                        aspectRatio: 1
                    }}></Line>
                </DialogContent>
            </Dialog>
        </main>
    )
}

function formatStockData(stockData: StockDataElement[], symbol: string) {
    return {
        labels: stockData.map(el => dayjs(el.date).format('DD.MM.YYYY')).reverse(),
        datasets: [{
            label: symbol,
            data: stockData.map(el => Number(el.price.toFixed(2))).reverse(),
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)'
        }]
    };
}

export default Stocks;