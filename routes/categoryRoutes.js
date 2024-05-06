import express from 'express'
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getSingleCategoryController, updateCategoryController } from '../controller/categoryController.js'

const routes = express.Router()

//create category route
routes.post('/create-category', createCategoryController);

//get all categories route
routes.get('/all-categories',getAllCategoriesController);
http://localhost:4300/app/v1/all-categories

//get single Category route
routes.get('/single-category/:name',getSingleCategoryController);

// delete Category route
routes.delete('/delete-category/:id',deleteCategoryController);

//update category route
routes.put('/update-category/:id',updateCategoryController);



export default routes