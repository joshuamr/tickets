export const natsClient = {
    client: {
        on: jest.fn(), 
        publish: jest
            .fn()
            .mockImplementation((subject: string, data: string, callback: () => void) => {
        callback()
    }),
},
    connect: jest.fn(),
}