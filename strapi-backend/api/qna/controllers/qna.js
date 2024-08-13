'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    // 특정 lectureId에 속한 QnA를 가져오는 controller
    findByLecture: async ctx => {
        const { lectureId } = ctx.params;

        try {

            const result = await strapi.query('qna').find({
                lecture: lectureId, // lectureId로 필터링
            });

            ctx.send(result);
        } catch (error) {
            ctx.throw(500, `Unable to fetch QnAs for lectureId ${lectureId}`);
        }
    },
    async findByUserId(ctx) {
        let entities;
        if (ctx.query.user_id) {
            entities = await strapi.services.qna.find({ user: ctx.query.user_id });
        } else {
            entities = await strapi.services.qna.find(ctx.query);
        }

        return entities.map(entity =>
            sanitizeEntity(entity, { model: strapi.models.qna })
        );
    },
};