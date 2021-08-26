//mount routers to apiRouter

const apiRouter = require('express').Router();

const envelopesRouter = require('./envelopes');
apiRouter.use('/envelopes', envelopesRouter);

const transactionsRouter = require('./transactions');
apiRouter.use('/transactions', transactionsRouter);

const docsRouter = require('./swaggerDocs');
apiRouter.use('/docs', docsRouter);

module.exports = apiRouter;

