import cls from 'classnames';
import React, { memo } from 'react';
import SORTABLE_CONFIG from "../config/sortable";
import { PLAYER_KEY } from '../config/player';


/*
* AudioComponent
* : music list in my play list
*
* --미완성 부분--
* 1. like mode / remove
* */
const AudioComponent = ({
audioLists,         //플레이 리스트 안에 있는 음악 리스트
locale,             //다국어
icon,               //icon 목록
playing,            //재생 여부
playId,             //재생중인 음악 id
onPlay,             //AudioListPanel 에서 음악 목록에 있는 음악 클릭시, 음악 재생 이벤트
removeId,           //삭제하는 음악 id
remove,             //음악 삭제 여부
onDelete,           //음악 삭제 버튼 이벤트(onClick)
loading,            //로딩 여부
playListName,       //플레이 리스트명
onClosePanel,           //AudioListPanel 축소 이벤트
onBackClick,        //뒤로가기 이벤트(onClick)(플레이 리스트 목록으로 이동)
onLikeModeChange    //like 모드 이벤트(onClick)
 }) => (

    <div>
        {/*////////////////Header///////////////////////*/}
        <div className="audio-lists-panel-header">
            <h2 className="audio-lists-panel-header-title">
                {/*뒤로가기*/}
                <span onClick={onBackClick}>
                    {icon.backIcon}
                </span>
                {/*플레이 리스트 명*/}
                <span>
                    {playListName} /
                </span>
                {/*플레이 리스트 안 음악 개수*/}
                <span className="audio-lists-panel-header-num">
                    {audioLists.length}
                </span>
                {/*축소*/}
                <span className="audio-lists-panel-header-actions">
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
                'no-content': audioLists.length < 1,
            })}
        >
            {audioLists.length > 0 ?
                (
                    <ul className={SORTABLE_CONFIG.selector} id={'audioLists'}>
                        {audioLists.map((audio) => {
                            let { name, singer, likeMode } = audio;
                            const audioId = audio[PLAYER_KEY];
                            const isCurrentPlaying = playId === audioId;

                            return (
                                <li  title={!playing? locale.clickToPlayText: isCurrentPlaying? locale.clickToPauseText: locale.clickToPlayText}
                                    className={cls('audio-item', { playing: isCurrentPlaying }, { pause: !playing }, { remove: removeId === audioId },)}
                                    >
                                    <span onClick={() => onPlay(audioId)}>
                                        <span className="group player-status">
                                            <span className="player-icons">
                                                {isCurrentPlaying && loading? icon.loading : isCurrentPlaying ? playing ? icon.pause : icon.play : undefined}
                                            </span>
                                        </span>
                                        <span className="group player-name" title={name}>
                                            {name}
                                        </span>
                                        <span className="group player-singer" title={singer}>
                                            {singer}
                                        </span>
                                    </span>
                                        <span onClick={onLikeModeChange}>
                                            {likeMode? icon.like : icon.dislike}
                                        </span>
                                        {remove && (
                                            <span
                                                className="group player-delete"
                                                title={locale.clickToDeleteText(name)}
                                                onClick={onDelete(audioId)}
                                            >
                                                {icon.close}
                                            </span>
                                        )}
                                </li>
                            )

                        })
                        }
                    </ul>
                )
                :
                (
                    <ul>
                        <div>{locale.emptyText}</div>
                    </ul>
                )

            }
        </div>
    </div>


)

export default memo(AudioComponent)
