import React from 'react'
import { FaHeadphonesIcon } from '../components/Icon'

export default {
  playModeText: {
    order: 'Play in order',
    orderLoop: 'List loop',
    singleLoop: 'Single loop',
    shufflePlay: 'Shuffle playback',
  },
  likeModeText : {
    like : 'Like',
    dislike : 'Dislike',
  },
  openText: 'Open',
  closeText: 'Close',
  emptyText: 'There are no registered songs.',
  clickToPlayText: 'Click to play',
  clickToPauseText: 'Click to pause',
  nextTrackText: 'Next track',
  previousTrackText: 'Previous track',
  reloadText: 'Reload',
  volumeText: 'Volume',
  playListsText: 'My Play List',
  toggleLyricText: 'Toggle lyric',
  toggleMiniModeText: 'Minimize',
  destroyText: 'Destroy',
  downloadText: 'Download',
  lightThemeText: 'L',
  darkThemeText: 'D',
  switchThemeText: 'Dark/Light mode',
  removeAudioListsText: 'Delete audio lists',
  clickToDeleteText: (name) => `Click to delete ${name}`,
  controllerTitle: <FaHeadphonesIcon />,
  emptyLyricText: 'No lyric',
  emptyListText: 'There are no registered lists.',
  loadingText: 'Loading',
  playListSongs: 'songs : ',
  folderPlusText : 'Folder Plus',
  playListRename : 'Rename',
  playListDuplicate : 'Duplicate',
  playListDelete : 'Delete',
  confirm : 'confirm'
}
