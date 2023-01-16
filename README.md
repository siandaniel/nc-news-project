# Northcoders News API

## Purpose

This API is for the purpose of accessing data on news articles programmatically, via a PSQL database.

## Setup

In order to successfully navigate around the API, you will need to create and set up the following environment variable files to allow for the API to access the development and test databases:

1. .env.development - Use command 'PGDATABASE=nc_news' to set access to the developer database.

2. .env.test - Use command 'PGDATABASE=nc_news_test' to set access to the test database when Jest is running.