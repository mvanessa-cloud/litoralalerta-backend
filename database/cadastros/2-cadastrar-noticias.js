import "dotenv/config";

import { prisma } from '../../lib/prisma.js';

// Usuário seed: assumindo que já existe um usuário com id=1 (admin/redação)
const USUARIO_ID = 2;

const noticias = [
    {
        slug: "chuvas-causam-alagamentos-caraguatatuba",
        tipo: "noticia",
        fotoCapa: "fotos/chuva-caraguatatuba-01.jpg",
        resumo:
            "Fortes chuvas atingem Caraguatatuba e deixam bairros alagados na madrugada de sábado. Defesa Civil emite alerta de risco alto.",
        conteudo: `
      <p>Na madrugada deste sábado, Caraguatatuba foi atingida por um volume excepcional de chuvas que ultrapassou 120 mm em menos de seis horas, causando alagamentos em diversos bairros da cidade. A Defesa Civil Municipal emitiu alerta de risco alto e mobilizou equipes para atendimento às famílias afetadas.</p>
      <p>Os bairros mais atingidos foram Martim de Sá, Indaiá e Porto Novo, onde o nível da água chegou a ultrapassar um metro em algumas ruas. Moradores foram orientados a se deslocar para abrigos temporários montados em escolas municipais.</p>
      <p>Segundo o Corpo de Bombeiros, ao menos 40 famílias precisaram ser removidas de suas residências. Não há registro de vítimas fatais até o momento. A prefeitura decretou situação de emergência e solicitou apoio do Governo do Estado.</p>
      <p>As chuvas devem continuar ao longo do fim de semana, segundo o Centro de Previsão de Tempo e Estudos Climáticos (Cptec/Inpe). A população é orientada a evitar áreas de risco e encostas.</p>
    `,
    },
    {
        slug: "deslizamento-morro-ubatuba-deixa-familias-desabrigadas",
        tipo: "noticia",
        fotoCapa: "fotos/deslizamento-ubatuba-01.jpg",
        resumo:
            "Deslizamento de terra em morro de Ubatuba destrói três casas e deixa 12 pessoas desabrigadas após noite de chuvas intensas.",
        conteudo: `
      <p>Um deslizamento de terra ocorrido na noite de quinta-feira destruiu três residências no Morro do Perequê, em Ubatuba, deixando 12 pessoas desabrigadas. O incidente ocorreu após mais de oito horas seguidas de chuva intensa na região.</p>
      <p>Equipes do Corpo de Bombeiros e da Defesa Civil trabalharam durante toda a madrugada no local. Por sorte, os moradores conseguiram sair a tempo após receberem o alerta das sirenes instaladas pela prefeitura no ano passado.</p>
      <p>"Ouvi a sirene e saí correndo com minha família. Minutos depois, a casa estava soterrada", relatou um dos moradores, que prefere não se identificar.</p>
      <p>As famílias desabrigadas foram encaminhadas para um abrigo municipal. A prefeitura de Ubatuba informou que está avaliando os danos e que as famílias receberão apoio com auxílio emergencial habitacional.</p>
      <p>A Defesa Civil estadual recomenda que moradores de áreas de encosta fiquem atentos às sirenes e saiam imediatamente ao ouvir o sinal.</p>
    `,
    },
    {
        slug: "enchente-rio-juqueriquerê-caraguatatuba",
        tipo: "noticia",
        fotoCapa: "fotos/enchente-rio-caraguatatuba-01.jpg",
        resumo:
            "Rio Juqueriquerê transborda após chuvas e água invade residências no centro de Caraguatatuba. Trânsito é bloqueado em avenida principal.",
        conteudo: `
      <p>O Rio Juqueriquerê transbordou na tarde desta quarta-feira após um acumulado de chuvas superior a 90 mm nas últimas 24 horas. A água invadiu residências e estabelecimentos comerciais nas proximidades do centro de Caraguatatuba, obrigando o fechamento de uma das principais avenidas da cidade.</p>
      <p>A Guarda Civil Municipal e agentes da Defesa Civil foram acionados para orientar o tráfego e auxiliar moradores que ficaram ilhados. Ao menos 20 imóveis foram atingidos pela cheia, com danos materiais ainda sendo contabilizados.</p>
      <p>O nível do rio chegou a 3,8 metros, ultrapassando a cota de alerta estabelecida em 3,0 metros. A situação normalizou parcialmente somente após a pausa nas chuvas na noite de quarta-feira.</p>
      <p>A prefeitura municipal informou que obras de contenção e ampliação do canal do rio estão previstas para o próximo orçamento municipal, após anos de solicitações por parte da população ribeirinha.</p>
    `,
    },
    {
        slug: "temporais-ilhabela-isolamento-comunidades",
        tipo: "noticia",
        fotoCapa: "fotos/temporal-ilhabela-01.jpg",
        resumo:
            "Temporais em Ilhabela causam deslizamentos e isolam comunidades do sul da ilha. Helicóptero é acionado para resgates.",
        conteudo: `
      <p>Fortes temporais que atingiram Ilhabela entre domingo e segunda-feira provocaram deslizamentos de terra que bloquearam estradas vicinais e isolaram pelo menos três comunidades na porção sul da ilha. Um helicóptero da Polícia Militar foi acionado para auxiliar nos resgates.</p>
      <p>As comunidades de Bonete, Castelhanos e Feiticeira ficaram sem acesso terrestre após bloqueios nas trilhas e estradas de terra. Mantimentos e medicamentos estão sendo transportados por via aérea e marítima até que as vias sejam reabertas.</p>
      <p>Nenhuma vítima fatal foi registrada, mas ao menos cinco pessoas ficaram feridas em quedas e acidentes relacionados às chuvas. Todas foram atendidas no Hospital Geral de Ilhabela.</p>
      <p>A Secretaria de Infraestrutura municipal iniciou os trabalhos de desobstrução das vias assim que as chuvas diminuíram, com previsão de reabertura parcial em até 72 horas.</p>
      <p>Moradores reclamam da falta de obras preventivas: "Todo verão é a mesma coisa. A gente fica ilhado e sem ajuda por dias", disse uma moradora do Bonete.</p>
    `,
    },
    {
        slug: "alerta-maximo-litoral-norte-sp-chuvas",
        tipo: "noticia",
        fotoCapa: "fotos/alerta-chuvas-litoral-norte-01.jpg",
        resumo:
            "Instituto Geológico emite alerta máximo para deslizamentos no Litoral Norte de SP. Municípios de Caraguatatuba, São Sebastião, Ilhabela e Ubatuba em estado de atenção.",
        conteudo: `
      <p>O Instituto Geológico de São Paulo emitiu nesta sexta-feira alerta de nível máximo para risco de deslizamentos nos quatro municípios do Litoral Norte do estado: Caraguatatuba, São Sebastião, Ilhabela e Ubatuba. A previsão é de chuvas intensas e contínuas pelo menos até a próxima terça-feira.</p>
      <p>O documento técnico aponta que as encostas da Serra do Mar na região já estão com o solo saturado de água após semanas de precipitações acima da média histórica. Qualquer novo episódio de chuva forte pode deflagrar novos deslizamentos, especialmente em áreas já previamente afetadas.</p>
      <p>As prefeituras dos quatro municípios foram notificadas e declararam estado de alerta. Sirenes de emergência foram testadas e equipes da Defesa Civil estão em plantão 24 horas.</p>
      <p>A população que reside em áreas de encosta, próximas a córregos e em regiões historicamente afetadas por deslizamentos deve estar preparada para evacuar rapidamente ao primeiro sinal de alerta.</p>
      <p>O número da Defesa Civil (199) e do Corpo de Bombeiros (193) estão disponíveis 24 horas para emergências.</p>
    `,
    },
    {
        slug: "sao-sebastiao-ruas-alagadas-chuvas",
        tipo: "noticia",
        fotoCapa: "fotos/alagamento-sao-sebastiao-01.jpg",
        resumo:
            "São Sebastião registra pontos de alagamento em várias regiões após chuva de 80 mm em duas horas. Veículos ficam ilhados.",
        conteudo: `
      <p>São Sebastião enfrentou pontos de alagamento em diversas regiões do município na tarde de terça-feira, após uma chuva rápida mas de altíssima intensidade: 80 mm registrados em apenas duas horas. Veículos ficaram ilhados em ruas do centro e nos bairros Topolândia e Cigarras.</p>
      <p>O sistema de drenagem da cidade não suportou o volume de água, levando ao transbordamento de bueiros e ao alagamento de vias de grande circulação. O trânsito ficou congestionado por várias horas.</p>
      <p>Equipes da Secretaria de Obras trabalharam para desobstrução das galerias pluviais. A prefeitura orientou motoristas a evitar as áreas afetadas e aguardarem a normalização antes de tentarem passar.</p>
      <p>Este é o terceiro episódio de alagamento significativo no município em menos de 30 dias, o que acende o debate sobre a necessidade de ampliação e modernização do sistema de drenagem urbana.</p>
      <p>O vereador responsável pela comissão de obras públicas convocou uma sessão extraordinária para debater o plano municipal de drenagem e prevenção de enchentes.</p>
    `,
    },
    {
        slug: "tragedia-evitada-sirene-deslizamento-ubatuba",
        tipo: "noticia",
        fotoCapa: "fotos/sirene-emergencia-ubatuba-01.jpg",
        resumo:
            "Sistema de sirenes evita tragédia em Ubatuba: moradores evacuam área minutos antes de deslizamento atingir casas no bairro Perequê-Açu.",
        conteudo: `
      <p>Um deslizamento de proporções significativas atingiu o bairro Perequê-Açu, em Ubatuba, na madrugada de sábado — mas uma tragédia maior foi evitada graças ao sistema de sirenes de alerta instalado pela Defesa Civil. Os moradores da área de risco evacuaram os imóveis aproximadamente 15 minutos antes do desmoronamento.</p>
      <p>A massa de terra e rocha desceu o morro e destruiu completamente quatro residências que haviam sido abandonadas pelos moradores momentos antes. Não há registro de feridos.</p>
      <p>"Acordei com o barulho da sirene. Já sabia o que fazer, a gente treina para isso. Peguei os documentos e saí com minha família", contou uma moradora.</p>
      <p>O caso é apontado pela Defesa Civil estadual como exemplo da eficiência dos sistemas de alerta precoce. Ubatuba implantou 18 sirenes em áreas de risco nos últimos dois anos, após recomendação do Instituto Geológico.</p>
      <p>Apesar do desfecho positivo, os moradores desabrigados enfrentam agora incerteza sobre o futuro: "A casa foi destruída. Não sabemos para onde ir", disse outro morador em entrevista.</p>
    `,
    },
    {
        slug: "verao-chuvas-litoral-norte-historico-desastres",
        tipo: "noticia",
        fotoCapa: "fotos/litoral-norte-historico-chuvas-01.jpg",
        resumo:
            "Especialistas alertam: Litoral Norte de SP concentra histórico grave de desastres naturais e obras de prevenção avançam lentamente.",
        conteudo: `
      <p>O Litoral Norte de São Paulo — composto pelos municípios de Caraguatatuba, São Sebastião, Ilhabela e Ubatuba — é uma das regiões do Brasil com maior histórico de desastres naturais associados a chuvas intensas. Pesquisadores da USP e do IPT alertam que as obras de prevenção avançam em ritmo muito inferior ao necessário.</p>
      <p>O episódio mais marcante da memória recente foi a tragédia de fevereiro de 2023 em São Sebastião, quando mais de 600 mm de chuva caíram em menos de 24 horas, causando dezenas de mortes e destruindo centenas de casas. O evento ficou marcado como um dos maiores desastres climáticos da história do estado.</p>
      <p>Segundo os pesquisadores, a combinação entre a Serra do Mar, que provoca chuvas orográficas intensas, e o adensamento urbano desordenado em áreas de risco cria um cenário de vulnerabilidade crônica.</p>
      <p>"Não é uma questão de 'se' vai acontecer de novo, é uma questão de 'quando'. A tendência é que esses eventos extremos se tornem mais frequentes com as mudanças climáticas", afirmou o geógrafo responsável pela pesquisa.</p>
      <p>Entre as medidas urgentes apontadas estão: ampliação do sistema de sirenes, requalificação de encostas, remoção de famílias em áreas de risco e investimento em sistemas de drenagem urbana. O financiamento federal para algumas dessas obras foi aprovado, mas a execução ainda enfrenta entraves burocráticos.</p>
    `,
    },
];

async function main() {
    console.log("🌱 Iniciando seed de notícias...");

    for (const noticia of noticias) {
        const criada = await prisma.publicacao.create({
            data: {
                slug: noticia.slug,
                tipo: noticia.tipo,
                fotoCapa: noticia.fotoCapa,
                resumo: noticia.resumo,
                conteudo: noticia.conteudo.trim(),
                usuarioId: USUARIO_ID,
            },
        });
        console.log(`✅ Criada: [${criada.id}] ${criada.slug}`);
    }

    console.log("\n🎉 Seed concluído! 8 notícias inseridas.");
}

main()
    .catch((e) => {
        console.error("❌ Erro durante o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });