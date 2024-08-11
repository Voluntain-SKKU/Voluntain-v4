'use strict';

module.exports = {
    // QnA 목록에서 특정 필드만 선택하여 반환하는 컨트롤러
    findQnaData: async ctx => {
        const result = await strapi.query('qna').model.fetchAll({
            columns: ['id', 'title', 'content'],
            withRelated: ['user'] // 'user'와 같은 관계 데이터를 포함할 수 있음
        });

        ctx.send(result);
    },

    // QnA 목록에서 id와 title만 선택하여 반환하는 컨트롤러
    findQnaTitle: async ctx => {
        const result = await strapi.query('qna').model.fetchAll({
            columns: ['id', 'title'],
            withRelated: [] // 관계 데이터를 포함하지 않음
        });

        ctx.send(result);
    }
};
