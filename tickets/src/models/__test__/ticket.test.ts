import { Ticket } from "../ticket"

it('implements optimistic concurrency control', async () => {
  // Arrange
  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: '123'
  })

  await ticket.save()

  const instance1 = await Ticket.findById(ticket.id)
  const instance2 = await Ticket.findById(ticket.id)

  // Act
  instance1!.set({ price: 10 })
  instance2!.set({ price: 15 })

  // Assert
  await instance1!.save()
  await expect(async () => { await instance2!.save() }).rejects.toThrow()
})

it('increments the version number on multiple saves', async () => {
  // Arrange
  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: '123'
  })

  await ticket.save()

  expect(ticket.version).toEqual(0)


  // Act
  ticket.set({ price: 10 })
  await ticket.save()

  // Assert
  expect(ticket.version).toEqual(1)
})
