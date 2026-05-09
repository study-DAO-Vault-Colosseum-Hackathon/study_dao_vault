require('dotenv').config();
const { defineConfig } = require('prisma/config');

console.log("Checking DATABASE_URL:", process.env.DATABASE_URL ? "Found" : "Missing");

module.exports = defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    }
})