import type * as Party from 'partykit/server';

export default class Chat implements Party.Server {
  private messages: Message[];

  constructor(readonly party: Party.Party) {
    this.messages = [];
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(
      `Connected:
      id: ${conn.id}
      room: ${this.party.id}
      url: ${new URL(ctx.request.url).pathname}
      `
    );
    this.party.broadcast(JSON.stringify(this.messages));
  }

  async onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    const newMessage = JSON.parse(message) as Message;
    this.messages.push(newMessage);
    this.party.broadcast(message);
  }
}

Chat satisfies Party.Worker;
