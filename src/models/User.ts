import mongoose from "mongoose";

export interface RecipeInterface extends mongoose.Document {
    name: string;
    description: string;
    steps: string;
    ingridients: string;
    image?: string;
    owner: mongoose.Types.ObjectId;
    fav: boolean;
    categories: [string];
}

const RecipeSchema = new mongoose.Schema<RecipeInterface>(
    {

        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: false, default: "no image" },
        steps: { type: String, required: true, default: null },
        ingridients: { type: String, required: true, default: null },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        categories: { type: [String] },
        fav: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const Recipe = mongoose.model<RecipeInterface>("Recipe", RecipeSchema);
export default Recipe;
