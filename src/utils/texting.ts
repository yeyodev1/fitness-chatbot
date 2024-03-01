interface Provider {
  vendor?: {
    sendPresenceUpdate: (status: string, id: string) => Promise<void>;
  };
}

interface Context {
  key: {
    remoteJid: string;
  };
}

const typing = async function (ctx: Context, provider: Provider): Promise<void> {
  if (provider && provider.vendor?.sendPresenceUpdate) {
      const id: string = ctx.key.remoteJid;
      await provider.vendor.sendPresenceUpdate('composing', id);
  }
}

export default typing;