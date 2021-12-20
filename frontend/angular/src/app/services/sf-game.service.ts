import { Injectable } from '@angular/core';
import { if_game, if_game_object, if_game_type } from '../interfaces/if-game';
import axios from 'axios';
import { GlobalService } from './sf-global.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  game?: if_game;

  constructor(private globalService: GlobalService) {}

  // PLAY PARTS
  async getTypesOfParty() {
    const response = await axios.get(`http://127.0.0.1:3000/cb-game/types`)
    const types = response.data;
    return types;
  }
  
  // LIVE PARTS
  async getParties(): Promise<if_game_object[]> {
    const response = await axios.get(`http://127.0.0.1:3000/cb-game/parties`)
    const parties = response.data;
    return parties;
  }

  // async setParty(type: string) {
  //   const response = await axios.post(`http://127.0.0.1:3000/cb-game/party/${type}`)
  //   const party = response;
  //   return party;
  // }

  async setParty(type: string) {
    // const login = this.globalService.login;
    // let login = this.globalService.login;
    let login = "";
    if (type === "Classic") {
      login = "jobenass";
      type = "Classic";
    }
    else if (type === "School") {
      login = "Moldu_01";
      type = "Classic";
    }
    else if (type === "Custom") {
      login = "Moldu_02";
      // type = "Classic";
    }
    const data = {
      login: login,
      map_type: type
    }
    return axios.post('http://127.0.0.1:3000/cb-game/party', data)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

}
