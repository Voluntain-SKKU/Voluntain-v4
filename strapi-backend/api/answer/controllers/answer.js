'use strict';

/**
 * answer.js controller
 *
 * @description: A set of functions called "actions" for managing `answer`.
 */

module.exports = {
    // Find answers by QnA ID
    async findByQna(ctx) {
        const { qnaId } = ctx.params;

        try {
            console.log(`Fetching answers for QnA ID: ${qnaId}`);

            const result = await strapi.query('answer').find({
                qna: qnaId, // qna ID로 필터링
            });

            ctx.send(result);
        } catch (error) {
            console.error(`Error fetching answers for QnA ID ${qnaId}:`, error);
            ctx.throw(500, `Unable to fetch answers for QnA ID ${qnaId}`);
        }
    },
};
