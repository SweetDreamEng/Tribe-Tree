const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  },
  email: {
      type: String
  },
  resetPassword: {
      token: {
          type: String,
          default: null
      },
      expires: {
          type: Date,
          default: null
      }
  }
})

//Hash passwords on new user
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
})

//Hash password on update user
userSchema.pre("findOneAndUpdate", function(next) {
    const password = this.getUpdate().password;
    if (!password) return next()
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return next(err)
        this.getUpdate().password = hash;
        next()
    })
});

//bcrypt compare hashes
userSchema.methods.comparePassword = function (reqPassword, next) {
  bcrypt.compare(reqPassword, this.password, (err, isMatch) => {
    if (err) return next(err)
    next(null, isMatch)
  })
}

// Create token for reseting user password
userSchema.methods.resetPasswordToken = function(next){
    //Generate random string of len 32:
    require('crypto').randomBytes(32, (err, buffer)=>{
        if(err)return next(err)
        var token = buffer.toString('hex')
        //Create token, expiring 6 hours from current time
        this.resetPassword = {
            token: token, expires: new Date(new Date().setHours(new Date().getHours()+6))
        }
        this.markModified(this)
        this.save((err)=>{
            if(err){next(err)}
            else{
                console.log(token)
                next(null, token)
            }
        })
    })
}

module.exports = mongoose.model('User', userSchema)