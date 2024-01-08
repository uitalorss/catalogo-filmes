# Catalogo-de-filmes

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

![GitHub repo size](https://img.shields.io/github/repo-size/uitalorss/catalogo-filmes?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/uitalorss/catalogo-filmes?style=for-the-badge)

### 💡 Um pouco sobre o projeto.

Esse projeto consiste em uma aplicação para gerenciar informações de filmes. Para esse projeto foi utilizado padrões de arquitetura de software e foram implementados testes unitários e E2E para atestar a qualidade de implementação da API.

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [x] Desenvolvimento do projeto
- [x] Criação do ambiente de desenvolvimento com docker.
- [x] Implementação da cobertura de testes unitários.
- [x] Implementação dos testes de ponta-a-ponta.
- [ ] Construção da documentação em Swagger

## 💻 Tecnologias utilizadas

- Node
- NestJS
- Docker
- TypeORM
- JEST

## 🚀 Instalando o Catálogo de filmes

Para instalar o projeto, instale as dependências usando o comando abaxo:

npm:

```
npm install
```

yarn:

```
yarn install
```

## ☕ Usando Catálogo de filmes

Para usar a aplicação, siga estas etapas:

npm:

```
npm run typeorm migration:run
npm run start:dev
```

yarn:

```
yarn typeorm migration:run
yarn start:dev
```

Caso tenha o Docker e o docker compose instalado na máquina, basta utilizar o comando `docker compose up` para subir todo o ambiente.

## ✅ Requisitos funcionais

- [x] É possível cadastrar um usuário.
- [x] É possível fazer login na aplicação.
- [x] É possível atualizar os dados de usuário.
- [x] É possível solicitar o envio de email para redefinição de senha.
- [x] É possíve redefinir a senha de usuário.
- [x] É possível cadastrar filmes.
- [x] É possível listar filmes.
- [x] É possível listar um filme de acordo com o seu id.
- [ ] É possível pesquisar filmes por gênero, artistas ou classificação indicativa.
- [x] É possível atualizar informações de um filme.
- [x] É possível excluir um filme.

## 📫 Contribuindo para Catálogo de filmes

<!---Se o seu README for longo ou se você tiver algum processo ou etapas específicas que deseja que os contribuidores sigam, considere a criação de um arquivo CONTRIBUTING.md separado--->

Para contribuir com o Catálogo de filmes, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_do_projeto> / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 🤝 Colaboradores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/15834173?v=4" width="100px;" alt="Foto do Uítalo Souza no GitHub"/><br>
        <sub>
          <b>Uítalo Souza</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

[⬆ Voltar ao topo](#Catalogo-de-filmes)<br>
