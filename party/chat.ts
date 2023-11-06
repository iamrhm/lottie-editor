import type * as Party from 'partykit/server';

const headers = new Headers({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
});

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
  }

  async onMessage(message: string, sender: Party.Connection) {
    const newMessage = JSON.parse(message) as Message;
    this.messages.push(newMessage);
    this.party.broadcast(message);
  }

  async onRequest(req: Party.Request): Promise<Response> {
    if (req.method === 'GET') {
      /* GET all the messages when user connects to the server */
      return new Response(
        JSON.stringify({
          message: this.messages,
        }),
        {
          headers,
        }
      );
    }
    return new Response('success', {
      headers,
      status: 200,
    });
  }
}

Chat satisfies Party.Worker;
