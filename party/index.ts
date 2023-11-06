import type * as Party from 'partykit/server';
import z from 'zod';
import {
  _deleteLayer,
  _toggleLayerVisibility,
  _updateLottieColor,
  _updateSettings,
} from '../utils';

const LottieUploadSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  lottieFile: z.custom<LottieJSON>(),
});

const headers = new Headers({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
});

export default class Server implements Party.Server {
  private sessionData: SessionDetails;

  constructor(readonly party: Party.Party) {
    this.sessionData = {
      roomId: null,
      users: [],
    };
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(
      `Connected:
      id: ${conn.id}
      room: ${this.party.id}
      url: ${new URL(ctx.request.url).pathname}
      `
    );
    this.sessionData.roomId = this.party.id;
  }

  async onMessage(message: string, sender: Party.Connection) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    const action = JSON.parse(message) as Action;
    let lottieFile = (await this.party.storage.get(
      action.data.roomId
    )) as LottieJSON;

    if (action.type !== 'UserJoined' && action.type !== 'UserLeft') {
      this.party.broadcast(`${message}`, [sender.id]);
    }

    switch (action.type) {
      case 'LayerVisibility':
        lottieFile = _toggleLayerVisibility(lottieFile, action.data.layerPath);
        break;
      case 'DeleteLayer':
        lottieFile = _deleteLayer(lottieFile, action.data.layerPath);
        break;
      case 'UpdateColor':
        lottieFile = _updateLottieColor(
          lottieFile,
          action.data.updatedColorMap
        );
        break;
      case 'UpdateSettings':
        lottieFile = _updateSettings(lottieFile, action.data.settings);
        break;
      case 'UserJoined':
        this.sessionData.users.push(action.data);
        const onJoinActiveUsers: ActiveUser = {
          type: 'ActiveUser',
          data: {
            users: this.sessionData.users,
            roomId: this.sessionData.roomId!,
          },
        };
        this.party.broadcast(JSON.stringify(onJoinActiveUsers));
        break;
      case 'UserLeft':
        this.sessionData.users = this.sessionData.users.filter(
          (user) => user.userId !== action.data.userId
        );
        const onLeaveActiveUsers: ActiveUser = {
          type: 'ActiveUser',
          data: {
            users: this.sessionData.users,
            roomId: this.sessionData.roomId!,
          },
        };
        this.party.broadcast(JSON.stringify(onLeaveActiveUsers), [sender.id]);
        break;
      default:
        break;
    }
    await this.party.storage.put(action.data.roomId, lottieFile);
  }

  async onRequest(req: Party.Request): Promise<Response> {
    /* save new json */
    if (req.method === 'POST') {
      try {
        const data = await req.json();
        const validatedData = LottieUploadSchema.safeParse(data);
        if (!validatedData.success) {
          return new Response(
            JSON.stringify({
              message: 'Invalid request',
            }),
            {
              headers,
              status: 400,
            }
          );
        }
        await this.party.storage.put(
          validatedData.data.roomId,
          validatedData.data.lottieFile
        );
        return new Response('success', {
          headers,
          status: 200,
        });
      } catch (e) {
        return new Response(
          JSON.stringify({
            message: 'Failed to load the file',
          }),
          {
            headers,
            status: 500,
          }
        );
      }
    } else if (req.method === 'GET') {
      /* get json */
      const url = new URL(req.url);
      const id = await url.pathname.split('/').slice(-1)[0];
      const lottieFile = await this.party.storage.get(id);
      return new Response(
        JSON.stringify({
          lottieFile: lottieFile,
        }),
        {
          headers,
          status: 200,
        }
      );
    }
    return new Response('success', {
      headers,
      status: 200,
    });
  }
}

Server satisfies Party.Worker;
