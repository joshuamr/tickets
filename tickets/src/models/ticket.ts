import mongoose from 'mongoose'

interface TicketAttrs {
	title: string;
	price: number;
	userId: string
}

// describes a Ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

// describes a Ticket document
interface TicketDoc extends mongoose.Document{
	title: string;
	price: number;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

const TicketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
}, {
	toJSON: {
		// first arg is the doc, second is the JSON return value
		transform(doc, ret) {
			delete ret.__v;
			ret.id = ret._id
			delete ret._id
		}
	}
})

TicketSchema.statics.build = function buildTicket(attrs: TicketAttrs) {
	return new Ticket(attrs)
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)