import mongoose from "mongoose";

export interface CategoryInterface extends mongoose.Document {
    name: string;
}

const CategorySchema = new mongoose.Schema<CategoryInterface>(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<CategoryInterface>("Category", CategorySchema);
export default Category;
