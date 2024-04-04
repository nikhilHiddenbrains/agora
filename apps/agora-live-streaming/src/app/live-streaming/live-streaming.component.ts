import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import AgoraRTC from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-agora-live-streaming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss'],
})
export class LiveStreamingComponent {
  options: options = {
    appId: '5b69271b44c8472896a20ba5bbeebb13',
    channel: '303_1702705736381',
    token:
      '007eJxTYJgSt8+5Tex5yFwNh9pM3Yc6FzQj6/1mc/j55rIsWnnysbkCg2mSmaWRuWGSiUmyhYm5kYWlWaKRQVKiaVJSampSkqGxp1VtakMgI8Omud0MjFAI4gsyGBsYxxuaGxiZG5iaG5sZWxgyMAAAN1MfdQ==',
    uid: 0,
    role: '',
  };

  channelParameters: ChannelParameters = {
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    remoteUid: null,
  };

  constructor() {
    this.startBasicCall();
  }

  startBasicCall(): void {
    const agoraEngine = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
    console.log('------------------start call---------------------');
    
    
    const remotePlayerContainer = document.createElement('div');
    const localPlayerContainer = document.createElement('div');

    localPlayerContainer.id = this.options.uid.toString();
    localPlayerContainer.textContent = 'Local user ' + this.options.uid;
    console.log('----------------Local User----------',this.options.uid);
    localPlayerContainer.style.width = '640px';
    localPlayerContainer.style.height = '480px';
    localPlayerContainer.style.padding = '15px 5px 5px 5px';

    remotePlayerContainer.style.width = '640px';
    remotePlayerContainer.style.height = '480px';
    remotePlayerContainer.style.padding = '15px 5px 5px 5px';
    
    agoraEngine.on('user-published', async (user: any, mediaType: any) => {
      console.log('----------------Local User----------',user);
      await agoraEngine.subscribe(user, mediaType);

      if (mediaType === 'video') {
        
        this.channelParameters.remoteVideoTrack = user.videoTrack;
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        this.channelParameters.remoteUid = user.uid.toString();
        console.log('----------------channelParameters----------',this.channelParameters);
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent =
          'Remote user ' + user.uid.toString();
        document.body.append(remotePlayerContainer);

        if (this.options.role !== 'host') {
          this.channelParameters.remoteVideoTrack.play(remotePlayerContainer);
        }
      }

      if (mediaType === 'audio') {
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        this.channelParameters.remoteAudioTrack.play();
      }
    });

    window.onload = async () => {
      const joinButton = document.getElementById('join');
      if (joinButton) {
        
        joinButton.onclick = async () => {
          if (this.options.role === '') {
            window.alert('Select a user role first!');
            return;
          }

          await agoraEngine.join(
            this.options.appId,
            this.options.channel,
            this.options.token,
            this.options.uid
          );
          
          if (this.options.role === 'host') {
            this.channelParameters.localAudioTrack =
              await AgoraRTC.createMicrophoneAudioTrack();
            this.channelParameters.localVideoTrack =
              await AgoraRTC.createCameraVideoTrack();
  
            document.body.append(localPlayerContainer);
            
            await agoraEngine.publish([
              this.channelParameters.localAudioTrack,
              this.channelParameters.localVideoTrack,
            ]);

            this.channelParameters.localVideoTrack.play(localPlayerContainer);
          }
        };
      }

      const leaveButton = document.getElementById('leave');
      if (leaveButton) {
        leaveButton.onclick = async () => {
          this.channelParameters.localAudioTrack.close();
          this.channelParameters.localVideoTrack.close();
          this.removeVideoDiv(remotePlayerContainer.id);
          this.removeVideoDiv(localPlayerContainer.id);
          await agoraEngine.leave();
        };
      }

      const hostElement = document.getElementById('host');
      if (hostElement) {
        hostElement.addEventListener('click', async () => {
          const hostCheckbox = document.getElementById(
            'host'
          ) as HTMLInputElement;

          if (hostCheckbox.checked) {
            this.options.role = 'host';
            (await agoraEngine.setClientRole) ? this.options.role : '';

            if (this.channelParameters.localVideoTrack !== null) {
              await agoraEngine.publish([
                this.channelParameters.localAudioTrack,
                this.channelParameters.localVideoTrack,
              ]);

              this.channelParameters.remoteVideoTrack.stop();
              this.channelParameters.localVideoTrack.play(localPlayerContainer);
            }
          }
        });
      }

      const audienceButton = document.getElementById('Audience');
      if (audienceButton) {
        audienceButton.onclick = async () => {
          const audienceCheckbox = document.getElementById(
            'Audience'
          ) as HTMLInputElement;

          if (audienceCheckbox.checked) {
            this.options.role = 'audience';
            
            if (
              this.channelParameters.localAudioTrack !== null &&
              this.channelParameters.localVideoTrack !== null
            ) {
              if (this.channelParameters.remoteVideoTrack !== null) {
                await this.channelParameters.localVideoTrack.replaceTrack(
                  this.channelParameters.remoteVideoTrack,
                  true
                );
              }
            }

            (await agoraEngine.setClientRole) ? this.options.role : '';
          }
        };
      }
    };

    agoraEngine.on('user-unpublished', (user: any) => {
      console.log(user.uid + ' -----------------has left the channel------------------------');
    });
  }

  removeVideoDiv(elementId: string): void {
      const div = document.getElementById(elementId);
    if (div) {
      div.remove();
    }
  }
}

export interface ChannelParameters {
  localAudioTrack: any;
  localVideoTrack: any;
  remoteAudioTrack: any;
  remoteVideoTrack: any;
  remoteUid: string | null;
}

export interface options {
  appId: string;
  channel: string;
  token: string;
  uid: number;
  role: string;
}
