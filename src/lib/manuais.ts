export type Secao = { titulo: string; corpo: string };
export type Manual = { slug: string; titulo: string; classe: string; introducao: string; secoes: Secao[] };

export const MANUAIS: Manual[] = [
  {
    slug: "geral",
    titulo: "Manual Geral de Procedimentos",
    classe: "Comunidade e Servidores",
    introducao:
      "Documento de referência da Phoenix Taskforce Rangers. Define a conduta na comunidade gaming, o uso dos servidores e os procedimentos comuns a todas as classes. A sua leitura é obrigatória para todo o efectivo.",
    secoes: [
      {
        titulo: "1. Conduta na comunidade",
        corpo:
          "1.1. Respeito mútuo: trata todos os membros e a comunidade externa com cordialidade. Insultos, assédio ou toxicidade são motivo de processo disciplinar.\n1.2. Identificação: usa o teu nome de guerra registado no TeamSpeak e nos servidores.\n1.3. Língua: o canal de comando é português; em operações com unidades aliadas usa-se inglês no canal táctico.\n1.4. Assiduidade: comunica ausências com antecedência ao teu chefe de esquadra. Três faltas injustificadas a eventos obrigatórios implicam passagem à reserva.",
      },
      {
        titulo: "2. Servidores e acesso",
        corpo:
          "2.1. Servidor principal (Liberation/Missões): password no PERSCOM → Servidor. Não partilhes fora do efectivo.\n2.2. Servidor de Treino e Formação: uso livre para ensaios; não interfere com estatísticas operacionais.\n2.3. TeamSpeak: entra 15 minutos antes do evento. Canal de espera até ao briefing.\n2.4. Mods: usa exclusivamente o modpack indicado. Slots de mods personalizados são proibidos em eventos oficiais.",
      },
      {
        titulo: "3. Procedimento de evento",
        corpo:
          "3.1. Marca presença no PERSCOM → Eventos assim que o evento for publicado.\n3.2. Briefing: atenção total; dúvidas no fim.\n3.3. Equipamento: conforme SOP da classe. Confere munições, rádios e material médico antes do spawn.\n3.4. Após o evento: debrief e registo de ocorrências. Os resultados alimentam as estatísticas do PERSCOM.",
      },
      {
        titulo: "4. Comunicações",
        corpo:
          "4.1. Disciplina de rádio: transmite apenas o necessário, no canal correcto (ver separador Manuais → Frequências).\n4.2. Formato: «Destino, origem: mensagem».\n4.3. Silêncio rádio em operações de reconhecimento salvo contacto.\n4.4. Report de contacto: direcção, distância, descrição, localização (ex.: «Contacto! 270, 300 metros, patrulha de 4, grelha 042-067»).",
      },
      {
        titulo: "5. Segurança e fair play",
        corpo:
          "5.1. Proibido qualquer cheat, macro ou exploit. Detecção = expulsão.\n5.2. Não abuses de bugs do jogo; reporta-os no Bug Report do PERSCOM.\n5.3. Em caso de crash ou desconexão, avisa no TeamSpeak e reentra no mesmo slot.",
      },
    ],
  },
  {
    slug: "rifleman",
    titulo: "Manual do Atirador (Rifleman)",
    classe: "Atirador",
    introducao:
      "O atirador é a espinha dorsal da esquadra. Este manual simplifica os procedimentos essenciais de movimentação, tiro e integração na formação.",
    secoes: [
      {
        titulo: "1. Equipamento base",
        corpo:
          "Rifle com mira óptica/ferro, 6–8 carregadores, 2 granadas de fragmentação, 1 fumígeno, rádio SR na frequência da esquadra, kit de bandagens e torniquete. Peso alvo: mobilidade total.",
      },
      {
        titulo: "2. Formação e distâncias",
        corpo:
          "Em coluna: 5–10 m do elemento da frente. Em linha: 10–15 m. Mantém sempre contacto visual com o teu buddy. O último elemento verifica a retaguarda.",
      },
      {
        titulo: "3. Procedimento de contacto",
        corpo:
          "Ao sofrer contacto: deita/abriga → reage com fogo na direcção do inimigo → reporta (direcção/distância/descrição) → manobra por ordem do chefe. Nunca corras sem ordem; o fogo cobre o movimento.",
      },
      {
        titulo: "4. Tiro eficaz",
        corpo:
          "Identifica antes de disparar. Rajadas de 2–3 tiros a médias distâncias; tiro a tiro acima de 200 m. Controla a respiração (tecla de estabilização). Conserva munição: recarrega em pausas, não no contacto.",
      },
      {
        titulo: "5. Buddy aid",
        corpo:
          "Se o teu buddy cai: dá cobertura, arrasta-o para abrigo, aplica bandagem/torniquete e pede médico no SR («Médico, homem abatido, minha posição»).",
      },
    ],
  },
  {
    slug: "automatic-rifleman",
    titulo: "Manual do Apontador de Metralhadora",
    classe: "Apontador de Metralhadora",
    introducao:
      "A metralhadora fornece o poder de fogo de supressão da esquadra. O teu papel é fixar o inimigo para permitir a manobra dos colegas.",
    secoes: [
      {
        titulo: "1. Equipamento",
        corpo:
          "Metralhadora ligeira, 400–600 tiros, rádio SR, óptica de apoio. O teu ajudante (se presente) transporta munição extra e assegura a tua segurança imediata.",
      },
      {
        titulo: "2. Posicionamento",
        corpo:
          "Em deslocação: centro da formação. Em contacto: posição com campo de tiro longo e cobertura. Comunica a mudança de posição antes de a executar.",
      },
      {
        titulo: "3. Supressão",
        corpo:
          "Rajadas de 5–7 tiros sobre a posição inimiga, ajustando pela poeira/impactos. Objectivo: obrigar o inimigo a baixar a cabeça, não necessariamente abater. Reporta «Supressão!» quando inicias e «Cease fire!» quando terminas.",
      },
      {
        titulo: "4. Gestão de munição e sobreaquecimento",
        corpo:
          "Anuncia «Meia carga» a 50% e «Última caixa» na reserva. Pausa o fogo para arrefecer o cano; o rifleman cobre-te nesse momento.",
      },
      {
        titulo: "5. Segurança",
        corpo:
          "Conhece a linha dos teus colegas: nunca dispares sobre arcos onde haja elementos amigos. Em dúvida, não dispares e pergunta.",
      },
    ],
  },
  {
    slug: "grenadier",
    titulo: "Manual do Grenadeiro",
    classe: "Grenadeiro",
    introducao:
      "O grenadeiro atinge alvos atrás de cobertura e em estruturas. A precisão e a consciência de segurança são críticas.",
    secoes: [
      {
        titulo: "1. Equipamento",
        corpo:
          "Rifle com lançador de granadas, 8–10 granadas HE, 4 fumígenos, 2 iluminantes. Rádio SR. As granadas de 40 mm têm raio letal de ~5 m.",
      },
      {
        titulo: "2. Emprego do lançador",
        corpo:
          "Usa a tabela de tiro do lançador para distâncias acima de 100 m. Tiro em arco sobre muros/janelas. Confirma sempre que não há amigos na linha ou na zona de queda.",
      },
      {
        titulo: "3. Granadas de mão",
        corpo:
          "Anuncia «Granada!» antes de lançar. Em rooms: limpa cantos com espelho/ângulo antes de cozinhar a granada (máx. 2 s na mão).",
      },
      {
        titulo: "4. Fumígenos",
        corpo:
          "Para marcar alvos (fumo colorido a pedido) ou para ecrã de movimento (fumígeno entre o inimigo e a manobra). Comunica «Fumo fora» e a cor.",
      },
    ],
  },
  {
    slug: "marksman",
    titulo: "Manual do Atirador Designado (Marksman)",
    classe: "Marksman",
    introducao:
      "O marksman estende o alcance da esquadra e fornece observação. Trabalha descentrado, com disciplina de ocultação.",
    secoes: [
      {
        titulo: "1. Equipamento",
        corpo:
          "Rifle de precisão com óptica 8–12x, telémetro/laser designador, bloco de notas de tiro, rádio SR+LR, ghillie/camuflagem adequada ao terreno.",
      },
      {
        titulo: "2. Posicionamento",
        corpo:
          "20–50 m à frente ou ao flanco da esquadra, com linha de observação sobre as avenidas de aproximação. Muda de posição após 2–3 tiros reveladores.",
      },
      {
        titulo: "3. Ordem de prioridades",
        corpo:
          "1) Operadores de metralhadora; 2) operadores de rádio; 3) líderes; 4) atiradores. Um tiro, um alvo confirmado.",
      },
      {
        titulo: "4. Observação e report",
        corpo:
          "Reporta movimentos antes do contacto: «Observação: 3 elementos a mover de L para O, grelha…, 400 m». Usa o laser designador para marcar alvos para a esquadra.",
      },
    ],
  },
  {
    slug: "medico",
    titulo: "Manual do Médico de Combate",
    classe: "Médico",
    introducao:
      "O médico preserva a força de combate. A tua prioridade é manter os operadores de pé ou estabilizá-los para evacuação.",
    secoes: [
      {
        titulo: "1. Equipamento",
        corpo:
          "Kit médico completo (bandagens, torniquetes, morfina, sangue/plasma), mochila de reanimação, marcador de triagem, rádio SR na frequência da esquadra e na de médicos (52.0).",
      },
      {
        titulo: "2. Protocolo MARCH",
        corpo:
          "M – Hemorragia massiva: torniquete alto e apertado.\nA – Via aérea: posição de recuperação/cânula.\nR – Respiração: selar feridas torácicas.\nC – Circulação: tratar choque, acesso IV.\nH – Hipotermia/feridas restantes: cobrir e bandagar.",
      },
      {
        titulo: "3. Sob fogo",
        corpo:
          "Não trates sob fogo directo: pede supressão, arrasta o ferido para abrigo e só então trata. A tua segurança garante a de todos.",
      },
      {
        titulo: "4. Triage e evacuação",
        corpo:
          "Classifica: imediato / urgente / expectante. Pede MEDEVAC no canal 52.0 com: posição, nº de feridos, estado e tipo de lesão. Acompanha o ferido até ao ponto de recolha se possível.",
      },
      {
        titulo: "5. Registo",
        corpo:
          "Anota feridos e tratamentos no final do evento para o PERSCOM (registos de combate e condecorações Coração Púrpura).",
      },
    ],
  },
  {
    slug: "radio",
    titulo: "Manual do Operador Rádio",
    classe: "Rádio",
    introducao:
      "O operador rádio garante a ligação entre a esquadra, o comando e apoios. És o sistema nervoso da unidade.",
    secoes: [
      {
        titulo: "1. Equipamento",
        corpo:
          "Rádio LR de longa alcance além do SR, mapa e grelhas, bateria extra, antena de longo alcance, bloco de notas de mensagens.",
      },
      {
        titulo: "2. Frequências",
        corpo:
          "SR: canal interno da esquadra. LR: canal esquadra↔comando (ver tabela de frequências). Confere as frequências antes de cada evento; o comando pode alterá-las no PERSCOM.",
      },
      {
        titulo: "3. Formato de mensagem",
        corpo:
          "«Comando, Alpha: pedido de apoio médico, grelha 042-067, 1 ferido grave.» Repete mensagens críticas (read-back). Anota hora de cada transmissão importante.",
      },
      {
        titulo: "4. Pedidos de apoio",
        corpo:
          "MEDEVAC: posição, feridos, segurança da zona. Apoio de fogo/arty: grelha, tipo de alvo, marcação. Transporte: posição, nº de pax, urgência.",
      },
      {
        titulo: "5. Segurança de comunicações",
        corpo:
          "Não transmitas planos completos em canal aberto. Em operações sensíveis, usa palavras-código definidas no briefing.",
      },
    ],
  },
  {
    slug: "comandante-esquadra",
    titulo: "Manual do Comandante de Esquadra",
    classe: "Comandante de Esquadra",
    introducao:
      "O comandante de esquadra traduz a intenção do comando em acção táctica. És responsável pela vida e eficácia dos teus operadores.",
    secoes: [
      {
        titulo: "1. Antes do evento",
        corpo:
          "Confere presenças no PERSCOM, equipamento e frequências. Prepara um plano simples com uma alternativa. Designa o 2º da esquadra.",
      },
      {
        titulo: "2. Briefing à esquadra",
        corpo:
          "Usa o formato SMEAC simplificado: Situação, Missão, Execução (formação, rota, regras de empenhamento), Administração, Comando (frequências, cadeia de substituição).",
      },
      {
        titulo: "3. Controlo em combate",
        corpo:
          "Comandos curtos e claros: «Alpha, em linha, avançar»; «Contacto frente, suprimir»; «Recuar para a crista, por equipas». Mantém o comando pelo LR informado com reports de situação (SITREP) a cada mudança relevante.",
      },
      {
        titulo: "4. Após o evento",
        corpo:
          "Faz o debrief, regista assiduidade e ocorrências no PERSCOM e propõe condecorações/qualificações para os operadores que se distinguiram.",
      },
    ],
  },
  {
    slug: "instrutor",
    titulo: "Manual do Instrutor",
    classe: "Instrutor",
    introducao:
      "O instrutor forma recrutas e mantém o padrão táctico da PTR. O Centro de Instrução é a porta de entrada do efectivo.",
    secoes: [
      {
        titulo: "1. Objectivos da formação",
        corpo:
          "Transformar recrutas em operadores seguros e úteis: disciplina de rádio, formação, contacto, primeiros socorros e uso do PERSCOM.",
      },
      {
        titulo: "2. Estrutura de um curso",
        corpo:
          "Sessão teórica (15 min) → demonstração → exercício prático guiado → exercício avaliado. Avalia cada recruta e regista a qualificação no PERSCOM (Ranger Básico/Avançado).",
      },
      {
        titulo: "3. Segurança de treino",
        corpo:
          "Munição de treino em zonas designadas. Briefing de segurança antes de cada exercício com armas. Zonas de morte sempre claras.",
      },
      {
        titulo: "4. Padrão de avaliação",
        corpo:
          "Aprova quem executa os procedimentos de segurança sem falhas e comunica correctamente. A atitude conta tanto quanto a técnica.",
      },
    ],
  },
];

export function manualPorSlug(slug: string) {
  return MANUAIS.find((m) => m.slug === slug);
}
