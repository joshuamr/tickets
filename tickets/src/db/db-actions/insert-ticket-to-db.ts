import { Ticket } from "../models/ticket";

export interface CreateTicketParams {
    title: string;
    price: number;
    userId: string;
}


export async function insertTicketToDb({ title, price, userId }: CreateTicketParams) {
    const ticket = Ticket.build({ title, price, userId });

    await ticket.save();
    return ticket
}