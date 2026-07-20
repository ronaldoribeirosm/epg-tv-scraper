# epg-tv-scraper — Progresso do Projeto

> Log de decisões técnicas e inventário de entrega. Ver README.md pra a narrativa completa do projeto.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript / Node 20 (ESM) |
| Parsing de HTML | cheerio |
| Geração de XML | xmlbuilder2 |
| Testes | vitest |
| Agendamento | GitHub Actions (`schedule: cron`) |
| Demo | HTML/CSS/JS estático, sem build step |

## O que foi construído (sessão 2026-07-20)

- **Escolha da fonte com verificação real de `robots.txt`** — `mi.tv` foi testado primeiro e descartado por bloquear via `Disallow: /*async*` justamente a rota que carrega a grade; `meuguia.tv` foi escolhido depois de confirmar (com `curl`, direto) que não tem `robots.txt` e serve a grade completa no HTML normal da página de cada canal.
- **Catálogo de 83 canais** (`src/channels.ts`) — códigos e nomes extraídos de verdade das páginas de categoria do site (`Aberta`, `Noticias`, `Esportes`, `Filmes`, `Series`, `Documentarios`, `Infantil`, `Variedades`), não inventados.
- **Parser** (`src/scrapeChannel.ts`) que lê `li.subheader` (data), ignora `li.divider` (que às vezes contém HTML de anúncio, não só um separador vazio) e extrai hora/título/categoria de cada item.
- **Resolução de ano por sequência** (`src/util/dates.ts::resolveYear`) — o site nunca imprime ano, só `dd/mm`; a lógica detecta a virada dezembro→janeiro pela sequência ir "pra trás".
- **Inferência de horário de término** — fim de cada programa = início do próximo item da mesma lista cronológica, inclusive atravessando a virada do dia. O último item da janela buscada fica sem `stop`.
- **Corte de horizonte configurável** (`EPG_DAYS_AHEAD`, padrão 7 dias) — sem isso, alguns canais (principalmente de nicho) devolviam meses de programação repetindo um template, o que inflava o XML sem agregar dado real.
- **Builder XMLTV** (`src/xmltv.ts`) com `<channel>` antes de `<programme>` (ordem exigida pelo DTD do XMLTV), ícone por canal, offset fixo `-0300`.
- **Orquestrador** (`src/main.ts`) que não aborta a raspagem inteira se um canal falhar — só marca o canal como falho e segue com os outros.
- **Suíte de testes** com fixture real (HTML de verdade salvo de `meuguia.tv/programacao/canal/SBT`, cobrindo 3 dias e uma virada de dia) — 18 testes, cobrindo parsing de data/hora, inferência de `stop` (mesmo dia e atravessando meia-noite), e o builder XMLTV.
- **Demo estática** (`demo/index.html`) — grade de canais com badge "ao vivo", barra de progresso, filtro por categoria, tema claro/escuro via `prefers-color-scheme`, usando uma amostra real (`demo/data.json`) extraída do próprio `guide.xml` gerado.
- **Workflows do GitHub Actions**: `scrape.yml` (cron horário, commita `output/guide.xml` só se mudou) e `ci.yml` (typecheck + testes + build a cada push/PR).

## Validado de verdade nesta sessão (não só lido)

- **Raspagem real rodou contra o site ao vivo**: 83/83 canais responderam, 0 falhas, ~17.600 programas depois do corte de 7 dias — não é dado de exemplo, é o resultado real de `npm run scrape`.
- **`npm test`**: 18/18 testes passando, incluindo o caso de virada de dia (`Galvão F.C.` 23:00 → `stop` em `00:00` do dia seguinte) e resolução de ano (dezembro → janeiro simulado).
- **`npm run typecheck`**: limpo, sem erros.
- **Demo testada com Playwright de verdade** (headless Chromium): 12/12 cards renderizando, filtro por categoria funcionando (`Esportes` isola 1 card), zero erro de console, screenshots capturados em tema escuro, tema claro e viewport mobile (390×844) — um bug real de timing foi encontrado e corrigido nesse processo (ver abaixo).
- **`robots.txt` das duas fontes candidatas foi lido de verdade** via `curl` antes de decidir — a escolha de `meuguia.tv` não foi um chute.

### Um bug real encontrado e corrigido nesta sessão

A primeira versão da demo usava `animation-delay: calc(var(--i) * 45ms)` sem limite, com 12 cards — o 12º card só terminava de aparecer quase 1 segundo depois do carregamento. O primeiro screenshot automatizado capturou a página *durante* essa animação: só o primeiro card (delay 0ms) tinha terminado de aparecer, os outros 11 estavam com opacidade baixa ou zero, invisíveis no print. Corrigido reduzindo a duração (480ms → 280ms), o intervalo por item (45ms → 28ms) e limitando o delay máximo a 10 itens — depois disso, os 12 cards aparecem no re-teste.

## O que NÃO foi validado nesta sessão

- **O workflow `scrape.yml` nunca rodou de verdade no GitHub Actions** — foi escrito e revisado, mas a execução em CI só acontece depois do primeiro push; a lógica de "commitar só se mudou" foi testada manualmente via `git diff --quiet` local, não dentro do runner do Actions.
- **O arquivo `guide.xml` nunca foi carregado num player real** (Kodi, Tvheadend, Jellyfin). A validação foi estrutural — segue a sintaxe XMLTV (`<tv><channel/><programme/></tv>`, atributos `start`/`stop`/`channel` no formato `YYYYMMDDHHMMSS ±HHMM`) — mas não há confirmação de que um PVR real aceita o arquivo sem ajuste.
- **Estabilidade do HTML de origem no longo prazo** — o parser depende da estrutura atual de `meuguia.tv`; não há como garantir que ela não muda amanhã. Se mudar, o job horário do Actions vai começar a falhar (ou a raspar 0 canais, o que já aborta sem gravar arquivo) — é o sinal que vai indicar a necessidade de ajuste.
- **Cobertura regional dos canais de TV aberta** — o site personaliza a lista de TV aberta por localização; os 13 códigos "Aberta" no catálogo vieram do lineup padrão do servidor no momento da sessão (aparentemente Rio de Janeiro, pelo teor de "Bom Dia Rio"), não foram comparados com outras regiões.

## Pendente (decisões que são suas, não técnicas)

1. **Criar o repositório no GitHub** e fazer o primeiro push (dispara o `ci.yml`; o `scrape.yml` só começa a rodar de fato depois, no próximo início de hora)
2. **Adicionar os topics** (`xmltv`, `epg`, `web-scraping`, `typescript`, `tv-guide`), pinar no perfil se quiser
3. **Acompanhar a primeira execução real do `scrape.yml`** no Actions pra confirmar que o commit automático funciona como esperado
4. **Testar `output/guide.xml` num player real** (Kodi/Tvheadend/Jellyfin) antes de recomendar o projeto como "pronto pra uso doméstico" — ver limitação acima
