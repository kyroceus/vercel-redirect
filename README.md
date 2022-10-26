# Vercel Redirect

It redirects the website request from facebook to any blog while keeping the meta data for the each link. This app uses [Next.js](https://nextjs.org/) and the SSR!

### Requirements

- [WordPress](https://wordpress.org/)
- [WPGraphQL](https://www.wpgraphql.com/)
- Environment variables (see below)

```
git clone https://github.com/viswaah/vercel-redirect.git
```

Add an `.env.local` file to the root with the following:

```
GRAPHQL_ENDPOINT="https://wordpressite.com/graphql/"
```

Then run the development server,

```bash
npm run dev
# or
yarn dev
```

| Name             | Required | Default | Description                                                 |
| ---------------- | -------- | ------- | ----------------------------------------------------------- |
| GRAPHQL_ENDPOINT | Yes      | -       | WordPress WPGraphQL endpoint (ex: https://host.com/graphl/) |

To get the particular post from link https://wordpressdomain.com/path
Replace it by https://newverceldomain.vercel.app/path
When you post this new vercel link on facebook,
It shows the post metadata and content from the vercel,
When user click on this link it will redirect them to the actual wordpress domain.
