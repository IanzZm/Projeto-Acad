# Organizacao da pasta `src`

Esta estrutura foi pensada para ficar simples de entender e manter:

- `assets`: imagens, logos e arquivos visuais usados no projeto.
- `config`: configuracoes externas, como Firebase.
- `data`: dados fixos usados por componentes.
- `pages`: telas principais da aplicacao.
- `routes`: configuracao das rotas do React Router.
- `services`: funcoes que conversam com banco de dados ou APIs.
- `styles`: estilos globais e variaveis de tema.
- `templates`: estruturas reutilizaveis de pagina.

Dentro de cada pagina, a pasta `components` guarda apenas os componentes usados naquela tela.
Quando uma regra precisa ser usada por mais de uma tela, ela deve ir para `services`.
