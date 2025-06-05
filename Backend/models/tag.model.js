import mongoose from 'mongoose';
import slugify from 'slugify';



const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true
    }
  }, { timestamps: true })

tagSchema.pre('save',(next)=>{
  if(this.isModified('name')){
    this.slug = slugify(this.name,{lowercase:true,strict:true});
  }
  next();
})

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
