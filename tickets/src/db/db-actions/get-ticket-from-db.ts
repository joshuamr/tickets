import { NotFoundError } from "@microservices-learning-tickets/common";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";

export async function getTicket(id: string) {
    // using force because we know the middleware validated the current user
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    return ticket
}