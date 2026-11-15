---
title: Instalar o PIANO LouvorJA no Linux
description: Instale o PIANO LouvorJA no Linux pelo AppImage, Snapcraft ou Flathub, escolha a arquitetura certa e deixe o aplicativo preparado para o culto.
nav_order: 3
platform: linux
reviewed_at: 2026-11-15
toc: true
---

# Instalar o PIANO LouvorJA no Linux

No Linux, a opção mais direta é baixar o AppImage oficial. Você também pode usar Snapcraft; o Flathub está em revisão e, enquanto não aparecer na loja, deve usar outro canal oficial.

## Qual opção de instalação devo escolher?

Escolha o canal que já funciona melhor no computador da igreja.

- **AppImage:** arquivo único, baixado pela página oficial. É a alternativa mais simples quando você tem acesso à pasta de downloads.
- **Snapcraft:** opção para distribuições que já usam a loja Snap.
- **Flathub:** envio em revisão; só use quando o PIANO estiver disponível na loja. Até lá, escolha AppImage ou Snapcraft.

Todos devem ser acessados a partir da página oficial de [download](/download), que aponta para as versões publicadas.

## Como escolher entre ARM64 e X64?

A página de download pode mostrar duas versões de AppImage.

1. Se o computador usa processador Intel ou AMD comum, escolha **X64**.
2. Se usa processador ARM, escolha **ARM64**.
3. Se não souber, peça ajuda a quem configurou o computador antes de baixar.
4. Evite testar arquivos aleatórios: usar a arquitetura errada impede a abertura.

Computadores de igreja com Intel ou AMD normalmente usam X64.

## Como instalar usando AppImage?

O AppImage é um arquivo que você baixa, autoriza a executar e abre.

1. Abra [download](/download).
2. Escolha **Linux** e baixe o AppImage adequado ao computador.
3. Abra o gerenciador de arquivos e entre em **Downloads**.
4. Clique com o botão direito no arquivo AppImage.
5. Escolha **Propriedades**.
6. Abra a aba **Permissões**.
7. Marque a opção parecida com **Permitir executar o arquivo como programa**.
8. Feche a janela de propriedades.
9. Dê dois cliques no AppImage para abrir o PIANO.

O nome da opção pode mudar um pouco conforme a distribuição Linux. Procure por **Permissões** e pela autorização para executar o arquivo.

## E se eu só tiver acesso ao terminal?

Prefira o gerenciador de arquivos. Se o responsável técnico da igreja usa terminal, ele pode autorizar o arquivo com este comando, na pasta onde foi salvo:

```bash
chmod +x nome-do-arquivo.AppImage
```

Depois, abra o arquivo pelo gerenciador de arquivos. Não é necessário usar terminal no dia a dia do PIANO.

## Como instalar pelo Snapcraft?

Use a página oficial de download para chegar ao canal Snapcraft publicado para o PIANO.

1. Abra [download](/download).
2. Escolha a opção **Linux** e localize o canal Snapcraft.
3. Abra o link da loja.
4. Siga a instalação mostrada pela sua distribuição Linux ou pelo responsável técnico.
5. Procure por **PIANO LouvorJA** no menu de aplicativos.
6. Abra o aplicativo e faça o teste inicial.

Se a loja Snap não estiver instalada ou não abrir no computador, use o AppImage em vez de tentar alterar o sistema durante o sábado.

## Posso instalar pelo Flathub?

Ainda não como caminho principal. A submissão ao Flathub está em revisão; a disponibilidade depende da aprovação da loja.

1. Abra [download](/download).
2. Verifique se há um botão ativo do Flathub para o PIANO.
3. Se houver, abra o botão e instale pela própria loja.
4. Se não houver botão ou a página informar indisponibilidade, use AppImage ou Snapcraft.

Não trate o Flathub como disponível antes de vê-lo na página oficial.

## O que fazer na primeira abertura?

Prepare o PIANO antes do culto, especialmente o conteúdo que será usado sem internet.

1. Abra o PIANO LouvorJA.
2. Aguarde a preparação inicial do catálogo.
3. Na **Central de Mídia**, pesquise e baixe os hinos do Hinário Adventista e as coletâneas da programação.
4. Em **Liturgia**, crie a sequência do culto com categorias, músicas, Bíblia e arquivos locais.
5. Em **Configurações**, ajuste o estilo da projeção.
6. Teste um hino, um versículo e o relógio na tela da igreja.

Downloads, liturgias e configurações ficam salvos no aparelho. Fechar o aplicativo não apaga o que já foi preparado.

## Como resolver se o AppImage não abrir?

Verifique primeiro o básico, sem apagar nada.

1. Confirme que baixou o arquivo correto para a arquitetura do computador.
2. Confira novamente **Propriedades** e **Permissões**.
3. Mova o arquivo para uma pasta local, como **Documentos**, se ele estiver em pendrive ou rede.
4. Baixe outra vez somente pela página oficial se o download tiver sido interrompido.
5. Se persistir, use o canal Snapcraft, se disponível, ou o app web para não ficar sem apoio no culto.

## Como deixar um atalho fácil para a equipe?

Depois de testar o AppImage, mantenha-o em uma pasta que a equipe reconheça.

1. Crie ou escolha uma pasta chamada **PIANO LouvorJA** em **Documentos**.
2. Mova o AppImage testado para essa pasta.
3. Abra-o novamente para confirmar que continua funcionando.
4. Se o gerenciador de arquivos oferecer **Adicionar aos favoritos** ou **Criar atalho**, use essa opção.
5. Informe à equipe onde o arquivo fica guardado.
6. Não apague o arquivo usado só porque ele abriu; ele é o aplicativo.
7. Evite ter várias cópias antigas com nomes parecidos.

## Como preparar uma liturgia completa?

1. Abra **Liturgia** e escolha criar uma programação.
2. Adicione categorias para separar cada momento do culto.
3. Adicione músicas, mídia local, links ou anotações.
4. Informe horários das categorias quando a equipe precisar acompanhar o tempo.
5. Arraste os itens até ficarem na ordem final.
6. Salve e faça uma revisão junto com o responsável do programa.
7. Durante o culto, siga a sequência e marque os itens concluídos.

## Como projetar com segurança?

1. Abra um hino na **Central de Mídia**.
2. Clique em **Projetar**.
3. Confira a segunda tela ou TV.
4. Avance o texto para verificar sincronização.
5. Abra um versículo na **Bíblia** e faça o mesmo teste.
6. Ajuste contraste e tamanho da fonte em **Configurações**.
7. Use **ESC** para encerrar a projeção quando terminar o teste.

## Como evitar imprevistos na igreja?

1. Faça downloads e testes com antecedência.
2. Mantenha carregador, cabo de vídeo e adaptador acessíveis.
3. Confirme se o projetor ou TV está na entrada correta.
4. Não atualize a distribuição Linux imediatamente antes do culto.
5. Deixe o app web disponível como alternativa se houver internet.
6. Explique a uma segunda pessoa como abrir o PIANO.
7. Guarde um backup das configurações quando a equipe trocar de computador.

## Checklist final antes do culto

1. Confirme que o PIANO abre no aparelho escolhido.
2. Confirme que hinos e materiais estão disponíveis.
3. Confirme que a liturgia está na ordem correta.
4. Confirme que a tela da igreja recebe uma projeção de teste.
5. Confirme tamanho de letra e contraste no fundo do salão.
6. Confirme rede, energia e cabos necessários.
7. Deixe uma pessoa responsável pela operação.

## Relacionados

- [Instalar no Windows](/docs/pt-BR/install/windows)
- [Usar no navegador e instalar como app](/docs/pt-BR/install/web-pwa)
- [Usar o PIANO em Android TV e Google TV](/docs/pt-BR/install/tv-android)
