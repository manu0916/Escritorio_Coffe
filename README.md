# Escritório Café

Vitrine e-commerce demonstrativa, feita com HTML, CSS e JavaScript puros. As fotos e a logo do catálogo vieram dos arquivos fornecidos para esta apresentação.

## Preview local

Na raiz do projeto, execute:

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

Abra <http://127.0.0.1:5500/>. O preview local recarrega a página quando `index.html`, `styles.css` ou `script.js` muda.

## Cloudflare Pages

Este repositório estático não precisa de dependências nem de etapa de compilação. Para conectar o repositório ao Cloudflare Pages pelo Git:

| Configuração | Valor |
| --- | --- |
| Production branch | `main` |
| Root directory | Deixe em branco (raiz do repositório) |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `.` |

O `index.html` está na raiz, que também contém os arquivos estáticos publicados. Depois da configuração inicial no painel, novos pushes para `main` acionam a publicação. Consulte o [guia oficial de Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/) e o [guia de Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## Antes de publicar para a loja

- Substitua os preços ilustrativos em `index.html` e `script.js` pelos valores aprovados pela loja.
- A sacola e a finalização são demonstrações front-end. Não existe backend: pedidos, pagamentos, dados do formulário e entrega não são processados.
- Ajuste as opções de atendimento conforme os serviços reais da loja.
