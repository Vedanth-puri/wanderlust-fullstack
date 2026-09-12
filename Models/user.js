const mongoose = require("mongoose");
let schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose").default;

let userSchema = new schema({
    email : {
        type : String,
        required : true,
    },
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);