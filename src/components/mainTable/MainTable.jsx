import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { Button, ButtonGroup } from '@mui/material';
import MessageSnackBar from '../messageSnackBar/MessageSnackBar';
import ModalForm from '../taskModalForm/TaskModalForm';




export default function MainTable({ apiUrl, allTasksEndpoint, deleteTaskEndpoint, updateTaskEndpoint, createTaskEndpoint }) {
    const [tableData, setTableData] = useState([]);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [messageSnackBar, setMessageSnackBar] = useState(null);
    const [typeSnackBar, setTypeSnackBar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTask, setModalTask] = useState(null);
    const [modalFormMode, setModalFormMode] = useState(null);

    const dayjs = require('dayjs');
    const paginationModel = { page: 0, pageSize: 15 };

    const columns = [
        { field: 'id', headerName: 'ID', width: 5 },
        { field: 'titulo', headerName: 'Título', width: 100 },
        { field: 'descricao', headerName: 'Descrição', width: 255 },
        {
            field: 'dataCriacao',
            headerName: 'Data de Criação',
            width: 200,
            valueGetter: (params) => `${dayjs(params).format('DD/MM/YYYY [às] HH:mm')}`
        },
        {
            field: 'dataConclusao',
            headerName: 'Data de Conclusão',
            width: 200,
            valueGetter: (params) => {
                if (params) {
                    return `${dayjs(params).format('DD/MM/YYYY [às] HH:mm')}`;
                } else {
                    return '-';
                }

            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => {
                let bgColor = '';
                if (params.value === 'Pendente') {
                    bgColor = '#e57373'; 
                } else if (params.value === 'Em Progresso') {
                    bgColor = '#ffeb3b'; 
                } else if (params.value === 'Concluída') {
                    bgColor = '#81c784'; 
                }
                const textColor = params.value === 'Em Progresso' ? 'black' : 'white';

                return (
                    <div
                        style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        {params.value}
                    </div>
                );
            }

        },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 250,
            renderCell: (params) => (
                <ButtonGroup variant="text" aria-label="Basic button group">
                    <Button color="error" onClick={() => handleClickDeleteButton(params.row.id)}>Deletar</Button>
                    <Button onClick={() => handleClickEditButton(params.row)}>Alterar</Button>
                </ButtonGroup>
            ),
        },
    ];

    async function handleClickDeleteButton(taskId) {
        try {
            const response = await fetch(apiUrl + deleteTaskEndpoint + `/${taskId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const message = await response.json();
                setShowSnackBar(true);
                setMessageSnackBar(message.message);
                setTypeSnackBar('error');
            }
            const message = await response.json();
            setShowSnackBar(true);
            setMessageSnackBar(message.message + ": " + message.detalhes);
            setTypeSnackBar('success');

            setTableData((prevData) => prevData.filter((item) => item.id !== taskId));
        } catch (error) {
            console.error('Erro:', error.message);
        }
    }


    async function getAllTasks() {
        try {
            const response = await fetch(apiUrl + allTasksEndpoint);

            if (!response.ok) {
                setError('Erro ao obter as tarefas!');
                return;
            }

            const data = await response.json();
            setTableData(data);
        } catch (error) {
            console.error('Erro:', error.message);
            setError(error.message);
        }
    }

    async function handleClickEditButton(params) {
        setShowModal(true);
        setModalTask(params);
        setModalFormMode('edit');
    }

    async function handleClickNewTaskButton() {
        setShowModal(true);
        setModalTask({});
        setModalFormMode('create');
    }

    useEffect(() => {
        getAllTasks();
    }, []);

    return (
        <>
            <Button variant='contained' color='success' sx={{ marginBottom: 2 }} onClick={() => handleClickNewTaskButton()}>Nova Tarefa</Button>
            <Paper sx={{ height: 800, width: '100%' }}>

                <DataGrid
                    rows={tableData}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 15, 30, 50]}
                    sx={{ border: 0 }}
                />
                {showSnackBar && (
                    <MessageSnackBar
                        message={messageSnackBar}
                        showSnackBar={showSnackBar}
                        type={typeSnackBar}
                        setShowSnackBar={setShowSnackBar}
                    />
                )}

                {showModal && (
                    <ModalForm
                        taskData={modalTask}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        setShowSnackBar={setShowSnackBar}
                        setMessageSnackBar={setMessageSnackBar}
                        setTypeSnackBar={setTypeSnackBar}
                        getAllTasks={getAllTasks}
                        apiUrl={apiUrl}
                        updateTaskEndpoint={updateTaskEndpoint}
                        createTaskEndpoint={createTaskEndpoint}
                        mode={modalFormMode}
                    />
                )}
            </Paper>
        </>
    );
}
