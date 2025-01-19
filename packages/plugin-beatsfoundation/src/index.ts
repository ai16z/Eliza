import { Plugin } from "@elizaos/core";
import GetSongById from './actions/GetSongById';
import GetSongs from './actions/GetSongs';
import CreateSong from './actions/CreateSong';

export const beatsfoundationPlugin: Plugin = {
  name: 'beatsfoundation',
  description: 'Beats Foundation plugin for ElizaOS',
  clients: [],
  actions: [GetSongById, GetSongs, CreateSong],
  services: [],
  providers: [],
};

export default beatsfoundationPlugin;