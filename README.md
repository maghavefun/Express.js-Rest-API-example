## test Rest API

An application as example of rest API on Node.js

### Technologies

- Node.js
- Typescript
- MySQL
- Sequelize
- Express
- Jest

### Installation

1\. Install MySQL

```
https://dev.mysql.com/downloads/mysql/
```

2\. Clone project

```
git clone https://github.com/maghavefun/Node.js-Rest-API-example.git
```

3\. Install dependencies

```
npm install
```

4\. Install ts-node globally

```
npm install ts-node -g
```

5\. Create a file named `.env` in the root directory with such contents

```
SRV_PORT = 3333

DB_USER = username
DB_PASS = password
DB_NAME = your local database name
DB_HOST = localhost
DB_PORT = your MySQL server port

NODE_ENV = development

ACCESS_TOKEN_SECRET = fd91a7ea8ae91a47fb8bc8ef106969bcb1cc47861ef8a5cb93f63b63600edad063ff4161f2049af85d1057babac7da33dd89bef1489e5
REFRESH_TOKEN_SECRET = 653ec21b3d123c1eda6325a6167acaa547c5ac99dfb90f89888d132b4c45375a0dbb4cfd902e118d1a4fb9696e19ea7aba4682ad8bb5
SALT = $2a$10$0MFqT2lasdJkIQOtz68tmO
```

Important note: if you have custom DB config - you should modify the file to match your configuration. This snippet is compatible with the default configuration, if you have MySQL running on your local machine. We currently do not validate environmental variables, so you might not be able to start the app with one of those missing.

### Running

In order to start the application during development use the following:

```
npm run start-dev
```

This script uses nodemon to start our application for easier development process.

### Building

In order to build your project, run:

```
npm run build
```

### Testing

#### Running tests

In order to run all tests

```
npm test
```

In order to run a specific test:

Example: file that you want to test is `unit.userController.test.ts`

```
npm test -- userController
```

You only have to provide a piece by which jest can identify the test file you want to run.

#### Collecting coverage

In order to collect a coverage report:

```
npm run coverage
```

The output will be displayed in your terminal window and saved in an .html file inside the `coverage` folder in project's root.

### How can I check API endpoints?
You can checkout it in postman. You need to import postman configuration via this link:
```
https://www.getpostman.com/collections/6d286b49902e02dd32fb
```
