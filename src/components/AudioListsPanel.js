import cls from 'classnames'
import React, { memo } from 'react'

import SORTABLE_CONFIG from '../config/sortable'
import AudioComponent from "./AudioComponent"
import PlayListComponent from "./PlayListComponent";
import PLAY_LIST_MODE from "../config/playListModes";

var newAudioList=[];
const AudioListsPanel = ({
/*AudioListPanel*******************************************************************/
panelToggleAnimate,         //css class
glassBg,                    //css class
isMobile,                   //css class
listMode,                   //ListPanel 모드('list' : playlist, 'music' : audioList)

/*공통******************************************************************************/
locale,                     //다국어
icon,                       //icon 목록
remove,                     //삭제여부
onClosePanel,               //AudioListPanel 축소 이벤트

/*PlayListComponent****************************************************************/
playLists,                  //플레이 리스트 목록
onPlayListClick,            //특정 플레이 리스트 선택
onChangeAddPlayListName,    //플레이 리스트 추가시, 플레이 리스트 이름 이벤트(onChange)
onAddPlayList,              //플레이 리스트 추가 활성화 이벤트(onClick)
onAddPlayListConfirm,       //플레이 리스트 추가 버튼 이벤트(onClick)
isAddPlayList,              //플레이 리스트 추가 활성화
addPlayListName,            //추가하는 플레이 리스트 이름
                             onPlayListRename,
                             onPlayListDuplicate,
                             onPlayListDelete,
                             playListRenameInput,

/*AudioComponent*******************************************************************/
audioLists,                 //음악리스트
playing,                    //재생 여부
playId,                     //재생중인 음악 id
onPlay,                     //음악 재생 이벤트
removeId,                   //삭제하는 음악 id
onDelete,                   //음악 삭제 버튼 이벤트(onClick)
loading,                    //로딩 여부
playListName,               //플레이 리스트 명
onBackClick,                //뒤로가기 이벤트(onClick)(플레이 리스트 목록으로 이동)
onLikeModeChange            //like 모드 이벤트(onClick)
}) => {
  return (
      <div
          className={cls('audio-lists-panel', panelToggleAnimate, {
            'audio-lists-panel-mobile': isMobile,
            'glass-bg': glassBg,
          })}
      >
        {/*////////////////Header///////////////////////*/}
        {listMode === PLAY_LIST_MODE.list ?
            (
                <PlayListComponent
                    playLists = {playLists}
                    icon = {icon}
                    locale = {locale}
                    remove = {remove}
                    onClosePanel = {onClosePanel}
                    onAddPlayList = {onAddPlayList}
                    onPlayListClick={onPlayListClick}
                    onChangeAddPlayListName = {onChangeAddPlayListName}
                    onAddPlayListConfirm={onAddPlayListConfirm}
                    isAddPlayList = {isAddPlayList}
                    addPlayListName = {addPlayListName}
                    onPlayListRename={onPlayListRename}
                    onPlayListDuplicate={onPlayListDuplicate}
                    onPlayListDelete={onPlayListDelete}
                    playListRenameInput={playListRenameInput}
                />
            )
            :
            (
                <AudioComponent
                    audioLists = {audioLists}
                    locale = {locale}
                    icon = {icon}
                    playing = {playing}
                    playId = {playId}
                    onPlay = {onPlay}
                    removeId = {removeId}
                    remove = {remove}
                    onDelete = {onDelete}
                    loading = {loading}
                    playListName = {playListName}
                    onClosePanel = {onClosePanel}
                    onBackClick = {onBackClick}
                    onLikeModeChange = {onLikeModeChange}
                />
            )
        }




      </div>

  )
}

export default memo(AudioListsPanel)
