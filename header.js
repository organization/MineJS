// Convert the global variable hierarchy to js code.
// It makes ternjs can understand this project.
// just use command 'node collect', so IDE Intellisense will be work.

/** @namespace minejs */
var minejs = {
  Server: {},
  block: {
    Block: {}
  },
  command: {
    CommandBase: {},
    CommandManager: {},
    CommandSender: {},
    ConsoleCommandSender: {},
    defaults: {
      HelpCommand: {},
      RestartCommand: {},
      StopCommand: {},
      UpdateCommand: {}
    }
  },
  database: {
    Datastore: {},
    Memored: {}
  },
  event: {
    Event: {},
    EventEmitter: {},
    EventPriority: {}
  },
  lang: {
    BaseLang: {}
  },
  network: {
    ProcessProtocol: {}
  },
  permission: {
    Permissible: {},
    PermissibleBase: {},
    Permission: {},
    PermissionAttachment: {},
    PermissionAttachmentInfo: {},
    PermissionRemovedExecutor: {},
    ServerOperator: {}
  },
  raknet: {
    Raknet: {},
    protocol: {
      AcknowledgePacket: {},
      DataPacket: {},
      EncapsulatedPacket: {},
      Packet: {},
      packet: {
        ACK: {},
        ADVERTISE_SYSTEM: {},
        CLIENT_CONNECT_DataPacket: {},
        CLIENT_DISCONNECT_DataPacket: {},
        CLIENT_HANDSHAKE_DataPacket: {},
        DATA_PACKET_0: {},
        DATA_PACKET_1: {},
        DATA_PACKET_2: {},
        DATA_PACKET_3: {},
        DATA_PACKET_4: {},
        DATA_PACKET_5: {},
        DATA_PACKET_6: {},
        DATA_PACKET_7: {},
        DATA_PACKET_8: {},
        DATA_PACKET_9: {},
        DATA_PACKET_A: {},
        DATA_PACKET_B: {},
        DATA_PACKET_C: {},
        DATA_PACKET_D: {},
        DATA_PACKET_E: {},
        DATA_PACKET_F: {},
        NACK: {},
        OPEN_CONNECTION_REPLY_1: {},
        OPEN_CONNECTION_REPLY_2: {},
        OPEN_CONNECTION_REQUEST_1: {},
        OPEN_CONNECTION_REQUEST_2: {},
        PING_DataPacket: {},
        PONG_DataPacket: {},
        SERVER_HANDSHAKE_DataPacket: {},
        UNCONNECTED_PING: {},
        UNCONNECTED_PING_OPEN_CONNECTIONS: {},
        UNCONNECTED_PONG: {}
      }
    },
    server: {
      Session: {},
      SessionManager: {},
      UDPServerSocket: {}
    }
  },
  utils: {
    Binary: {},
    LogLevel: {},
    Logger: {},
    MainLogger: {},
    TextFormat: {},
    Updater: {}
  }
};
