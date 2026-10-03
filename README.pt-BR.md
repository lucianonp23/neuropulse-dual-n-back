<div align="center">

# 🧠 NeuroPulse — Dual N-Back

**Treino de memória de trabalho no navegador, baseado na tarefa Dual N-Back.**

![Vue](https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6F00)

<!-- Substitua pelo link do deploy quando houver -->
[**🔗 Demo ao vivo**](#) · [Funcionalidades](#-funcionalidades) · [Como rodar](#-como-rodar-localmente)

[English](README.md) · Português

<!-- Imagem de capa: salve em docs/screenshots/hero.png (ou .gif) -->
<img src="docs/screenshots/hero.png" alt="Tela principal do NeuroPulse" width="800" />

</div>

---

## 📖 Sobre o projeto

O **Dual N-Back** é um exercício cognitivo usado em pesquisas sobre memória de trabalho. A cada rodada o usuário vê uma posição acesa numa grade 3×3 e ouve uma letra ao mesmo tempo. A tarefa é indicar quando a posição e/ou a letra atual são iguais às de **N rodadas atrás**.

O NeuroPulse roda inteiro no navegador, sem backend. Os sons são sintetizados em tempo real com a Web Audio API, e o progresso fica salvo localmente.

## ✨ Funcionalidades

- **Dois estímulos simultâneos:** posição na grade 3×3 e letra falada ou tocada, cada um com botão de resposta próprio.
- **Nível N ajustável (1 a 8)**, com **avanço automático** quando a precisão da sessão passa de 90%.
- **Sessão configurável:** de 15 a 40 rodadas, com intervalo de 1 a 5 segundos por estímulo.
- **Três modos de estímulo sonoro:**
  - *Harmônico* e *Tom puro*: cada letra tem uma nota musical própria (C4 a C5), sintetizada na hora.
  - *Voz*: letras faladas via Speech Synthesis, em 6 idiomas (pt-BR, en-US, es-ES, fr-FR, de-DE, it-IT), com velocidade ajustável.
- **Feedback sonoro e visual** de acertos, erros e omissões, ou um **modo cego** sem feedback durante a sessão.
- **Relatório de desempenho** ao fim de cada sessão: acertos, falsos positivos e omissões por modalidade.
- **Atalhos de teclado:** `A` posição · `L` letra · `M` mudo · `Esc` encerrar.
- **Preferências salvas** no `localStorage`: nível, áudio e feedback.

## 📸 Screenshots

<!--
  Coloque as imagens em docs/screenshots/ com os nomes abaixo
  (ou ajuste os caminhos). PNG ou GIF; ~1200px de largura funciona bem.
-->

| Configuração | Sessão em andamento |
| :---: | :---: |
| <img src="docs/screenshots/settings.png" alt="Tela de configuração" width="400" /> | <img src="docs/screenshots/gameplay.png" alt="Sessão em andamento" width="400" /> |
| **Configurações de áudio** | **Relatório de desempenho** |
| <img src="docs/screenshots/audio.png" alt="Configurações de áudio" width="400" /> | <img src="docs/screenshots/results.png" alt="Relatório de desempenho" width="400" /> |

## 🛠️ Tecnologias

| Camada | Ferramentas |
| --- | --- |
| Interface | Vue 3 (Composition API, `<script setup>`), Tailwind CSS v4, Lucide Icons, vue-sonner |
| Linguagem | TypeScript |
| Áudio | Web Audio API (osciladores e envelopes), Web Speech API |
| Build | Vite |

## 🏗️ Arquitetura

```
src/
├── App.vue                  # Alterna entre as três telas conforme a fase do jogo
├── components/
│   ├── setup/               # Tela de configuração (parâmetros do treino, estúdio de áudio)
│   ├── game/                # Tela da sessão (grade, botões de resposta, progresso)
│   ├── results/             # Relatório de desempenho
│   ├── layout/              # Cabeçalho e rodapé
│   └── ui/                  # Componentes reutilizáveis (toggle, slider)
├── composables/             # Estado reativo e regras (configurações, áudio, sessão, atalhos)
└── lib/                     # Lógica independente de framework
    ├── game-logic.ts        # Geração de sequências e pontuação (funções puras)
    ├── storage.ts           # Acesso seguro ao localStorage
    └── audio/               # Motor de áudio e dados dos idiomas da voz
```

O código está dividido em três camadas, e cada uma só depende das camadas abaixo dela:

- **`lib/`: lógica pura, sem Vue.** `game-logic.ts` gera a sequência com cerca de 30% de coincidências intencionais e calcula a precisão como `acertos / (coincidências + falsos positivos)`. O motor de áudio monta todos os sons de feedback com um único helper, `playTone`, que recebe o envelope de volume como dados.
- **`composables/`: estado e regras.** Composables compartilhados (`useGameSession`, `useGameSettings`, `useAudioSettings`) funcionam como uma pequena store, sem bibliotecas extras. O ciclo de rodadas é explícito: `showTrial`, depois `endTrial`, depois a próxima `showTrial`. Assim o tempo de cada estímulo fica fácil de seguir, e encerrar a sessão limpa todos os timers.
- **`components/`: só interface.** As telas leem os composables, e os componentes menores recebem props e emitem eventos.

O `AudioContext` só é criado após uma interação do usuário, para respeitar as políticas de autoplay dos navegadores.

## 🚀 Como rodar localmente

**Pré-requisito:** Node.js 20 ou superior.

```bash
git clone https://github.com/lucianonp23/neuropulse-dual-n-back.git
cd neuropulse-dual-n-back
npm install
npm run dev
```

O app abre em `http://localhost:3000`.

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Checagem de tipos com `tsc` |

## 🗺️ Próximos passos

<!-- Edite à vontade; são só sugestões -->
- [ ] Histórico de sessões com gráfico de evolução
- [ ] Testes unitários para `game-logic.ts`
- [ ] Suporte a PWA para uso offline

## 👤 Autor

**Luciano Pena**

<!-- Preencha com seus links -->
[LinkedIn](#) · [GitHub](https://github.com/lucianonp23) · [Portfólio](#)
