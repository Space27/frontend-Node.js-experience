import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import {BrokerService} from "../../service/broker.service";
import {brokerSocket} from "../../service/socket.service";

export interface Broker {
    id: number;
    name: string;
    balance: number;
}

const brokerService: BrokerService = new BrokerService();
const socket = brokerSocket;

function Brokers() {
    const [brokers, setBrokers] = React.useState([] as Broker[]);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [broker, setBroker] = React.useState({} as Broker);

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const handleOpenEdit = (broker: Broker) => {
        setBroker(broker);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const name = formJson.name as string;
        const balance = formJson.balance as number;

        brokerService.addBroker(name, balance)
            .then(handleCloseAdd);
    };

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>, id: number) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const balance = formJson.balance as number;

        brokerService.updateBroker(id, balance)
            .then(handleCloseEdit);
    };

    const handleDelete = (broker: Broker) => {
        if (window.confirm(`Вы точно хотите удалить брокера ${broker.name}?`)) {
            brokerService.deleteBroker(broker.id);
        }
    }

    React.useEffect(() => {
        brokerService.getBrokers()
            .then(data => setBrokers(data));
    }, []);

    React.useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        function onUpdateBrokers(brokers: Broker[]) {
            setBrokers(brokers);
        }

        socket.on("update-brokers", onUpdateBrokers);

        return () => {
            socket.off("update-brokers", onUpdateBrokers);
        };
    }, []);

    return (
        <main className='main'>
            <TableContainer component={Paper} sx={{width: '30%', m: '0 auto', minWidth: '500px', maxWidth: '500px'}}>
                <Table sx={{width: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Имя</TableCell>
                            <TableCell align="right">Баланс</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={handleOpenAdd}><AddIcon/></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brokers.map(broker => (
                            <TableRow key={broker.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">{broker.id}</TableCell>
                                <TableCell align="right">{broker.name}</TableCell>
                                <TableCell align="right">{broker.balance.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end"}}>
                                        <IconButton onClick={() => handleDelete(broker)}><DeleteIcon/></IconButton>
                                        <IconButton onClick={() => handleOpenEdit(broker)}><EditIcon/></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openAdd} onClose={handleCloseAdd} PaperProps={{component: 'form', onSubmit: handleAddSubmit}}>
                <DialogTitle>Добавить брокера</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <TextField label="Имя" variant="filled" required name="name"/>
                    <TextField label="Баланс" variant="filled" type="number" required
                               name="balance" margin="dense"/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseAdd}>Закрыть</Button>
                    <Button variant="contained" type="submit">Добавить</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEdit} onClose={handleCloseEdit}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (e: React.FormEvent<HTMLFormElement>) => handleEditSubmit(e, broker.id)
                    }}>
                <DialogTitle>Изменить баланс брокера</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                    <TextField label="Новый баланс" variant="filled" defaultValue={broker?.balance?.toFixed(0)}
                               name="balance"
                               type="number"
                               required/>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseEdit}>Закрыть</Button>
                    <Button variant="contained" type="submit">Изменить</Button>
                </DialogActions>
            </Dialog>
        </main>
    )
}

export default Brokers;