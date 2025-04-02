"use client";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Container } from "@mui/material";
import MainTable from "@/components/mainTable/MainTable";
import { getAppConfig } from "@/utils/getAppConfig";

export default function Home() {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    async function fetchConfigAndData() {
      try {
        const config = await getAppConfig();
        setAppConfig(config);
      } catch (error) {
        console.error("Erro ao obter as configurações da aplicação:", error);
      }
    }
    fetchConfigAndData();
  }, []);


  if (!appConfig) {
    return <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Ocupa 100% da altura da viewport
    }}>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box mt={8}>
      <Container>
        <MainTable
          apiUrl={appConfig.apiUrl}
          allTasksEndpoint={appConfig.getAllTasks}
          deleteTaskEndpoint={appConfig.deleteTask}
        />
      </Container>
    </Box>
  );
}
