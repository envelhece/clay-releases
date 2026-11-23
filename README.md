<p align="center">
  <img src="assets/banner.png" alt="CLAY, launcher gratuito para Roblox focado em FPS" width="100%">
</p>

<p align="center">
  <a href="https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe"><img src="https://img.shields.io/badge/Baixar_para_Windows-FFFFFF?style=for-the-badge&logo=windows11&logoColor=000000&labelColor=FFFFFF" alt="Baixar para Windows"></a>
  &nbsp;
  <a href="https://envelhece.github.io/clay-releases/"><img src="https://img.shields.io/badge/Site-111111?style=for-the-badge&logoColor=FFFFFF" alt="Site"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/v/release/envelhece/clay-releases?style=flat-square&label=vers%C3%A3o&color=111111" alt="versão">
  <img src="https://img.shields.io/badge/Windows-10%20%7C%2011-111111?style=flat-square" alt="Windows 10 | 11">
  <img src="https://img.shields.io/badge/pre%C3%A7o-gr%C3%A1tis-111111?style=flat-square" alt="grátis">
  <img src="https://img.shields.io/github/downloads/envelhece/clay-releases/total?style=flat-square&label=downloads&color=111111" alt="downloads">
</p>

<br>

<p align="center">
  <b>Gráfico de massinha, FPS lá em cima.</b><br>
  O CLAY deixa o Roblox leve até no PC mais fraco, usando só configurações que o próprio Roblox permite.
</p>

<p align="center">
  <img src="https://envelhece.github.io/clay-releases/img/run-launcher-massinha-680.png" alt="Launcher do CLAY" width="560">
</p>

## FPS de verdade

Medido com o contador do próprio Roblox (Shift+F5), num PC com Ryzen 5 4600G, RTX 5060 e 16 GB, em 1080p:

| Cenário | Gráfico padrão | Modo Massinha |
|---|:---:|:---:|
| Servidor cheio (Crossroads) | 273 FPS | **325–380 FPS** |
| Mapa vazio (Baseplate) | não medido | **até 718 FPS** |
| Perfil Realista, mapa vazio | não medido | **535 FPS** com sombras e céu azul |

<sub>O resultado varia conforme o processador, a placa de vídeo e o jogo. No Roblox, quem mais limita o FPS costuma ser o processador.</sub>

<p align="center">
  <img src="https://envelhece.github.io/clay-releases/img/game-default-1200.jpg" alt="Gráfico padrão: 273 FPS" width="49%">
  <img src="https://envelhece.github.io/clay-releases/img/game-massinha-1200.jpg" alt="Modo Massinha: 325 FPS" width="49%">
</p>

## O que tem

|  |  |
|---|---|
| **Modo Massinha** | Texturas lisas, céu cinza sem nuvens, sem grama, iluminação congelada. Um clique no launcher. |
| **Perfis** | PC Fraco, Equilibrado, Máximo FPS, Massinha e **Realista** (gráfico no máximo). |
| **Painel no jogo** | Aperte **Page Up** dentro do jogo, troque o gráfico e o CLAY reinicia o Roblox **no mesmo servidor**. |
| **FPS sem limite** | Usa o limite de FPS oficial do Roblox. Também diminui o input lag com tela cheia exclusiva e otimizações de tela cheia desligadas. |
| **Prioridade alta** | O CLAY fica na bandeja enquanto você joga e mantém o Roblox com prioridade no processador. |
| **Experiências** | Favoritas, atalho na área de trabalho, histórico com tempo jogado e **navegador de servidores** (mais cheio, mais vazio, aleatório). |
| **Extras** | Local do servidor, status no Discord, mods cosméticos (cursor, fonte, som), limpador e integrações. |
| **Sempre atualizado** | A versão nova baixa sozinha e é instalada quando você fecha o CLAY. |

<p align="center">
  <img src="https://envelhece.github.io/clay-releases/img/run-perf-1100.webp" alt="Performance" width="49%">
  <img src="https://envelhece.github.io/clay-releases/img/run-gfx3-1100.webp" alt="Graphics" width="49%">
</p>

## Instalar

1. **[Baixe o `CLAY-win-Setup.exe`](https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe)** e abra.
2. Se o Windows mostrar *"O Windows protegeu o computador"*, clique em **Mais informações → Executar assim mesmo**. O instalador ainda não tem assinatura digital.
3. Pronto. Se o seu PC não tiver o .NET 10, o instalador baixa sozinho.

Para desinstalar, use **Configurações do Windows → Aplicativos**. O Roblox volta exatamente ao que era antes.

<details>
<summary><b>Conferir se o arquivo é original (opcional)</b></summary>
<br>

Cada versão traz o código SHA-256 do instalador nas notas da [release](https://github.com/envelhece/clay-releases/releases/latest) e no site. Na pasta do download, abra o terminal e rode:

```powershell
Get-FileHash .\CLAY-win-Setup.exe
```

Se o resultado for diferente do publicado, apague o arquivo sem abrir.
</details>

## É seguro?

- **Só usa o que o Roblox permite:** a [lista oficial de Fast Flags liberadas](https://devforum.roblox.com/t/allowlist-for-local-client-configuration-via-fast-flags/3966569), o limite de FPS do próprio jogo e mudanças visuais locais com backup.
- **Não** modifica o executável nem a memória do jogo, **não** abre várias contas e **não** guarda o seu login.
- O Roblox já disse que launchers que não modificam o executável do cliente não são afetados pelas punições contra clientes modificados.
- Baixe **somente** por este repositório ou pelo [site oficial](https://envelhece.github.io/clay-releases/). Cópias em outros lugares, ou "instalações" por comando no PowerShell, podem ter vírus.

<br>

<p align="center">
  <sub>Este repositório tem somente os instaladores e os arquivos de atualização. O código do CLAY não é público.</sub><br>
  <sub>O CLAY é feito por fã e não tem nenhuma ligação com a Roblox Corporation.</sub>
</p>
