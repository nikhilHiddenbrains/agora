import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AC from 'agora-chat';

@Component({
  selector: 'agora-agora-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agora-chat.component.html',
  styleUrls: ['./agora-chat.component.scss'],
})
export class AgoraChatComponent implements OnInit {
  connection!: any;
  appKey!: string;

  constructor() {
    this.appKey = '611019853#1191145';
    this.connection = new AC.connection({
      appKey: this.appKey,
    });
  }

  ngOnInit(): void {
    this.connection.addEventHandler('connection&message', {
      onConnected: () => {
        this.appendLog('Connect success !');
      },
      onDisconnected: () => {
        this.appendLog('Logout success !');
      },
      onTextMessage: (message: { from: string; msg: string }) => {
        console.log(message);
        this.appendLog(
          'Message from: ' + message.from + ' Message: ' + message.msg
        );
      },
      onTokenWillExpire: () => {
        this.appendLog('Token is about to expire');
      },
      onTokenExpired: () => {
        this.appendLog('The token has expired');
      },
      onError: (error: string) => {
        console.log('on error', error);
      },
    });
  }

  login() {
    this.appendLog('Logging in...');
    const userId = (<HTMLInputElement>(
      document.getElementById('userID')
    )).value.toString();
    const token = (<HTMLInputElement>(
      document.getElementById('token')
    )).value.toString();
    this.connection.open({
      user: userId,
      agoraToken: token,
    });
  }

  logout() {
    this.connection.close();
    this.appendLog('Logout');
  }

  sendPeerMessage() {
    const peerId = (<HTMLInputElement>(
      document.getElementById('peerId')
    )).value.toString();
    const peerMessage = (<HTMLInputElement>(
      document.getElementById('peerMessage')
    )).value.toString();
    const option: any = {
      chatType: 'singleChat',
      type: 'txt',
      to: peerId,
      msg: peerMessage,
    };
    const msg = AC.message.create(option);
    this.connection
      .send(msg)
      .then((res: any) => {
        console.log('send private text success');
        this.appendLog(
          'Message send to: ' + peerId + ' Message: ' + peerMessage
        );
      })
      .catch(() => {
        console.log('send private text fail');
      });
  }

  private appendLog(message: string) {
    const logElement = document.getElementById('log');
    const divElement = document.createElement('div');
    divElement.textContent = message;
    logElement?.appendChild(divElement);
  }
}
