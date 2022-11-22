import { Ticket } from '../ticket'

describe('Ticket', () => {
    it('implements optimistic concurrency control', async () => {
        // create an instance of a ticket
        const ticket = Ticket.build({
            title: 'concert',
            price: 20,
            userId: '123'
        })

        // save the ticket

        await ticket.save()

        // fetch the ticket twice
        const firstInstance = await Ticket.findById(ticket.id)
        const secondInstance = await Ticket.findById(ticket.id)

        // make two separate changes to the tickets
        firstInstance?.set({price: 30})
        secondInstance?.set({price: 40})

        // save the first fetched ticket
        await firstInstance?.save()

        // saving the second fetched ticket should error, because version is out of sync
        await expect(secondInstance?.save()).rejects.toThrow()
    })

    it('increments the version number on save', async () => {
        // create an instance of a ticket
        const ticket = Ticket.build({
            title: 'concert',
            price: 20,
            userId: '123'
        })

        // save the ticket

        await ticket.save()

        // saving the second fetched ticket should error, because version is out of sync
        await expect(ticket.version).toEqual(0)

        ticket.set({price: 30})

        await ticket.save()
        await expect(ticket.version).toEqual(1)
        
        ticket.set({price: 40})

        await ticket.save()
        await expect(ticket.version).toEqual(2)
    })
})