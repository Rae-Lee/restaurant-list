# My Restaurant List
![--------](/public/image/restaurant-list-logo.png)

## :pencil: About the project
My Restaurant List is a project to display all the restaurants I stored. It helps find the restaurants through searching the keywords or categories.Also it helps add and edit restaurants.

![](/public/image/launch-page.png)
## :book: Feature
 - Display all restaurants on homepage.
 - Click restaurants to check its description.
 - Search restaurants by name and category.
 - Connect to Google Maps.
 - Add restaurants to pages.
 - Edit and delete restaurants.

## :flower_playing_cards: Site
### Show page

![](/public/image/description.PNG)
### Search
![](/public/image/search-demo.gif)
### Add restaurant
![](/public/image/add-restaurant.PNG)
### Edit/Delete restaurant
![](/public/image/edit-and-delete-restaurant.PNG)
## :floppy_disk:Usage
### Getting Start
1. Install Node
Download Node:https://nodejs.org/en/

2. Clone the project 
```js
git clone https://github.com/Rae-Lee/restaurant-list.git
```

3. Open the project and download Express, Express-Handlebars, Mongoose, Dotenv, and Method-override
```js
npm init -y
```
```js
npm i express@4.16.4
```
```js
npm i express-handlebars@3.0.0
```
```js
npm i mongoose
```
```js
npm i dotenv
```
```js
npm i method-override
```
4. Connect to MongoDB, create a database and add MongoDB_URI to .env.example file.

5. Add seeds dataset to database
```js
npm run seed
```
6. Run the project
```js
npm run start
```
Execute successfully if seeing following message
```js
It is running on http://localhost:3000
```
and you can type" http://localhost:3000 "on your browser to open it.

##  To-do
- Sort restaurants by rating
- choose restaurants by location
## Built with
- Node.js 
- Express 4.16.4
- Express-Handlebars 3.0.0
- Bootstrap 5.2.0
- Font-awesome 
- method-override 3.0.0
- mongoose 6.5.1
##  License
MIT © [Rae Lee](https://github.com/Rae-Lee)