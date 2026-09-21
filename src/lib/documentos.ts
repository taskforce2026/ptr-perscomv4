export const TIPOS_DOCUMENTO = [
  "Certificado",
  "Missão",
  "Treino",
  "Ordem",
  "Briefing",
  "Nomeação",
  "Declaração",
  "Relatório",
] as const;

export function preencherModelo(corpo: string, dados: Record<string, string>) {
  return corpo.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, chave: string) => dados[chave] ?? `{{${chave}}}`);
}

export function numeroDocumento(tipo: string, id: number) {
  const ano = new Date().getFullYear();
  const prefixo: Record<string, string> = {
    Certificado: "CERT",
    Missão: "OPORD",
    Treino: "TRN",
    Ordem: "ORD",
    Briefing: "BRF",
    Nomeação: "NOM",
    Declaração: "DECL",
    Relatório: "AAR",
  };
  return `PTR-${prefixo[tipo] ?? "DOC"}-${ano}-${String(id).padStart(4, "0")}`;
}

export const MODELOS_PADRAO: { titulo: string; tipo: string; referencia: string; corpo: string }[] = [
  {
    titulo: "Certificado de Alistamento",
    tipo: "Certificado",
    referencia: "PTR-CERT-ALIST",
    corpo: `PHOENIX TASKFORCE RANGERS
ORDEM DE SERVIÇO — ALISTAMENTO

Por determinação do Comando da Taskforce, fica alistado(a) no efectivo da PTR o(a) militar {{nome}} “{{nomeGuerra}}” ({{nservico}}), com efeitos a {{data}}.

Patente: {{patente}}
Unidade: {{unidade}}
Cargo: {{cargo}}

O presente documento reconhece a integração do militar no Sistema de Gestão de Pessoal (PERSCOM) e no espírito de corpo da Phoenix Taskforce Rangers.

O Comandante da Taskforce`,
  },
  {
    titulo: "Certificado de Condecoração",
    tipo: "Certificado",
    referencia: "PTR-CERT-COND",
    corpo: `PHOENIX TASKFORCE RANGERS
ORDEM DE SERVIÇO — CONDECORAÇÃO

Por determinação do Comando da Taskforce, é condecorado(a) o(a) militar {{patente}} {{nome}} “{{nomeGuerra}}” ({{nservico}}) com:

{{qualificacao}}

Unidade: {{unidade}}
Data: {{data}}

A presente condecoração reconhece a dedicação, competência e espírito de corpo demonstrados ao serviço da PTR.

O Comandante da Taskforce`,
  },
  {
    titulo: "Certificado de Qualificação",
    tipo: "Certificado",
    referencia: "PTR-CERT-QUAL",
    corpo: `O COMANDO DA PHOENIX TASKFORCE RANGERS certifica que o militar

{{patente}} {{nome}} “{{nomeGuerra}}”
N.º de serviço: {{nservico}}
Unidade: {{unidade}}

concluiu com aproveitamento a qualificação / curso indicado, demonstrando competência táctica, disciplina e espírito de corpo próprios da PTR.

Qualificação: {{qualificacao}}
Data de emissão: {{data}}

O presente certificado é documento oficial da unidade e destina-se ao processo individual do militar.`,
  },
  {
    titulo: "Ordem de Missão",
    tipo: "Missão",
    referencia: "PTR-OPORD",
    corpo: `ORDEM DE MISSÃO

Para: {{patente}} {{nome}} “{{nomeGuerra}}”
Unidade: {{unidade}} · N.º {{nservico}}

1. SITUAÇÃO
A PTR executa operação no quadro das missões da unidade.

2. MISSÃO
{{missao}}

3. EXECUÇÃO
O militar acima identificado fica destacado para a missão na data de {{data}}, sob comando da cadeia orgânica.

4. ADMINISTRAÇÃO E LOGÍSTICA
Equipamento conforme SOP da unidade. Briefing no horário definido pelo Comando.

5. COMANDO E TRANSMISSÕES
Frequências e palavras-de-passe conforme anexo classificado.

Esta ordem tem carácter CONFIDENCIAL.`,
  },
  {
    titulo: "Ordem de Treino",
    tipo: "Treino",
    referencia: "PTR-TRN",
    corpo: `ORDEM DE TREINO

Militar: {{patente}} {{nome}} “{{nomeGuerra}}”
Unidade: {{unidade}}

Fica convocado para o treino de {{treino}} a realizar em {{data}}.

Objectivos:
— Aperfeiçoar procedimentos tácticos da PTR
— Avaliar assiduidade e desempenho individual
— Preparar o efectivo para operações futuras

Presença {{obrigatoriedade}}. Fardamento e equipamento conforme SOP.

O Comando da Phoenix Taskforce Rangers.`,
  },
  {
    titulo: "Certificado de Participação em Operação",
    tipo: "Certificado",
    referencia: "PTR-CERT-OP",
    corpo: `CERTIFICADO DE PARTICIPAÇÃO EM OPERAÇÃO

Certifica-se que {{patente}} {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, da unidade {{unidade}}, participou na operação:

{{operacao}}

Data: {{data}}

O militar cumpriu as suas funções com disciplina e profissionalismo, honrando o emblema da Phoenix Taskforce Rangers.

Emitido pelo Comando da PTR.`,
  },
  {
    titulo: "Briefing de Missão",
    tipo: "Briefing",
    referencia: "PTR-BRF",
    corpo: `BRIEFING DE MISSÃO — CONFIDENCIAL

Destinatário: {{patente}} {{nome}} “{{nomeGuerra}}”
Unidade: {{unidade}}
Data: {{data}}

I. TERRENO E INIMIGO
{{terreno}}

II. INTENÇÃO DO COMANDANTE
{{intencao}}

III. TAREFAS
{{tarefas}}

IV. COORDENAÇÃO
Hora H, pontos de encontro e extração conforme anexo.

V. REGRAS DE EMPENGAMENTO
Conforme SOP PTR e briefing verbal.

Destruir após leitura se em suporte físico não controlado.`,
  },
  {
    titulo: "Nomeação de Cargo",
    tipo: "Nomeação",
    referencia: "PTR-NOM",
    corpo: `DESPACHO DE NOMEAÇÃO

O Comando da Phoenix Taskforce Rangers nomeia:

{{patente}} {{nome}} “{{nomeGuerra}}”
N.º {{nservico}} · {{unidade}}

para o cargo de:

{{cargo}}

com efeitos a {{data}}.

O militar assume as responsabilidades, deveres e autoridade inerentes ao cargo, respondendo perante a cadeia de comando.

O Comandante da Taskforce.`,
  },
  {
    titulo: "Certificado de Conclusão de Curso",
    tipo: "Certificado",
    referencia: "PTR-CERT-CURSO",
    corpo: `CERTIFICADO DE CONCLUSÃO DE CURSO

A Phoenix Taskforce Rangers certifica que

{{patente}} {{nome}} “{{nomeGuerra}}”

frequentou e concluiu o curso:

{{curso}}

com a classificação de {{classificacao}}, em {{data}}.

Este documento faz parte do processo individual do militar.`,
  },
  {
    titulo: "Ordem de Promoção",
    tipo: "Ordem",
    referencia: "PTR-ORD-PROM",
    corpo: `PHOENIX TASKFORCE RANGERS
ORDEM DE SERVIÇO — PROMOÇÃO

Por determinação do Comando da Taskforce, é promovido(a) ao posto de {{novaPatente}} o(a) militar {{nome}} “{{nomeGuerra}}” ({{nservico}}), com efeitos a partir de {{data}}.

Unidade: {{unidade}}
Patente anterior: {{patente}}

A presente promoção reconhece a dedicação, competência e espírito de corpo demonstrados ao serviço da PTR.

{{unidade}}
O Comandante da Taskforce`,
  },
  {
    titulo: "Declaração de Serviço",
    tipo: "Declaração",
    referencia: "PTR-DECL",
    corpo: `DECLARAÇÃO DE SERVIÇO

Se declara, para os devidos efeitos, que {{patente}} {{nome}} “{{nomeGuerra}}”, n.º de serviço {{nservico}}, se encontra no efectivo da Phoenix Taskforce Rangers, unidade {{unidade}}, no estado de {{estado}}.

Alistamento: {{alistamento}}
Data da declaração: {{data}}

Documento emitido a pedido do interessado / Comando.`,
  },
  {
    titulo: "Relatório Após-Acção (AAR)",
    tipo: "Relatório",
    referencia: "PTR-AAR",
    corpo: `RELATÓRIO APÓS-ACÇÃO

Militar relator: {{patente}} {{nome}} “{{nomeGuerra}}”
Unidade: {{unidade}}
Data: {{data}}
Operação / treino: {{operacao}}

1. O QUE ESTAVA PLANEADO
{{planeado}}

2. O QUE ACONTECEU
{{aconteceu}}

3. LIÇÕES APRENDIDAS
{{licoes}}

4. RECOMENDAÇÕES
{{recomendacoes}}

Classificação: CONFIDENCIAL — uso interno PTR.`,
  },
  {
    titulo: "Convocatória de Reunião de Comando",
    tipo: "Ordem",
    referencia: "PTR-ORD-REUN",
    corpo: `CONVOCATÓRIA

É convocado o militar {{patente}} {{nome}} “{{nomeGuerra}}” para reunião de comando em {{data}}.

Ordem de trabalhos:
{{ordemTrabalhos}}

Presença obrigatória. Farda de serviço. Pontualidade.

O Comando da PTR.`,
  },
  {
    titulo: "Certificado de Assiduidade",
    tipo: "Certificado",
    referencia: "PTR-CERT-ASSID",
    corpo: `CERTIFICADO DE ASSIDUIDADE

O Comando da Phoenix Taskforce Rangers reconhece a assiduidade exemplar de

{{patente}} {{nome}} “{{nomeGuerra}}”
Unidade {{unidade}}

no período indicado, com presença regular em treinos e missões da unidade.

Data: {{data}}

Este certificado pode ser averbado ao processo individual.`,
  },
  {
    titulo: "Certificado de Missão Cumprida",
    tipo: "Certificado",
    referencia: "PTR-CERT-MISSAO",
    corpo: `PHOENIX TASKFORCE RANGERS
CERTIFICADO DE MISSÃO CUMPRIDA

Certifica-se que {{patente}} {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, da unidade {{unidade}}, cumpriu com êxito a missão:

{{missao}}

Data: {{data}}

O militar demonstrou disciplina, competência táctica e espírito de corpo, honrando o emblema da PTR.

{{unidade}}
O Comandante da Taskforce`,
  },
  {
    titulo: "Ordem de Serviço",
    tipo: "Ordem",
    referencia: "PTR-ORD-SERV",
    corpo: `ORDEM DE SERVIÇO

{{patente}} {{nome}} “{{nomeGuerra}}”
N.º {{nservico}} · {{unidade}}

Por determinação do Comando da Taskforce, fica designado(a) para:

{{cargo}}

com efeitos a {{data}}. O militar assume as tarefas, responsabilidades e autoridade inerentes.

O Comandante da Taskforce`,
  },
  {
    titulo: "Ordem de Transferência",
    tipo: "Ordem",
    referencia: "PTR-ORD-TRANSF",
    corpo: `ORDEM DE TRANSFERÊNCIA

Fica transferido(a), por conveniência de serviço, o(a) militar:

{{patente}} {{nome}} “{{nomeGuerra}}” — n.º {{nservico}}

Unidade de destino: {{unidade}}
Cargo: {{cargo}}
Data de efeitos: {{data}}

O presente despacho entra em vigor na data indicada e é averbado ao processo individual.

O Comandante da Taskforce`,
  },
  {
    titulo: "Louvor",
    tipo: "Declaração",
    referencia: "PTR-LOUVOR",
    corpo: `LOUVOR

Louvo o(a) militar {{patente}} {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, da unidade {{unidade}}, pelos seguintes feitos:

{{feitos}}

Pela dedicação, competência e espírito de corpo demonstrados, merece o reconhecimento público da Phoenix Taskforce Rangers.

Data: {{data}}
O Comandante da Taskforce`,
  },
  {
    titulo: "Declaração de Comparência",
    tipo: "Declaração",
    referencia: "PTR-DECL-COMP",
    corpo: `DECLARAÇÃO DE COMPARECÊNCIA

Declara-se, para os devidos efeitos, que {{patente}} {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, da unidade {{unidade}}, compareceu e participou em:

{{evento}}

Data: {{data}}

Declaração emitida pelo Comando de Pessoal da PTR.`,
  },
  {
    titulo: "Auto de Apresentação",
    tipo: "Declaração",
    referencia: "PTR-AUTO-APRES",
    corpo: `AUTO DE APRESENTAÇÃO

Aos {{data}}, apresentou-se na Phoenix Taskforce Rangers o(a) militar:

{{patente}} {{nome}} “{{nomeGuerra}}”
N.º {{nservico}} · {{unidade}}

Ficando incorporado(a) no efectivo da unidade com o estado de {{estado}}.

O Comandante da Taskforce`,
  },
  {
    titulo: "Termo de Responsabilidade",
    tipo: "Declaração",
    referencia: "PTR-TERMO",
    corpo: `TERMO DE RESPONSABILIDADE

Eu, {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, declaro conhecer e aceitar o regulamento interno da Phoenix Taskforce Rangers, comprometendo-me a:

— Cumprir as ordens legítimas da cadeia de comando;
— Zelar pelo bom nome da unidade dentro e fora do servidor;
— Respeitar os colegas e a comunidade.

Data: {{data}}
Assinatura do militar`,
  },
  {
    titulo: "Certificado de Curso de Instrutor",
    tipo: "Certificado",
    referencia: "PTR-CERT-INSTR",
    corpo: `CERTIFICADO DE CURSO DE INSTRUTOR

A Phoenix Taskforce Rangers certifica que

{{patente}} {{nome}} “{{nomeGuerra}}”

concluiu com aproveitamento o Curso de Instrutor, ficando habilitado(a) a ministrar formação no Centro de Instrução da unidade.

Data: {{data}}
O Comandante da Taskforce`,
  },
  {
    titulo: "Certificado de Curso Ranger",
    tipo: "Certificado",
    referencia: "PTR-CERT-RANGER",
    corpo: `PHOENIX TASKFORCE RANGERS
CERTIFICADO DE CURSO RANGER

Certifica-se que {{patente}} {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, completou com aproveitamento o:

CURSO RANGER — {{qualificacao}}

demonstrando resistência, disciplina e competência táctica nos padrões exigidos pela Taskforce.

Data: {{data}}
Centro de Instrução · O Comandante da Taskforce`,
  },
  {
    titulo: "Ordem de Operação (OPORD)",
    tipo: "Missão",
    referencia: "PTR-OPORD",
    corpo: `ORDEM DE OPERAÇÃO — CONFIDENCIAL

1. SITUAÇÃO
Forças inimigas na área de operações. Condições meteorológicas conforme briefing.

2. MISSÃO
{{missao}}

3. EXECUÇÃO
Intenção do comandante: manobra coordenada com apoio da unidade {{unidade}}.
Formação inicial e rota: conforme anexo cartográfico.

4. ADMINISTRAÇÃO E LOGÍSTICA
Munições, rádios e material médico conforme SOP de classe.

5. COMANDO E TRANSMISSÕES
Frequências no separador Manuais. Cadeia de comando: comandante de esquadra → comando.

Data H: {{data}}
O Comandante da Taskforce`,
  },
  {
    titulo: "Parte de Ocorrência",
    tipo: "Declaração",
    referencia: "PTR-PARTE",
    corpo: `PARTE DE OCORRÊNCIA

Comunicante: {{patente}} {{nome}} “{{nomeGuerra}}” — n.º {{nservico}}
Unidade: {{unidade}} · Data: {{data}}

Descrição da ocorrência:
{{ocorrencia}}

Medidas tomadas:
{{medidas}}

Remetido ao Comando para apreciação e registo no processo individual.`,
  },
  {
    titulo: "Declaração de Honra",
    tipo: "Declaração",
    referencia: "PTR-DECL-HONRA",
    corpo: `DECLARAÇÃO DE HONRA

Eu, {{nome}} “{{nomeGuerra}}”, n.º {{nservico}}, da Phoenix Taskforce Rangers, declaro sob a minha honra que:

— Cumprirei o regulamento da comunidade e dos servidores;
— Não utilizarei qualquer software ou artifício que confira vantagem indevida;
— Defenderei o bom nome da unidade dentro e fora do jogo.

Data: {{data}}
Assinatura do militar`,
  },
];
