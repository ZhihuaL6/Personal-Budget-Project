const envelopesRouter = require('express').Router();

const pool = require('../db/db');

module.exports = envelopesRouter;

const { Pool } = require('pg');

const checkExistingEnvelope = async (req, res, next) => {
  try {
        const { envelopeId } = req.params;
        const Envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [envelopeId]);
        if (Envelope.rowCount < 1) {
            return res.status(404).send({
                message: "There is no envelope with this id"
            });
        } else {
            req.envelope = Envelope;
            next();
        };
    } catch (error) {
        res.status(500).send(error);
    };
};
/**
 * @swagger
 * /api/envelopes:
 *    get:
 *      summary: Get all envelopes
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      responses:
 *        "200":
 *          description: Returns a list of all envelopes
 *
 */
 
envelopesRouter.get('/', async (req, res) => {
    try {
        const allEnvelopes = await pool.query('SELECT * FROM envelopes ORDER BY id');
        if (allEnvelopes.rowCount < 1) {
            return res.status(404).send({
                message: "There are no envelopes"
            });
        };
        res.status(200).send({
            status: 'Success',
            message: 'Envelopes info retrieved!',
            data: allEnvelopes.rows,
        });
    } catch (err) {
        console.error(err.message);
    };
});

/**
 * @swagger
 * /api/envelopes/{id}:
 *   get:
 *     summary: Get an envelope by ID
 *     produces:
 *      - application/json
 *     tags:
 *      - Envelopes
 *     parameters:
 *      - in : path
 *        name: id
 *        description: envelope id
 *        type: integer
 *        required: true
 *        example: 1
 *     responses:
 *      "200":
 *        description: Returns an envelope with its details
 *      "404":
 *        description: Envelope not found
 *      "500":
 *        description: Internal server error
 */


envelopesRouter.get('/:envelopeId', checkExistingEnvelope , (req, res) => {
    res.status(200).send({
            status: 'Success',
            message: 'Envelope information retrieved!',
            data: req.envelope.rows[0]
        });
});

/**
 * @swagger
 * /api/envelopes:
 *   post:
 *     summary: Creates a new envelope
 *     produces:
 *       - application/json
 *     tags:
 *       - Envelopes
 *     requestBody:
 *       description: Data for the new envelope
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              budget:
 *                type: integer
 *            example:
 *              title: Travel
 *              budget: 200
 *     responses:
 *       "201":
 *         description: Returns created envelope
 *       "500":
 *         description: Internal server error
 */

 envelopesRouter.post('/', async (req, res) => {
     try {
         const { title, budget } = req.body;
         const lastId = await pool.query('SELECT MAX(id) FROM envelopes;');
         const newId = await lastId.rows[0].max + 1;
         const newEnvelope = await pool.query('INSERT INTO envelopes (id, title, budget) VALUES ($1, $2, $3) RETURNING *',
         [newId, title, budget]);

         res.status(201).send({
            status: 'Success',
            message: 'New envelope created!',
            data: {
                id: newId,
                title,
                budget
            }
         })
     } catch (error) {
          res.status(500).send(error)
     }
 })

 	
/**
 * @swagger
 * /api/envelopes/{id}:
 *   put:
 *     summary: Updates an existing envelope
 *     produces:
 *        - application/json
 *     tags: 
 *        - Envelopes
 *     parameters:
 *        - in: path
 *          name: id
 *          description: envelope ID to update
 *          type: integer
 *          required: true
 *          example: 1
 *     requestBody:
 *       description: New data for the existing envelope
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                budget:
 *                  type: integer
 *              example:
 *                title: game
 *                budget: 60
 *     responses:
 *       "201":
 *         description: envelope updated 
 *       "404":
 *         description: Envelope not found
 *       "500": 
 *         description: Internal server error
 */
 envelopesRouter.put('/:envelopeId', checkExistingEnvelope,  async (req, res) => {
    try {
        const { envelopeId } = req.params;
        const { title, budget } = req.body;
        const transactionSum = await pool.query('SELECT SUM(cost) as total FROM transactions WHERE envelope_id = $1', [envelopeId]);
        const totalTran = await transactionSum.rows[0].total;
        // check if current total expense is higher than updated budget
        if (totalTran > budget){
            return res.status(400).send({
                message: "New budget is below current total expneses"
            });
        } else { const updatedEnvelope = await pool.query('UPDATE envelopes SET title = $1, budget = $2 WHERE id = $3', 
        [title, budget, envelopeId]);

        res.status(201).send({
            status: 'Success',
            message: 'The envelope has been updated!',
            data: {
                id: parseInt(envelopeId),
                title,
                budget
                }
            });
        }
       
    } catch (error) {
        res.status(500).send(error);
    };
}); 

/**
 * @swagger
 * /api/envelopes/{id}:
 *   delete:
 *     summary: Deletes a specific envelope
 *     produces: 
 *       - application/json
 *     tags: 
 *       - Envelopes
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Envelope ID to delete
 *         type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       "204":
 *         description: The envelope and its transactions has been deleted
 *       "404":
 *         description: Envelope not found
 *       "500":
 *         description: Internal server error
 */
 envelopesRouter.delete('/:envelopeId', checkExistingEnvelope, async (req, res) => {
    const { envelopeId } = req.params;
    const deletedEnvelope = await pool.query('DELETE FROM envelopes WHERE id = $1', [envelopeId]);
    res.status(204).send(); 
});


/**
 * @swagger
 * /api/envelopes/{fromId}/transfer/{toId}:
 *   post:
 *     summary: Transfer an amount from a speific envelope to another one
 *     produces:
 *        - application/json
 *     tags: 
 *        - Envelopes
 *     parameters:
 *        - in: path
 *          name: fromId
 *          description: envelope id (from)
 *          type: integer
 *          required: true
 *          example: 1
 *        - in: path
 *          name: toId
 *          description: envelope id (to)
 *          type: integer
 *          required: true
 *          example: 2
 *     requestBody:
 *         description: Amount to transfer
 *         required: true
 *         content:
 *            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  amount:
 *                    type: number
 *                example:
 *                  amount: 10
 *     responses:
 *        "201":
 *          description: Returns updated envelopes
 *        "404":
 *          description: Envelopes not found
 *        "500":
 *          desription: Internal server error
 */
envelopesRouter.post('/:fromId/transfer/:toId', async (req, res) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;

        const transactionSum = await pool.query('SELECT SUM(cost) as total FROM transactions WHERE envelope_id = $1', [fromId]);
        const totalTran = await transactionSum.rows[0].total;
        const envelopeBudget = await pool.query('SELECT budget FROM envelopes WHERE id = $1', [fromId]);
        const totalBud = await envelopeBudget.rows[0].budget;
        // check if current remaining balance is less than transfer amount
        if (totalBud - amount < totalTran ){
            return res.status(400).send({
                message: "Not enough budget to transfer! Transfer failed "
            });
        } else {
            const transferFrom = await pool.query('UPDATE envelopes SET budget = budget - $1 WHERE id = $2', [amount, fromId]);
            const transferTo =  await pool.query('UPDATE envelopes SET budget = budget + $1 WHERE id = $2', [amount, toId]);
            res.json(`The budget of the envelopes number ${fromId} and ${toId} have been successfully updated`);
        }

    } catch (error) {
        console.error(error.message);
    };
});   