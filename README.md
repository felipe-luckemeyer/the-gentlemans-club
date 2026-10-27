# The Gentleman's Club

Uma barbearia pensada para cuidar de você!

## Sobre o projeto

The Gentleman's Club é o site de uma barbearia **fictícia**, localizada em Porto Alegre/RS. O projeto foi criado para as disciplinas do curso superior de Análise e Desenvolvimento de Sistemas do Instituto Federal de Educação, Ciência e Tecnologia Sul-rio-grandense (IFSul), Campus Gravataí.

A proposta é praticar, em um caso realista, a construção de um site institucional completo: estrutura semântica em HTML, estilização e layout responsivo em CSS e interações em JavaScript. O site apresenta a história da barbearia, seus serviços, avaliações de clientes, premiações e um formulário de agendamento.

> **Aviso:** este é um projeto acadêmico, feito apenas para fins educacionais. A marca, os fundadores, os endereços, os telefones, as avaliações, as premiações, os preços e a publicidade são inventados. Qualquer semelhança com pessoas ou empresas reais é coincidência.

## Páginas do site

- [Início](index.html): página inicial com título, GIFs e uma promoção ("The Gentleman's Friday") que aparece ao abrir o site.
- [Quem somos](quem-somos/quem-somos.html): história da barbearia, fundadores e unidades (Bela Vista e Moinhos de Vento).
- [Galeria](galeria/galeria.html): fotos em estilo polaroid e vídeos incorporados do YouTube.
- [Avaliações](avaliacoes/avaliacoes.html): depoimentos de clientes.
- [Premiações](premiacoes/premiacoes.html): prêmios e destaques recebidos.
- [Agenda](agenda/agenda.html): serviços e preços, endereços, horários de funcionamento, mapa e formulário de agendamento.

## Destaques

- Menu de navegação responsivo, com versão para dispositivos móveis.
- Janela de promoção na página inicial, que pode ser fechada pelo visitante.
- Galeria interativa: a imagem muda enquanto o botão do mouse está pressionado.
- Formulário de agendamento com validação de campos obrigatórios. O formulário é demonstrativo e não envia dados.
- Horários de funcionamento que alternam entre português e inglês com um duplo clique no título.
- Mapa do Google Maps e vídeos do YouTube incorporados.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro, sem frameworks ou bibliotecas
- Google Fonts (Chau Philomene One)
- Recursos externos incorporados: Google Maps, YouTube e GIFs do Giphy

## Estrutura de pastas

```
.
├── index.html            # página inicial
├── index.css             # estilos compartilhados por todas as páginas
├── bigode.png            # logo
├── favicon.ico
├── agenda/
├── avaliacoes/
├── galeria/
├── premiacoes/
└── quem-somos/
```

Cada página fica em sua própria pasta, com o arquivo `.html`, o arquivo `.css` e as imagens que ela usa.

## Como executar localmente

O site é estático e não precisa de instalação nem de etapa de build.

1. Clone o repositório:

   ```bash
   git clone https://github.com/felipe-luckemeyer/the-gentlemans-club.git
   cd the-gentlemans-club
   ```

2. Abra o arquivo `index.html` no navegador.

Se preferir, sirva a pasta com um servidor local e acesse `http://localhost:8000`:

```bash
python3 -m http.server 8000
```

Mapa, vídeos, fonte e GIFs são carregados da internet, então é necessário estar conectado para ver o site completo.

## Autor

[Felipe Lückemeyer](https://github.com/felipe-luckemeyer)

## Instituição

Instituto Federal de Educação, Ciência e Tecnologia Sul-rio-grandense (IFSul), Campus Gravataí.
Curso superior em Análise e Desenvolvimento de Sistemas.
