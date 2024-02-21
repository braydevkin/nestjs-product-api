#### Product Content API - Brayan Quirino

<small>The project consists of creating an API that consumes product data from the Contentful API.</small>
</br>

##### Main features

- [x] <small>Routine that retrieves products from the contentful API, translates them and saves them in a no-SQL database.</small>
- [x] <small>Simple user registration based on email credentials and password.</small>
- [x] <small>Route control using Auth Guard with JWT</small>
- [x] <small>GET of products based on filters and paginated.</small>
- [x] <small>Summary containing information on deleted products within a time range</small>

##### Application Routes 

``GET /products`` - Obtain products based on filters.
``GET /summary`` - Displays a summary showing the number of deleted products.
``DELETE /products/:_id`` Delete a product

<small>Run project and access - Swagger API Docs</small>
```
http://localhost:3000/api/docs
```

##### How to run ?

```
docker compose up
```

- [x] MongoDB Image
- [x] MongoDB Express Image
- [x] Redis
- [x] Product API App

##### How to observe data ?

<small>Run project and access - MongoDB Express</small>
```
http://localhost:8081
```

##### How to run tests ?

```
#e2e
docker-compose -f docker-compose.e2e.yaml up --exit-code-from app
```

```
#unit coverage
yarn test:cov
```

<small>The established minimum coverage was 95%.</small>


##### Technical decisions

- <strong>Clean Architecture</strong>
<small>Decide to use Clean Architecture to create the project with a view to dividing system responsibilities, maintenance and scalability. With this architecture it is possible to de-structure responsibilities and focus on each layer.</small>


- <strong>BullMQ</strong>
<small>One of the application's requirements is to run a routine that saves data every hour, so I chose BullMQ, which makes it possible to create work routines that call processes that in turn consume the messages saved in a Redis.</small>


##### Github Actions 

<small>Continuous integration that checks and guarantees the quality of the application by running unit tests, integration tests and format validation tests.</small>