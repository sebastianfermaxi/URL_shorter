const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({

    userName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        default:null
    },
    cuentaConfirmada:{
        type:Boolean,
        default:false
    },
    imagen:{
        type:String,
        default:null
    }

});

userSchema.pre('save', async function(next){
    
    if(!this.isModified('password')) return next();
    try {
        const salt =  await bcrypt.genSalt(10);
        //console.log(salt)
        const hash = bcrypt.hashSync(this.password,salt)
        //console.log(hash)
        this.password = hash;
        next();
    } catch (error) {
        console.log(error)
        next();
    };
});


userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password); 
};
 
module.exports = mongoose.model('User',userSchema);