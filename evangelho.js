// Função para formatar o Salmo
function formatarSalmo(salmo) {
    if (!salmo.referencia || !salmo.texto) {
        return '<div class="leitura"><h3>Salmo Responsorial</h3><p>Informações do salmo não disponíveis.</p></div>';
    }

    // Dividir o texto do salmo em linhas
    const linhas = salmo.texto.split('\n');

    // Identificar o refrão (se existir na API)
    const refrao = salmo.refrao || linhas[0]; // Usar o refrão da API, se disponível

    // Juntar todas as linhas do texto do salmo
    const textoSalmo = linhas.join('<br>'); // Usar <br> para quebra de linha no HTML

    return `
      <div class="leitura">
        <h3>${salmo.titulo || 'Salmo Responsorial'}</h3>
        <p>Referência: ${salmo.referencia}</p>
        <p><strong>Refrão:</strong> ${refrao}</p> <!-- Exibir o refrão -->
        <p>${textoSalmo}</p> <!-- Exibir todo o texto do Salmo -->
      </div>
    `;
}

// Função assíncrona para carregar a liturgia
async function carregarLiturgia() {
    try {
        // Fazendo a requisição para a API
        const response = await fetch('https://liturgia.up.railway.app/v2/');
        if (!response.ok) {
            throw new Error('Erro na requisição da API');
        }

        const data = await response.json();
        console.log('Dados recebidos da API:', data);

        // Extraindo os dados da API
        const dataLiturgia = data.data || 'Não disponível';
        const cor = data.cor || 'Não disponível';
        const antifonas = data.antifonas || {};
        const oracoes = data.oracoes || {};
        const primeiraLeitura = data.leituras?.primeiraLeitura?.[0] || {};
        const segundaLeitura = data.leituras?.segundaLeitura?.[0] || null;
        const salmo = data.leituras?.salmo?.[0] || {};
        const evangelho = data.leituras?.evangelho?.[0] || {};

        // Atualizando o conteúdo da página
        const container = document.getElementById('evangelho-container');
        if (!container) {
            console.error('Erro: O elemento #evangelho-container não foi encontrado no DOM.');
            return;
        }

        container.innerHTML = `
            <h2 class="section-title">Liturgia do Dia</h2>
            <p><strong>Data:</strong> ${dataLiturgia}</p>
            <p><strong>Cor Litúrgica:</strong> ${cor}</p>

            <h2 class="section-title">Antífonas</h2>
            <p><strong>Entrada:</strong> ${antifonas.entrada || 'Não disponível'}</p>
            <p><strong>Oração Coleta:</strong> ${oracoes.coleta || 'Não disponível'}</p>

            <h2 class="section-title">Liturgia da Palavra</h2>

            <!-- Primeira Leitura -->
            <div class="leitura">
                <h3>${primeiraLeitura.titulo || 'Primeira Leitura'}</h3>
                <p><strong>Referência:</strong> ${primeiraLeitura.referencia || 'Não disponível'}</p>
                <p>${primeiraLeitura.texto || 'Texto não disponível'}</p>
            </div>

            <!-- Salmo Responsorial -->
            ${formatarSalmo(salmo)}

            <!-- Segunda Leitura (aparece apenas se houver dados) -->
            ${segundaLeitura ? `
                <div class="leitura">
                    <h3>${segundaLeitura.titulo || 'Segunda Leitura'}</h3>
                    <p><strong>Referência:</strong> ${segundaLeitura.referencia || 'Não disponível'}</p>
                    <p>${segundaLeitura.texto || 'Texto não disponível'}</p>
                </div>
            ` : ''}

            <!-- Evangelho -->
            <div class="leitura">
                <h3>${evangelho.titulo || 'Evangelho'}</h3>
                <p><strong>Referência:</strong> ${evangelho.referencia || 'Não disponível'}</p>
                <p>${evangelho.texto || 'Texto não disponível'}</p>
            </div>

            <h2 class="section-title">Orações</h2>
            <p><strong>Oração da Comunhão:</strong> ${oracoes.comunhao || 'Não disponível'}</p>

            <h2 class="section-title">Antífona de Comunhão</h2>
            <p>${antifonas.comunhao || 'Não disponível'}</p>
        `;
    } catch (error) {
        console.error('Erro ao carregar a liturgia:', error);

        const container = document.getElementById('evangelho-container');
        if (container) {
            container.innerHTML = `
                <p>Erro ao carregar a liturgia do dia. Tente novamente mais tarde.</p>
            `;
        }
    }
}

// Chama a função para carregar a liturgia
carregarLiturgia();
