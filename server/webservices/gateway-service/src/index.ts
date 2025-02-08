import express from 'express';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 4000;

const getSwaggerDocs = async () => {
  const urls = [
    { url: 'http://users-service:3004/api-docs-json', name: 'Users Service' },
    { url: 'http://journals-service:3005/api-docs-json', name: 'Journals Service' },
    { url: 'http://likes-service:3003/api-docs-json', name: 'Likes Service' },
    { url: 'http://comments-service:3002/api-docs-json', name: 'Comments Service' },
    { url: 'http://auth-service:3001/api-docs-json', name: 'Auth Service' },
    { url: 'http://mode-service:3006/api-docs-json', name: 'Mode Service' },
  ];

  const specs = await Promise.all(
    urls.map(async (service) => {
      try {
        const response = await axios.get(service.url);
        return { ...response.data };
      } catch (error) {
        console.error(`Error fetching Swagger docs from ${service.url}`, error);
        return null;
      }
    })
  );

  return specs.filter((spec) => spec !== null);
};

const mergeComponents = (componentsList:any) => {
  return componentsList.reduce((acc:any, components:any) => {
    if (!components) return acc;

    acc.schemas = {
      ...acc.schemas,
      ...components.schemas,
    };

    acc.responses = {
      ...acc.responses,
      ...components.responses,
    };

    return acc;
  }, { schemas: {}, responses: {} });
};

app.get('/api-docs-json', async (req, res) => {
  const specs = await getSwaggerDocs();
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Onlinediary API Documentation',
      version: '1.0.0',
    },
    paths: specs.reduce((acc, spec) => ({ ...acc, ...spec.paths }), {}),
    components: mergeComponents(specs.map((spec) => spec.components)),
    tags: specs.reduce((acc, spec) => [...acc, ...spec.tags], []),
  });
});

app.use('/api-docs', swaggerUi.serve, async (req:any, res:any) => {
  const swaggerDocs = await getSwaggerDocs();
  const combinedDocs = {
    openapi: '3.0.0',
    info: {
      title: 'Combined API Documentation',
      version: '1.0.0',
    },
    paths: swaggerDocs.reduce((acc, doc) => ({ ...acc, ...doc.paths }), {}),
    components: mergeComponents(swaggerDocs.map((doc) => doc.components)),
    tags: swaggerDocs.reduce((acc, doc) => [...acc, ...doc.tags], []),
  };
  res.send(swaggerUi.generateHTML(combinedDocs));
});

app.use('/comments', createProxyMiddleware({
  target: 'http://comments-service:3002/api/comments',
  changeOrigin: true,
  pathRewrite: {
    '^/comments': '',
  },
}));

app.use('/likes', createProxyMiddleware({
  target: 'http://likes-service:3003/api/likes',
  changeOrigin: true,
  pathRewrite: {
    '^/likes': '',
  },
}));

app.use('/journals', createProxyMiddleware({
  target: 'http://journals-service:3005/api/journals',
  changeOrigin: true,
  pathRewrite: {
    '^/journals': '',
  },
}));

app.use('/mode', createProxyMiddleware({
  target: 'http://mode-service:3006/api/mode',
  changeOrigin: true,
  pathRewrite: {
    '^/mode': '',
  },
}));

app.use('/users', createProxyMiddleware({
  target: 'http://users-service:3004/api/users',
  changeOrigin: true,
  pathRewrite: {
    '^/users': '',
  },
}));

app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001/api/auth',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
}));

app.listen(PORT, () => {
  console.log(`Gateway Service running on http://localhost:${PORT}/api-docs`);
});
