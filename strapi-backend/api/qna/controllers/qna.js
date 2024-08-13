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

    // 특정 userId로 QnA를 가져오는 controller
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

    // QnA ID로 조회할 때 views 증가시키는 controller
    async findAndIncrementViews(ctx) {
        const { id } = ctx.params;

        try {
            // QnA 엔티티 가져오기
            const entity = await strapi.services.qna.findOne({ id });

            if (!entity) {
                return ctx.throw(404, 'QnA not found');
            }

            // 조회수 증가
            const updatedEntity = await strapi.services.qna.update({ id }, {
                views: entity.views + 1,
            });

            return sanitizeEntity(updatedEntity, { model: strapi.models.qna });
        } catch (error) {
            ctx.throw(500, `Unable to fetch and update views for QnA ID ${id}`);
        }
    },
};
