import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { if_message } from 'src/app/interfaces/if-message';
import { if_conversation } from 'src/app/interfaces/if_conversation';
import { if_emission } from 'src/app/interfaces/if_emmission';
import { ChatService } from 'src/app/services/sf-chat.service';
import { GlobalService } from 'src/app/services/sf-global.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  convMessages: Array<if_message> = [];
  users: Array<string> = new Array();
  currentConv: if_conversation = {
    avatar: '',
    conv_id: 0,
    members: new Array(),
    name: '',
    password: '',
    type: 'public',
  };
  listConv: Array<if_conversation> = [];
  emission: if_emission = {
    login: this.global.login as string,
    socketId: this.global.socketId as string,
    data: {},
  };

  constructor(
    private socket: Socket,
    private global: GlobalService,
    private chatService: ChatService
  ) {}

  /* Normally not needed twice, can use the chat-service one */
  // clearInputValues (str: string) {
  // 	(<HTMLInputElement>document.getElementById(str)).value = "";
  // }

  onSendMessage() {
    const content = (<HTMLInputElement>document.getElementById('input-message'))
      .value;
    this.chatService.clearInputValues('input-message');
    console.log('sendMEssage');
    if (content.trim().length !== 0) {
      console.log('Prepare emission for emit');
      this.emission.data = {
        conv_id: this.currentConv.conv_id,
        date: new Date(),
        content: content,
      };
      this.emission.socketId = this.global.socketId as string;
      if (this.currentConv.name) this.socket.emit('message', this.emission);
      else alert('no conv selcted');
    } else console.log('Warning : cannot send an empty message');
  }

  keyUpEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSendMessage();
    }
  }

  onSelectOneToOneUserConv() {
    console.log('selectOneToOneUser');
    const selectedUser: string = (<HTMLInputElement>(
      document.getElementById('search-user')
    ))?.value;
    const LoginEqUsr = this.chatService.loginEqSelectedUsrANDmembersEqLogin(
      this.listConv,
      selectedUser
    );
    const LoginDifUsr = this.chatService.loginDifSelectedUsrANDuserFound(
      this.listConv,
      selectedUser
    );
    (<HTMLInputElement>document.getElementById('search-user')).value = '';
    if (LoginEqUsr) {
      console.log('conv found 0');
      this.currentConv = LoginEqUsr;
      this.emission = this.chatService.emission(
        'getMessages',
        this.currentConv,
        this.currentConv.conv_id
      );
    } else if (LoginDifUsr) {
      console.log('conv found 1');
      this.currentConv = LoginDifUsr;
      this.emission = this.chatService.emission(
        'getMessages',
        this.currentConv,
        this.currentConv.conv_id
      );
    } else {
      const data = this.chatService.createPrivateRoom(selectedUser);
      this.emission = this.chatService.emission(
        'newConversation',
        this.currentConv,
        0,
        data
      );
    }
  }

  // onActivateRoomForm() {
  //   document.getElementById('creationRoomForm')?.classList.remove('hidden');
  //   document.getElementById('joinRoomForm')?.classList.add('hidden');
  // }

  async onCreateRoom() {
    console.log('create room');
    const res = await this.chatService.takeAndCheck(this.users);
    if (res.status != 'ok') {
      // alert('error in room parameters');
      // console.log(document.getElementById('members'))
      return;
    }
    const newConv: if_conversation = {
      avatar: '',
      conv_id: 0,
      name: res.data.roomName,
      password: res.data.password,
      type: res.data.password.length === 0 ? 'public' : 'protected',
      members: res.data.members,
    };
    this.emission = this.chatService.emission(
      'newConversation',
      this.currentConv,
      0,
      newConv
    );
  }

  onSelectConv(value: any) {
    console.log('SelectRoom');
    this.currentConv = this.chatService.getConvFromId(
      value,
      this.listConv,
      this.currentConv
    );
    this.emission = this.chatService.emission(
      'getMessages',
      this.currentConv,
      value
    );
  }

  // onActivateJoinRoomForm() {
  //   document.getElementById('joinRoomForm')?.classList.remove('hidden');
  //   document.getElementById('creationRoomForm')?.classList.add('hidden');
  // }

  onJoinRoom() {
    // document.getElementById('joinRoomForm')?.classList.add('hidden');
    const roomName = (<HTMLInputElement>(
      document.getElementById('room-name-join')
    ))?.value;
    const roomPassword = (<HTMLInputElement>(
      document.getElementById('room-password-join')
    ))?.value;
    this.chatService.clearInputValues('room-name-join');
    this.chatService.clearInputValues('room-password-join');
    this.emission = this.chatService.emission('joinRoom', this.currentConv, 0, {
      roomName: roomName,
      roomPassword: roomPassword,
    });
  }

  onActivateAddfriend() {
    document.getElementById('add-user-form')?.classList.remove('hidden');
  }

  onAddFriend() {
    const name = (<HTMLInputElement>document.getElementById('search-friend'))
      .value;
    if (name) {
      document.getElementById('add-user-form')?.classList.add('hidden');
      this.emission = this.chatService.emission(
        'addFriend',
        this.currentConv,
        this.currentConv.conv_id,
        {
          name: name,
          conv_id: this.currentConv.conv_id,
          roomName: this.currentConv.name,
        }
      );
    }
  }

  onActivateMute() {}

  onActivateBan() {}
  onLeave() {
    if (this.currentConv.name != '') {
      this.emission = this.chatService.emission(
        'leaveRoom',
        this.currentConv,
        this.currentConv.conv_id
      );
      const index = this.listConv.indexOf(this.currentConv);
      console.log('index = ', index);
      this.listConv.splice(index, 1);
      this.currentConv = {
        avatar: '',
        conv_id: 0,
        members: new Array(),
        name: '',
        password: '',
        type: 'public',
      };
      this.convMessages = [];
    }
  }

  ngOnInit(): void {
    this.socket.on('users', (data: any) => {
      this.users = data;
    });
    this.socket.on('allMessages', (data: if_message[]) => {
      this.convMessages.splice(0, this.convMessages.length);
      for (const mess of data) {
        mess.date =
          mess.date.toLocaleString().slice(0, 10) +
          ' at ' +
          mess.date.toLocaleString().slice(11, 16);
        this.convMessages.push(mess);
      }
    });
    this.socket.on('allConversations', (data: any) => {
      console.log('datas = ', data);
      this.listConv = data as Array<if_conversation>;
    });
    this.socket.on('newConversation', (data: any) => {
      this.listConv.push(data);
    });
    this.socket.on('error', (data: any) => {
      alert(data);
    });
  }
}
