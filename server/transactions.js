const transactionsRouter = require('express').Router();
const pool = require('../db/db');
module.exports = transactionsRouter;


const { Pool } = require('pg');
//middleware checkExistingTransaction
const checkExistingTransaction = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId])
        if (transaction.rowCount < 1){
            return res.status(404).send({
                message: 'There is no transaction with this id'
            });
        } else {
            req.transaction = transaction;
            next();
        };
    } catch (error) {
        res.status(500).send(error);
    }
};

/**
 * @swagger
 * /api/transactions:
 *    get:
 *      summary: Get all transactions
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      responses:
 *        "200":
 *          description: Returns a list of all transactions
 *
 */
 transactionsRouter.get('/', async (req, res) => {
    try {
        const allTransactions = await pool.query('SELECT * FROM transactions ORDER BY id');
        if (allTransactions.rowCount < 1) {
            return res.status(404).send({
                message: "There are no transactions"
            });
        };
        res.status(200).send({
            status: 'Success',
            message: 'Transaction information retrieved!',
            data: allTransactions.rows,
        });
    } catch (err) {
        console.error(err.message);
    };
});

/**
 * @swagger
 * /api/transactions/envelope/{id}:
 *    get:
 *      summary: Get all transactions in an envelope
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      parameters:
 *      - in : path
 *        name: id
 *        description: envelope id
 *        type: integer
 *        required: true
 *        example: 1
 *      responses:
 *        "200":
 *          description: Returns a list of all transactions in an envelope
 *        "404":
 *          description: Transaction not found
 *        "500":
 *          description: Internal server error
 *
 */
 transactionsRouter.get('/envelope/:envelopeId', async (req, res) => {
    try {
        const { envelopeId } = req.params;
        const allTransactionsById = await pool.query('SELECT * FROM transactions WHERE envelope_id = $1 ORDER BY id', [envelopeId]);
        if (allTransactionsById.rowCount < 1) {
            return res.status(404).send({
                message: "There are no transactions in this envelope"
            });
        };
        res.status(200).send({
            status: 'Success',
            message: 'Transaction information retrieved!',
            data: allTransactionsById.rows,
        });
    } catch (err) {
        console.error(err.message);
    };
});


/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by Id
 *     produces:
 *      - application/json
 *     tags:
 *      - Transactions
 *     parameters:
 *      - in : path
 *        name: id
 *        description: transaction id
 *        type: integer
 *        required: true
 *        example: 1
 *     responses:
 *      "200":
 *        description: Returns a transaction with its details
 *      "404":
 *        description: Transaction not found
 *      "500":
 *        description: Internal server error
 */
 transactionsRouter.get('/:transactionId', checkExistingTransaction, (req, res) => {
        res.status(200).send({
            status: 'Sucess',
            message: 'Transaction information retrieved!',
            data: req.transaction.rows[0]
        }); 
});  

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Creates a new transaction
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     requestBody:
 *       description: Data for the new transaction
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              envelope_id:
 *                type: integer
 *              description:
 *                type: string
 *              cost:
 *                type: number
 *            example:
 *              envelope_id: 1
 *              description: tips
 *              cost: 10
 *     responses:
 *       "201":
 *         description: Returns created transaction
 *       "500":
 *         description: Internal server error
 */
 transactionsRouter.post('/', async (req, res) => {
    try {
        const { description, cost, envelope_id } = req.body;
        const transactionSum = await pool.query('SELECT SUM(cost) as total FROM transactions WHERE envelope_id = $1', [envelope_id]);
        const envelopeBudget = await pool.query('SELECT budget FROM envelopes WHERE id = $1', [envelope_id]);
        const totalTran = await transactionSum.rows[0].total;
        const totalBud = await envelopeBudget.rows[0].budget;
        // check if newly added cost will make budget exceed
        if (totalBud < totalTran + cost){
            return res.status(400).send({
                message: "exceeding budget"
            });
        };
        
        const date = new Date();
        const lastId = await pool.query('SELECT MAX(id) FROM transactions;'); 
        const newId = await lastId.rows[0].max + 1;
        const newTransaction = await pool.query('INSERT INTO transactions (id, envelope_id, date, description, cost) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [newId, envelope_id, date, description, cost]);

        res.status(201).send({
            status: 'Sucess',
            message: 'New transaction created!',
            data: {
                id: newId,
                envelope_id,
                date,
                description,
                cost
            }
        });
    } catch (error) {
        res.status(500).send(error)
    };
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Updates an existing transaction and change envelope's budget
 *     produces:
 *        - application/json
 *     tags: 
 *        - Transactions
 *     parameters:
 *        - in: path
 *          name: id
 *          description: transaction ID to update
 *          type: integer
 *          required: true
 *          example: 1
 *     requestBody:
 *       description: New data for the existing transaction
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                envelope_id:
 *                  type: integer
 *                description:
 *                  type: string
 *                cost:
 *                  type: number
 *              example:
 *                envelope_id: 1
 *                description: Gift
 *                cost: 150
 *     responses:
 *       "201":
 *         description: transaction updated 
 *       "404":
 *         description: Transaction not found
 *       "500": 
 *         description: Internal server error
 */
 transactionsRouter.put('/:transactionId', checkExistingTransaction, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { envelope_id, description, cost } = req.body;
       
        await pool.query('BEGIN');
        const updatedTransaction = await pool.query('UPDATE transactions SET envelope_id = $1, description = $2, cost = $3 WHERE id = $4', 
        [envelope_id, description, cost, transactionId]);

        const transactionSum = await pool.query('SELECT SUM(cost) as total FROM transactions WHERE envelope_id = $1', [envelope_id]);
        const envelopeBudget = await pool.query('SELECT budget FROM envelopes WHERE id = $1', [envelope_id]);
        const totalTran = await transactionSum.rows[0].total;
        const totalBud = await envelopeBudget.rows[0].budget;

        if (totalBud < totalTran){
            await pool.query('ROLLBACK');
            return res.status(400).send({
                message: "exceeding budget"
            });
        };
        await pool.query('COMMIT');
        
        res.status(201).send({
            status: 'Success',
            message: 'The transaction has been updated!'
        });
    } catch (error) {
        res.status(500).send(error);
    };
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Deletes an specific transaction
 *     produces: 
 *       - application/json
 *     tags: 
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Transaction ID to delete
 *         type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       "204":
 *         description: Transaction deleted
 *       "404":
 *         description: Transaction not found
 *       "500":
 *         description: Internal server error
 */
 transactionsRouter.delete('/:transactionId', checkExistingTransaction, async (req, res) => {
    const { transactionId } = req.params;
    const deletedTransaction = await pool.query('DELETE FROM transactions WHERE id = $1', [transactionId]);
    res.status(204).send(); 
});   

