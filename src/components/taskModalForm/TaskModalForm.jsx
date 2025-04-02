import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function TaskModalForm({
  taskData = {},             
  mode,                     
  showModal,
  setShowModal,
  setShowSnackBar,
  setMessageSnackBar,
  setTypeSnackBar,
  getAllTasks,
  apiUrl,
  updateTaskEndpoint,       
  createTaskEndpoint       
}) {

  const initialValues = {
    titulo: taskData.titulo || "",
    descricao: taskData.descricao || "",
    status: taskData.status || "Pendente",
    dataCriacao: taskData.dataCriacao ? dayjs(taskData.dataCriacao) : dayjs(),
    dataConclusao: taskData.dataConclusao ? dayjs(taskData.dataConclusao) : null,
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (formData) => {
    let endpoint, method;
    if (mode === "edit") {
      endpoint = updateTaskEndpoint;
      method = "PUT";
      formData.id = taskData.id;
    } else {
      endpoint = createTaskEndpoint;
      method = "POST";
    }

    const payload = {
      ...formData,
      dataCriacao: formData.dataCriacao,
      dataConclusao: formData.dataConclusao,
    };

    try {
      const response = await fetch(apiUrl + endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const messageJSON = await response.json();
        setShowSnackBar(true);
        setMessageSnackBar(messageJSON.message + ": " + messageJSON.detalhes);
        setTypeSnackBar('error');
        return;
      }

      const messageJSON = await response.json();
      setShowSnackBar(true);
      setMessageSnackBar(messageJSON.message);
      setTypeSnackBar('success');
      getAllTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };

  return (
    <div>
          <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-task-title"
        aria-describedby="modal-task-description"
        sx={{ color: 'text.primary' }}
      >
        <Box sx={style}>
          <h2 id="modal-task-title">
            {mode === "edit" ? `Tarefa ${taskData.id}: ${taskData.titulo}` : "Criar Nova Tarefa"}
          </h2>
          <br />
          <TaskForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            buttonText={mode === "edit" ? "Salvar Alterações" : "Criar Tarefa"}
          />
        </Box>
      </Modal>
    </div>
  );
}

function TaskForm({ initialValues, onSubmit, buttonText }) {
  const [titulo, setTitulo] = useState(initialValues.titulo);
  const [descricao, setDescricao] = useState(initialValues.descricao);
  const [status, setStatus] = useState(initialValues.status);
  const [dataCriacao, setDataCriacao] = useState(initialValues.dataCriacao);
  const [dataConclusao, setDataConclusao] = useState(initialValues.dataConclusao);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      titulo,
      descricao,
      status,
      dataCriacao,
      dataConclusao,
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Título da Tarefa"
              variant="outlined"
              fullWidth
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Descrição"
              variant="outlined"
              fullWidth
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={"Pendente"}>Pendente</MenuItem>
                <MenuItem value={"Em Progresso"}>Em Progresso</MenuItem>
                <MenuItem value={"Concluída"}>Concluída</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Data de Criação"
                  value={dataCriacao ? dataCriacao : new Date()}
                  onChange={(newValue) => setDataCriacao(newValue)}
                  disabled
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Data de Conclusão"
                  value={dataConclusao}
                  onChange={(newValue) => setDataConclusao(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" mt={3}>
          <Button variant="contained" color="success" type="submit">
            {buttonText}
          </Button>
        </Grid>
      </Container>
    </form>
  );
}
