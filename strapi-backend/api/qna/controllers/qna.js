'use strict';

module.exports = {
    // 특정 lectureId에 속한 QnA를 가져오는 controller
    findByLecture: async ctx => {
        const { lectureId } = ctx.params;

        try {
            const result = await strapi.query('qna').model.fetchAll({
                columns: ['id', 'title', 'content'],
                withRelated: ['user'], // 'user' 필드를 포함하여 관련 데이터를 가져옵니다.
                where: { lecture: lectureId },
            });

            ctx.send(result);
        } catch (error) {
            ctx.throw(500, `Unable to fetch QnAs for lectureId ${lectureId}`);
        }
    },
};