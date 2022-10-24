import mongoose from 'mongoose'
import {Password} from '../services/password'

interface UserAttrs {
	email: string;
	password: string;
}

// describes a user model
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc
}

// describes a user document
interface UserDoc extends mongoose.Document{
	email: string;
	password: string;
	createdAt: string;
	updatedAt: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	toJSON: {
		// first arg is the doc, second is the JSON return value
		transform(doc, ret) {
			delete ret.password;
			delete ret.__v;
			ret.id = ret._id
			delete ret._id
		}
	}
})

userSchema.statics.build = function buildUser(attrs: UserAttrs) {
	return new User(attrs)
}

userSchema.pre('save', async function(done){
	if (this.isModified('password')) {
		const hashedPassword = await Password.toHash(this.get('password'))
		this.set('password', hashedPassword)
	}
	done()
})

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)