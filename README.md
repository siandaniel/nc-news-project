# Northcoders News

## Introduction

Northcoders News is an interactive API that enables users to post news articles on stories they are passionate about, whilst interacting with other users' articles through votes and comments. Articles are grouped into topics for easy access to stories that meet the users' interests, allowing the user to submit a wide range of queries to suit their needs.

## URL

The production version of Northcoders News is hosted via Render and can be accessed at the following URL:

>https://nc-news-5aio.onrender.com/

Please refer to the '/api' endpoint for a list of all available API endpoints:

>https://nc-news-5aio.onrender.com/api

## Features

- Users can access all articles, topics and comments via **GET** requests.
- Individual articles can be accessed through a unique article ID.
- Articles can be filtered by topic to tailor to the users' interests and users can utilise 'sort_by' and 'order' queries to specify how their results are presented.
- Users can post comments on articles via **POST** requests and delete them via **DELETE** requests.
- Users can add votes to articles via **PATCH** requests to the articles' 'votes' column.

## Installation Guide

1. Clone this repository to your local machine via your terminal using command *'git clone https://github.com/siandaniel/nc-news-project'* in your chosen directory location.

2. Run *'npm install'* to install all dependencies. You will need:
>- **node** *v18.13.0*
>- **postgreSQL** *v8.7.3*
>- **pg-format** *v1.0.4*
>- **supertest** *v6.3.3*
>- **jest** *v27.5.1*
>- **jest-sorted** *v1.0.14*
>- **express** *v4.18.2*
>- **dotenv** *v16.0.0*
>- **husky** *v8.0.2*

3. Use command *'npm run setup-dbs'* to initialise the test and development databases on your local machine.

4. Create the following environment variables to allow for the API to access the development and test databases:

>- **.env.development** - Add command *'PGDATABASE=nc_news'* to set access to the developer database.
>
>- **.env.test** - Add command *'PGDATABASE=nc_news_test'* to set access to the test database when Jest is running.

5. Use command *'npm run seed'* to seed your local development database. 

6. Test features using jest via command *'npm test'*.

7. Use command *'npm run start'* to start the app on local port 9090. Software such as Insomnia can then be used to test app features on the development database.
