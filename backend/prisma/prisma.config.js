require('dotenv').config();
const { defineConfig } = require('prisma/config');

console.log("Checking DIRECT_URL:", process.env.DIRECT_URL ? "Found" : "Missing");

module.exports = defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    }
})