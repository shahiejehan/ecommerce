

//create category contoller

import slugify from "slugify";
import categoryModel from "../model/categoryModel.js"

//Create Ctegory Controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        // console.log(req.body)
        //validation
        if (!name) {
            return res.status(404).send({ message: "name is required" })
        }
        //existing catagory
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "category already Exists"
            })
        }
        //adding new category
        const category = await new categoryModel({
            name,
            slug: slugify(name)
        })
        await category.save()
        // console.log(category)
        res.status(200).send({
            success: true,
            message: "Category Created/Added Successfully",
            category
        })



    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong in create controller",
            error,
        })
    }
}


// get All Categories Controller
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        res.status(200).send({
            success: true,
            message: "List of All Categories",
            categories
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while getting Categories",
            error,
        })
    }
}

// get single category controller
export const getSingleCategoryController = async (req, res) => {
    try {
        // const {name} = req.params.name;
        const singlecategory = await categoryModel.findOne({ name: req.params.name })
        res.status(200).send({
            success: true,
            message: "showing category  here!!",
            singlecategory,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wromg while getting Category",
            error,
        })
    }
}

// delete category controller
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await categoryModel.findByIdAndDelete(id)

        res.status(200).send({
            success: true,
            message: "category Deleted Successfully",

        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went Wrong While Deleting category",
            error,
        })
    }
}

//update Category Controller
export const updateCategoryController = async (req, res) => {

    try {
        const { id } = req.params;
        // console.log(id)
        const { name } = req.body;
        //validation
        if (!name) {
            return res.status(404).send({ message: "name is required" })
        }


        const updatedcategory = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "category updated",
            updatedcategory,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "something went wrong while updating",
            error,
        })
    }

}