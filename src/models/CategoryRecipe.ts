import mongoose from "mongoose";

export interface CategoryRecipeInterface extends mongoose.Document {
    categoryId: mongoose.Types.ObjectId;
    recipeId: mongoose.Types.ObjectId;
}

const CategoryRecipeSchema = new mongoose.Schema<CategoryRecipeInterface>(
    {
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    },
    {
        timestamps: true,
    }
);

CategoryRecipeSchema.index({ categoryId: 1, recipeId: 1 }, { unique: true });

const CategoryRecipe = mongoose.model<CategoryRecipeInterface>("CategoryRecipe", CategoryRecipeSchema);
export default CategoryRecipe;
