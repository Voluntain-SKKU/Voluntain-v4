'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const bcrypt = require('bcryptjs');

module.exports = {
    // auth controller 내의 checkEmail 함수
    async checkEmail(ctx) {
        const { email } = ctx.request.body;
        try {
            const user = await strapi.services.auth.findOne({ email });
            if (user) {
                ctx.send({ message: "Email is already in use." }, 409);
            } else {
                ctx.send({ message: "Email is available." });
            }
        } catch (error) {
            ctx.send({ message: "An error occurred during the email check." }, 500);
        }
    },
    async signIn(ctx) {
        const { email, password } = ctx.request.body;

        console.log("ok");
        // 이메일로 사용자 찾기
        const user = await strapi.services.auth.findOne({ email });
        if (!user) {
            return ctx.badRequest('User not found');
        }
        console.log("ok");

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return ctx.badRequest('Invalid password');
        }

        ctx.send({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    },
    async signUp(ctx) {
        const { username, email, password } = ctx.request.body;

        if (!email || !username || !password) {
            return ctx.badRequest('Missing username, email, or password');
        }

        const existingUser = await strapi.services.auth.findOne({ email });
        if (existingUser) {
            return ctx.badRequest('Email is already in use');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await strapi.services.auth.create({
                username,
                email,
                password: hashedPassword
            });

            ctx.send({
                id: user.id,
                username: user.username,
                email: user.email
            }, 201);
        } catch (error) {
            ctx.send({ message: 'Unable to create user.' }, 500);
        }
    },
};
