export async function getAppConfig() {
    try {
        const response = await fetch('/config.json');
        if (!response.ok) {
            console.log('Erro ao obter as configurações da aplicação.');
        }
        const config = await response.json();
        return config;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}