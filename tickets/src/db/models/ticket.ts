import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
interface TicketAttrs {
	title: string;
	price: number;
	orderId?: string | null;
	userId: string;
}

// describes a Ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

// describes a Ticket document
export interface TicketDoc extends mongoose.Document{
	title: string;
	price: number;
	userId: string;
	createdAt: string;
	updatedAt: string;
	version: number;
	orderId?: string;
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
	},
	orderId: {
		type: String,
		required: false
	}
}, {
	toJSON: {
		// first arg is the doc, second is the JSON return value
		transform(doc, ret) {
			ret.id = ret._id
			delete ret._id
		}
	}
})

// sets the version property correctly
TicketSchema.set('versionKey', 'version')
TicketSchema.plugin(updateIfCurrentPlugin)

TicketSchema.statics.build = function buildTicket(attrs: TicketAttrs) {
	return new Ticket(attrs)
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)