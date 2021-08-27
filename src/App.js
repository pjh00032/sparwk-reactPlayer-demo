/* eslint-disable no-console */
import React from 'react';
import { hot } from 'react-hot-loader/root';
import ReactJkMusicPlayer from './ReactJKMusicPlayer'
import Locale from '../src/config/locale';
import './styles/index.less';
import './example.less';
import './App.css';
import './index.css';

const lyric = [
  '[00:00.00]by RentAnAdviser.com',
  '[00:28.10]aay',
  '[00:30.21]Fonsi',
  '[00:31.65]DY',
  '[00:33.23]Ohh OH NO OH Noo',
  '[00:37.21]EYY EYY eh',
  '[00:41.44]Si... Sabes que ya llevo un rato mirándote',
  '[00:46.78]Tengo que bailar contigo hoy',
  '[00:51.24]DY',
  '[00:52.47]Vi Que tu mirada ya estaba llamándome',
  '[00:57.47]Muestrame el camino que yo voy',
  '[01:02.15]OHH',
  '[01:03.40]Tu... Tú eres el imán y yo soy el metal',
  '[01:06.27]Me voy acercando y voy armando el plan',
  '[01:09.06]**** con pensarlo se acelera el pulso',
  '[01:12.74]Ohh yeah',
  '[01:13.78]Ya',
  '[01:15.15]Ya me estás gustando más de lo normal',
  '[01:17.11]Todos mis sentidos van pidiendo más',
  '[01:19.58]Esto hay que *****lo sin ningún apuro',
  '[01:23.17]Despacito',
  '[01:25.75]Quiero respirar tu cuello despacito',
  '[01:28.27]Deja que te diga cosas al oído',
  '[01:31.07]Para que te acuerdes si no estás conmigo',
  '[01:34.33]Despacito',
  '[01:36.48]Quiero *******rte a besos despacito',
  '[01:39.07]Firmar las paredes de tu laberinto',
  '[01:41.63]Y hacer de tu cuerpo todo un m****crito',
  '[01:44.38]Sube sube sube sube sube',
  '[01:46.55]Quiero ver bailar tu pelo Quiero ser tu ritmo',
  '[01:50.27]Que le enseñes a mi boca',
  '[01:53.15]Tus lugares favoritos',
  '[01:55.64]Favorito favorito ey eeh',
  '[01:57.34]Déjame sobrepasar',
  '[01:58.78]Tu zonas de peligro',
  '[02:01.11]Hasta ******** tus *****s',
  '[02:03.70]Y que olvides tu apellido',
  '[02:06.38]Si te pido un beso ven damelo',
  '[02:08.64]Yo se que estas pensandolo',
  '[02:10.07]LLevo tiempo intentandolo',
  '[02:11.34]Mami esto es dando y dandolo',
  '[02:12.67]Sabes que tu corazon conmigo te hace bam bam',
  '[02:15.44]Sabes que esa beba esta buscando de mi bambam',
  '[02:18.17]Ven prueba de mi boca para ver como te sabe',
  '[02:20.78]Quiero quiero quiero ver cuanto amor a ti te cabe',
  '[02:23.48]Yo no tengo prisa yo me quiero dar el viaje',
  '[02:26.27]Empezamos lento despues salvaje',
  '[02:29.01]Pasito a pasito suave suavecito',
  '[02:31.51]Nos vamos pegando poquito a poquito',
  '[02:34.25]Cuando tu me besas con esa destreza',
  '[02:37.04]Creo tu eres malicia con delicadeza',
  '[02:39.73]Pasito a pasito suave suavecito',
  '[02:42.31]Nos vamos pegando poquito a poquito',
  '[02:45.14]Y es que esa belleza es un rompe cabeza',
  '[02:47.61]Pero pa ******** aqui tengo la pieza',
  '[02:51.42]Despacito',
  '[02:53.25]Quiero recorrerte a besos despacito',
  '[02:55.67]Deja que te diga cosas al oído',
  '[02:58.48]Para que te acuerdes si no estás conmigo',
  '[03:02.00]Despecito',
  '[03:03.77]Quiero recorrerte a besos despacito',
  '[03:06.44]Dime las paredes de tu laberinto',
  '[03:09.17]Y hacer de tu cuerpo todo un m****crito',
  '[03:12.22]sube sube sube sube sube',
  '[03:14.17]Quiero ver bailar tu pelo quiero ser tu ritmo',
  '[03:17.68]Que le enseñes a mi boca tus lugares favoritos',
  '[03:23.17]favorito favorito',
  '[03:24.75]Déjame sobrepasar tu zonas de peligro',
  '[03:29.01]Hasta ******** tus *****s y que olvides tu apellido',
  '[03:34.24]Despacito',
  '[03:36.26]Vamos a hcerlo en una playa en Puerto Rico',
  '[03:38.58]Hasta que las olas griten Ay Bendito',
  '[03:41.51]Para que mi sello se quede contigo BAILALO',
  '[03:45.77]Pasito a pasito suave suavecito',
  '[03:48.34]Nos vamos pegando poquito a poquito',
  '[03:51.07]Que le enseñes a mi boca tus lugares favoritos',
  '[03:57.00]Pasito a pasito suave suavecito',
  '[03:59.17]Nos vamos pegando poquito a poquito',
  '[04:01.64]Hasta ******** tus *****s y que olvides tu apellido',
  '[04:06.50]DES...PA...CI...TO',
  '[04:12.24]Pasito a pasito',
  '[04:13.38]Suave suavecito',
  '[04:14.61]Nos vamos pegando',
  '[04:16.25]Poquito a poquito',
  '[04:23.10]Pasito a pasito',
  '[04:24.30]Suave suavecito',
  '[04:25.57]Nos vamos pegando',
  '[04:27.05]Poquito a poquito',
  '[04:34.68]by RentAnAdviser.com',
].join('\n');

//1. 음악목록
const audioList1 = [
  /*
  * PL_ID : play list ID
  * AD_ID : 노래 ID
  * name : 노래이름
  * singer : 가수이름
  * cover: 표출될 앨범 사진
  * musicSrc : 음악 경로
  * likeMode : 좋아요 표시(true : like / falas : dislike)
  * order : 음악 리스트에 표출될 음악 순서
  * orderInFolder : 음악 리스트에서 폴더 안에서 표출될 순서
  * */

  // {
  //   PL_ID : 'PL_1',
  //   AD_ID : 'AD_2',
  //   name: 'Dorost Nemisham1',
  //   singer: 'Sirvan Khosravi',
  //   cover: 'https://res.cloudinary.com/ehsanahmadi/image/upload/v1573758778/Sirvan-Khosravi-Dorost-Nemisham_glicks.jpg',
  //   musicSrc: 'https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3',
  //   likeMode : false,
  //   order : 2,
  //   lyric : '',
  // },
  {
    PL_ID : 'PL_1',
    AD_ID : 'AD_1',
    name: 'Despacito',
    singer: 'Luis Fonsi',
    cover: 'https://ifh.cc/g/QVGATp.png',
    musicSrc: 'https://res.cloudinary.com/alick/video/upload/v1502689683/Luis_Fonsi_-_Despacito_ft._Daddy_Yankee_uyvqw9.mp3',
    likeMode : true,
    order : 1,
    lyric : lyric,
  },

]

const playLists1 = [
  /*
  * PL_ID : play list ID
  * name : play list name
  * order : play list order
  * musicCnt : music count in play list
  * */

  {
    PL_ID : 'PL_1',
    name: 'play list 1',
    order : 1,
    musicCnt : 1,
  },
  {
    PL_ID : 'PL_2',
    name: 'play list 2',
    order : 2,
    musicCnt : 0,
  },

]

//2. ReactJkMusicPlayer 기본 옵션
const options = {

  myPlayLists : playLists1,
  // international [type `en_US | zh_CN | Object` default `en_US`]
  locale: Locale.en_US,

  // default play index of the audio player  [type `number` default `0`]
  defaultPlayIndex: 0,

  // if you want dynamic change current play audio you can change it [type `number` default `0`]
  // playIndex: 0,

  // color of the music player theme    [ type: 'light' | 'dark' | 'auto'  default `dark` ]
  theme: 'light',

  // audio controller is can be drag of the "mini" mode     [type `Boolean` default `true`]
  drag: true,

  // Specifies movement boundaries. Accepted values:
  // - `parent` restricts movement within the node's offsetParent
  //    (nearest node with position relative or absolute), or
  // - a selector, restricts movement within the targeted node
  // - An object with `left, top, right, and bottom` properties.
  //   These indicate how far in each direction the draggable
  //   can be moved.
  // Ref: https://github.com/STRML/react-draggable#draggable-api
  bounds: 'body',

  // drag the audio progress bar [type `Boolean` default `true`]
  seeked: true,

  // audio cover is show of the "mini" mode [type `Boolean` default 'true']
  showMiniModeCover: true,

  // audio playing progress is show of the "mini"  mode
  showMiniProcessBar: false,

  // Display chrome media session.  [type `Boolean` default `false`]
  showMediaSession: false,

  // Displays the audio load progress bar.  [type `Boolean` default `true`]
  showProgressLoadBar: true,

  // play button display of the audio player panel   [type `Boolean` default `true`]
  showPlay: true,

  // reload button display of the audio player panel   [type `Boolean` default `true`]
  showReload: true,

  // download button display of the audio player panel   [type `Boolean` default `true`]
  showDownload: false,

  // loop button display of the audio player panel   [type `Boolean` default `true`]
  showPlayMode: true,

  // theme toggle switch  display of the audio player panel   [type `Boolean` default `true`]
  showThemeSwitch: false,

  // lyric display of the audio player panel   [type `Boolean` default `false`]
  showLyric: true,

  // destroy player button display  [type `Boolean` default `false`]
  showDestroy: true,

  /**
   * Don't interrupt current playing state when audio list updated
   * audioLists eg. (A) is current playing...
   * [A,B] => [A,C,B]
   * [A,B] => [A,B,C]
   *
   * if (A) not in updated audio lists
   * [A,B] => [C]
   * (C) is playing
   */
  // [type `boolean`, default `false`]
  quietUpdate: false,

  // Replace a new playlist with the first loaded playlist
  // instead of adding it at the end of it.
  // [type `boolean`, default `false`]
  clearPriorAudioLists: false,

  // Play your new play list right after your new play list is loaded turn false.
  // [type `boolean`, default `false`]
  autoPlayInitLoadPlayList: false,

  // Whether to load audio immediately after the page loads.  [type `Boolean | String`, default `false`]
  // "auto|metadata|none" "true| false"
  preload: false,

  // Whether the player's background displays frosted glass effect  [type `Boolean`, default `false`]
  glassBg: false,

  // The next time you access the player, do you keep the last state  [type `Boolean` default `false`]
  remember: false,

  // The Audio Can be deleted  [type `Boolean`, default `true`]
  remove: true,

  // audio controller initial position    [ type `Object` default '{top:0,left:0}' ]
  defaultPosition: {
    right: 100,
    bottom: 120,
  },

  // if you want dynamic change current play mode you can change it
  // [type`order | orderLoop | singleLoop | shufflePlay`, default `order`]
  // playMode: 'order',
  defaultPlayMode: 'shufflePlay',

  // audio mode        mini | full          [type `String`  default `mini`]
  mode: 'full',

  /**
   * [ type `Boolean` default 'false' ]
   * The default audioPlay handle function will be played again after each pause, If you only want to trigger it once, you can set 'true'
   */
  once: false,

  // Whether the audio is played after loading is completed. [type `Boolean` default 'true']
  autoPlay: false,

  // Whether you can switch between two modes, full => mini  or mini => full   [type 'Boolean' default 'true']
  toggleMode: false,

  // Extensible custom content       [type 'Array' default '-' ]
  extendsContent: null,

  // default volume of the audio player [type `Number` default `1` range `0-1`]
  defaultVolume: 0.8,

  // playModeText show time [type `Number(ms)` default `600`]
  playModeShowTime: 600,

  // Whether to try playing the next audio when the current audio playback fails [type `Boolean` default `true`]
  loadAudioErrorPlayNext: true,

  // Auto hide the cover photo if no cover photo is available [type `Boolean` default `false`]
  autoHiddenCover: false,

  // Play and pause audio through blank space [type `Boolean` default `false`]
  spaceBar: false,

  // Enable responsive player, auto toggle desktop and mobile [type `Boolean` default `true`]
  responsive: false,

  /**
   * Custom mobile media query string, eg use the mobile version UI on iPad.
   * https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
   * [type `String` default '(max-width: 768px) and (orientation : portrait)']
   */
  mobileMediaQuery: '(max-width: 1024px)',

  // Audio volume with fade in and fade out [type `{ fadeIn: number, fadeOut: number }` default `{ fadeIn: 0, fadeOut: 0 }`]
  volumeFade: {
    fadeIn: 0,
    fadeOut: 0,
  },
  /**
   * Restarts the current track when trying to play previous song, if the current time of the song is more than 1 second
   Otherwise, plays the previous song in the list
   [type `Boolean` default `false`]
   */
  restartCurrentOnPrev: false,

  // https://github.com/SortableJS/Sortable#options
  sortableOptions: {},

  // Music is downloaded handle
  onAudioDownload(audioInfo) {
    /*console.log('audio download', audioInfo)*/
  },

  // audio play handle
  onAudioPlay(audioInfo) {
    /*console.log('audio playing', audioInfo)*/
  },

  // audio pause handle
  onAudioPause(audioInfo) {
    /*console.log('audio pause', audioInfo)*/
  },

  // When the user has moved/jumped to a new location in audio
  onAudioSeeked(audioInfo) {
    /*console.log('audio seeked', audioInfo)*/
  },

  // When the volume has changed  min = 0.0  max = 1.0
  onAudioVolumeChange(currentVolume) {
    /*console.log('audio volume change', currentVolume)*/
  },

  // The single song is ended handle
  onAudioEnded(currentPlayId, audioLists, audioInfo) {
    /*console.log('audio ended', currentPlayId, audioLists, audioInfo)*/
  },

  // audio load abort
  onAudioAbort(currentPlayId, audioLists, audioInfo) {
    /*console.log('audio abort', currentPlayId, audioLists, audioInfo)*/
  },

  // audio play progress handle
  // eslint-disable-next-line no-unused-vars
  onAudioProgress(audioInfo) {
    // console.log('audio progress', audioInfo)
  },

  // audio reload handle
  onAudioReload(audioInfo) {
    /*console.log('audio reload:', audioInfo)*/
  },

  // audio load failed error handle
  onAudioError(errMsg, currentPlayId, audioLists, audioInfo) {
    /*console.error('audio error', errMsg, currentPlayId, audioLists, audioInfo)*/
  },

  // theme change handle
  // onThemeChange(theme) {
  //   console.log('theme change:', theme)
  // },

  onAudioListsChange(currentPlayId, audioLists, audioInfo) {
    /*console.log('audio lists change:', currentPlayId, audioLists, audioInfo)*/
  },

  onAudioPlayTrackChange(currentPlayId, audioLists, audioInfo) {
    /*    console.log(
          'audio play track change:',
          currentPlayId,
          audioLists,
          audioInfo,
        )*/
  },

  // onPlayModeChange(playMode) {
  //   console.log('play mode change:', playMode)
  // },

  // onModeChange(mode) {
  //   console.log('mode change:', mode)
  // },

  onAudioListsPanelChange(panelVisible) {
    /*console.log('audio lists panel visible:', panelVisible)*/
  },

  onAudioListsSortEnd(oldIndex, newIndex) {
    /*console.log('audio lists sort end:', oldIndex, newIndex)*/
  },

  onAudioLyricChange(lineNum, currentLyric) {
    /*console.log('audio lyric change:', lineNum, currentLyric)*/
  },

  // custom music player root node
  getContainer() {
    return document.body
  },

  /**
   * @description get origin audio element instance , you can use it do everything
   * @example
   * audio.playbackRate = 1.5  // set play back rate
   * audio.crossOrigin = 'xxx' // config cross origin
   */
  getAudioInstance(audio) {
    console.log('audio instance', audio)
  },

  onBeforeDestroy(currentPlayId, audioLists, audioInfo) {
    console.log('onBeforeDestroy currentPlayId: ', currentPlayId)
    console.log('onBeforeDestroy audioLists: ', audioLists)
    console.log('onBeforeDestroy audioInfo: ', audioInfo)
    return new Promise((resolve, reject) => {
      // your custom validate
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you confirm destroy the player?')) {
        // if resolve, player destroyed
        resolve()
      } else {
        // if reject, skip.
        reject()
      }
    })
  },

  onDestroyed(currentPlayId, audioLists, audioInfo) {
    console.log('onDestroyed:', currentPlayId, audioLists, audioInfo)
  },

  onCoverClick(mode, audioLists, audioInfo) {
    console.log('onCoverClick: ', mode, audioLists, audioInfo)
  },

  // custom audio title
  // renderAudioTitle(audioInfo) {
  //   return <a href="#">{audioInfo.name}</a>
  // },

  // onPlayIndexChange (playIndex) {
  //   console.log('onPlayIndexChange: ', playIndex);
  // }

  // transform audio info like return a Promise

  /**
   * @return
   *  {
   *    src: 'xxx',
   *    filename: 'xxx',
   *    mimeType: 'xxx'
   *  }
   */
  // onBeforeAudioDownload() {
  //   return Promise.resolve({
  //     src: '1.mp3',
  //   })
  // },

  /**
   * customer download handler
   * eg. a link , or https://www.npmjs.com/package/file-saver
   * @param {*} downloadInfo
   * @example
   *
   customDownloader(downloadInfo) {
        const link = document.createElement('a')
        link.href = downloadInfo.src
        link.download = downloadInfo.filename || 'test'
        document.body.appendChild(link)
        link.click()
      },
   */
  // customDownloader(downloadInfo) {
  //   console.log(downloadInfo.src)
  //   console.log(downloadInfo.filename)
  //   console.log(downloadInfo.mimeType)
  // },
}

/*audioList 정렬*/
const onAudioListSort = (audioList) =>{
  audioList.sort(function (a,b){
    return a.order - b.order
  })

  return audioList
}

/**/
class Demo extends React.PureComponent {
  constructor(props) {
    super(props)
    this.audio = {}

  }

  state = {
    unmount: false,
    params: {
      audioLists : onAudioListSort(audioList1),

      ...options,
      getAudioInstance: (audio) => {
        this.audio = audio
      },
    },
  }

  /*param update*/
  updateParams = (params) => {
    const data = {
      ...this.state.params,
      ...params,
    }
    this.setState({
      params: data,
    })
  }

  extendsContent = () => {
    this.updateParams({
      extendsContent: (
          <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line no-alert
                alert("I'm extends content")
              }}
          >
            button
          </button>
      ),
    })
  }


  /*실제 표출 시작*/
  render() {
    const { params, unmount } = this.state

    return (
        <div>
          {unmount ? null : (
              <ReactJkMusicPlayer
                  {...params}
              />
          )}
        </div>
    )
  }
}

export default hot(Demo)
