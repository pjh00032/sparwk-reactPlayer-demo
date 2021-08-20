import React, {memo} from "react";
import cls from "classnames";
import SORTABLE_CONFIG from "../config/sortable";
import {Menu, MenuItem} from "@material-ui/core";
import PlayListSetComponent from "./PlayListSetComponent";

/*
* PlayListComponent
* : my play list Component
*
* --미완성 부분--
* 1. myPlayList 추가 부분 hide/show
* */
const PlayListComponent = ({
playLists,                  //플레이 리스트 목록
icon,                       //icon 목록
locale,                     //다국어
remove,                     //삭제 여부(현재 미사용)
onClosePanel,               //AudioListPanel 축소 이벤트
onPlayListClick,            //특정 playList 선택
onChangeAddPlayListName,    //플레이 리스트 추가시, 플레이 리스트 이름 이벤트(onChange)
onAddPlayList,              //플레이 리스트 추가 활성화 이벤트(onClick)
onAddPlayListConfirm,       //플레이 리스트 추가 버튼 이벤트(onClick)
isAddPlayList,              //플레이 리스트 추가 활성화
addPlayListName,            //추가하는 플레이 리스트 이름
                               onPlayListRename,
                               onPlayListDuplicate,
                               onPlayListDelete,
                               playListRenameInput,
}) => {
    return (
        <div>
            {/*////////////////Header///////////////////////*/}

            <div className="audio-lists-panel-header">
                <h2 className="audio-lists-panel-header-title">
                    <span>
                        {locale.playListsText} /
                    </span>
                    <span className="audio-lists-panel-header-num">
                        {playLists.length}
                    </span>
                    <span className="audio-lists-panel-header-actions">
                        <span onClick={onAddPlayList}>
                            {icon.folderPlus}
                        </span>
       {/*                 {remove && (
                            <>
                                <span className="audio-lists-panel-header-delete-btn"
                                      title={locale.removeAudioListsText}
                                      onClick={onDelete()}
                                >
                                   {icon.delete}
                                </span>
                                    <span className="audio-lists-panel-header-line" />
                            </>
                        )}*/}
                        <span className="audio-lists-panel-header-close-btn"
                              title={locale.closeText}
                              onClick={onClosePanel}
                        >
                             {icon.close}
                        </span>
                    </span>
                </h2>
            </div>


            {/*////////////////Body///////////////////////*/}
            <div
                className={cls('audio-lists-panel-content', {
                    'no-content': playLists.length < 1,
                })}
            >
                {playLists.length > 1 ?
                    (
                        <ul className={SORTABLE_CONFIG.selector} id={'playList'}>
                            {playLists.map((playlist) => {

                                let { name, PL_ID, musicCnt, isRename } = playlist;
                                    return (
                                        <li key={PL_ID}
                                            className={'audio-item'}
                                        >
                                            <span onClick={() => {
                                                if(!isRename){
                                                    onPlayListClick(playlist);
                                                }
                                            }}>
                                                <span className="group player-name" title={name} >
                                                    {isRename? (playListRenameInput(PL_ID, name)) : name}
                                                </span>
                                                <span>
                                                    {locale.playListSongs}{musicCnt}
                                                </span>

                                            </span>
                                            <PlayListSetComponent PL_ID={PL_ID}
                                                                  name={name}
                                                                  icon={icon}
                                                                  locale={locale}
                                                                  onPlayListRename={onPlayListRename}
                                                                  onPlayListDuplicate={onPlayListDuplicate}
                                                                  onPlayListDelete={onPlayListDelete}

                                            />

                                        </li>
                                    )

                            })
                            }
                            <li key={""} draggable={"false"}
                                className={cls({
                                    'audio-lists-panel-playList-add' : !isAddPlayList
                                })}
                            >
                                <span className="group player-name">
                                <input type={"text"} onChange={onChangeAddPlayListName} value={addPlayListName}/>
                                <button onClick={onAddPlayListConfirm}>add list</button>
                                </span>
                            </li>

                        </ul>
                    )
                    :
                    (
                        <ul>
                            <div>{locale.emptyListText}</div>
                        </ul>
                    )

                }
            </div>
        </div>
    )
}
export default memo(PlayListComponent);