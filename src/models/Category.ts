import mongoose, { StringExpressionOperatorReturningBoolean } from "mongoose";

export interface CategoryInterface extends mongoose.Document {
    name: string;
    owner: mongoose.Types.ObjectId;
}

const CategorySchema = new mongoose.Schema<CategoryInterface>(
    {
        name: { type: String, required: true, unique: false },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model<CategoryInterface>("Category", CategorySchema);
export default Category;
