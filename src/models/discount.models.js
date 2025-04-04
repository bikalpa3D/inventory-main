
import mongoose,{Schema} from "mongoose";



const DiscountSchema = new Schema({
    name: { type: String, required: true },
    percentage: { type: Number, required: true }
  }, { timestamps: true });
  

  export const Discount = mongoose.model("Discount", DiscountSchema);