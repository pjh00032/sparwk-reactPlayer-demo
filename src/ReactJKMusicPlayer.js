/**
 * @name react-jinke-music-player
 * @description Maybe the best beautiful HTML5 responsive player component for react :)
 * @author Jinke.Li <1359518268@qq.com>
 * @license MIT
 */

import cls from 'classnames';
import download from 'downloadjs';
import getIsMobile from 'is-mobile';
import Slider from 'rc-slider/lib/Slider';
import Switch from 'rc-switch';
import React, {cloneElement, Component, createRef, PureComponent, useRef} from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import Sortable, { Swap } from 'sortablejs';
import AudioListsPanel from './components/AudioListsPanel';
import CircleProcessBar from './components/CircleProcessBar';

import {
    AnimatePauseIcon,
    AnimatePlayIcon,
    ArrowDownIcon,
    CloseIcon,
    DeleteIcon,
    DownloadIcon,
    EmptyIcon,
    FaMinusSquareOIcon,
    LoadIcon,
    LoopIcon,
    LyricIcon,
    NextAudioIcon,
    OrderPlayIcon,
    PlayListsIcon,
    PrevAudioIcon,
    ReloadIcon,
    RepeatIcon,
    ShufflePlayIcon,
    VolumeMuteIcon,
    VolumeUnmuteIcon,
    LikeIcon,
    FolderPlusIcon,
    DisLikeIcon,
    FolderSetIcon,
    BackIcon, ConfirmIcon,
} from './components/Icon';
import PlayModel from './components/PlayModel';
import { AUDIO_LIST_REMOVE_ANIMATE_TIME } from './config/animate';
import { SPACE_BAR_KEYCODE } from './config/keycode';
import LOCALE from './config/locale';
import { MEDIA_QUERY } from './config/mediaQuery';
import { MODE } from './config/mode';
import { AUDIO_NETWORK_STATE, AUDIO_READY_STATE } from './config/audioState';
import PLAY_MODE from './config/playMode';
import PROP_TYPES from './config/propTypes';
import PLAY_LIST_MODE from './config/playListModes'
import { PROGRESS_BAR_SLIDER_OPTIONS, VOLUME_BAR_SLIDER_OPTIONS} from './config/slider';
import { THEME } from './config/theme';
import { VOLUME_FADE } from './config/volumeFade';
import { DEFAULT_PLAY_INDEX,
    DEFAULT_VOLUME,
    DEFAULT_REMOVE_ID,
    PLAYER_KEY } from './config/player';
import SORTABLE_CONFIG from './config/sortable';
import LOCALE_CONFIG from './locale';
import Lyric from './lyric';
import { adjustVolume,
    arrayEqual,
    createRandomNum,
    formatTime,
    isSafari,
    uuId } from './utils';
import Waveform from "./components/Waveform";
import {TextField} from "@material-ui/core";
import DefaultLyrics from "./components/DefaultLyrics";

Sortable.mount(new Swap())

const IS_MOBILE = getIsMobile()

const DEFAULT_ICON = {
    pause: <AnimatePauseIcon />,
    play: <AnimatePlayIcon />,
    destroy: <CloseIcon />,
    close: <CloseIcon />,
    delete: <DeleteIcon size={24} />,
    download: <DownloadIcon size={26} />,
    toggle: <FaMinusSquareOIcon />,
    lyric: <LyricIcon />,
    volume: <VolumeUnmuteIcon size={26} />,
    mute: <VolumeMuteIcon size={26} />,
    next: <NextAudioIcon />,
    prev: <PrevAudioIcon />,
    playLists: <PlayListsIcon />,
    reload: <ReloadIcon size={22} />,
    loop: <LoopIcon size={26} />,
    order: <OrderPlayIcon size={26} />,
    orderLoop: <RepeatIcon size={26} />,
    shuffle: <ShufflePlayIcon size={26} />,
    loading: <LoadIcon />,
    packUpPanelMobile: <ArrowDownIcon size={26} />,
    empty: <EmptyIcon />,
    like : <LikeIcon/>,
    dislike : <DisLikeIcon/>,
    folderPlus : <FolderPlusIcon/>,
    folderSet : <FolderSetIcon/>,
    backIcon : <BackIcon/>,
    confirmIcon : <ConfirmIcon/>
}

export default class ReactJkMusicPlayer extends PureComponent {
    constructor(props) {
        super(props);
        this.audio = null;
        this.targetId = 'music-player-controller';

        this._PLAY_MODE_ = Object.values(PLAY_MODE);
        this._PLAY_MODE_LENGTH_ = this._PLAY_MODE_.length;

        this.player = createRef();
        this.destroyBtn = createRef();
        this.wavesurfer = createRef();

        this.state = {
            audioLists: [],          //???????????????
            myPlayLists: [],         //?????????????????? ?????????
            playId: this.initPlayId, //?????? ????????? ?????? id
            name: '',                //?????? ????????? ?????? ??????
            singer: '',              //?????? ????????? ?????? ?????? ??????
            cover: '',               //?????? ????????? ?????? ?????? ????????? ??????
            musicSrc: '',            //?????? ????????? ?????? ??????
            likeMode: false,         //?????? ????????? ?????? ????????? ??????
            lyric: '',               //?????? ????????? ?????? ??????
            currentLyric: '',        //?????? ????????? ?????? ?????? ?????? ??????
            isMobile: IS_MOBILE,     //????????? ??????
            toggle: this.props.mode === MODE.FULL,
            playing: false,          //?????? ??????
            currentTime: 0,          //?????? ?????? ??????
            soundValue: DEFAULT_VOLUME * 100, //??????
            moveX: 0,                //?????? ??? x???
            moveY: 0,                //?????? ??? y???
            loading: false,          //?????? ??????
            audioListsPanelVisible: false,
            playModelNameVisible: false,
            theme: this.props.theme,  //??????
            playMode: this.props.playMode || this.props.defaultPlayMode || '', //?????? ??????
            currentAudioVolume: 0, //?????? ??????
            initAnimate: false,
            isInitAutoPlay: this.props.autoPlay,
            isInitRemember: false,
            loadedProgress: 0,
            removeId: DEFAULT_REMOVE_ID,
            isNeedMobileHack: IS_MOBILE,
            audioLyricVisible: true,
            isAutoPlayWhenUserClicked: false,
            playIndex:
                this.props.playIndex || this.props.defaultPlayIndex || DEFAULT_PLAY_INDEX,
            canPlay: false,
            currentVolumeFade: VOLUME_FADE.NONE,
            currentVolumeFadeInterval: undefined,
            updateIntervalEndVolume: undefined,
            isAudioSeeking: false,
            isResetCoverRotate: false,
            defaultLyric : '',
            playListMode : '',
            addPlayListName : '',
            renamePlayListName : '',
            isAddPlayList : false,
        }

    }

    isDrag = false;

    initPlayId = '';

    static defaultProps = {
        audioLists: [],
        myPlayLists: [],
        theme: THEME.DARK,
        mode: MODE.MINI,
        defaultPlayMode: PLAY_MODE.order,
        defaultPosition: {
            left: 0,
            top: 0,
        },
        once: false, // onAudioPlay ??????  ?????????????????????
        drag: true,
        toggleMode: true, // ??????????????? ?????????????????? ????????????
        showMiniModeCover: true, // ??????????????? ?????????????????????
        showDownload: true,
        showPlay: true,
        showReload: true,
        showLikeMode : true,
        showPlayMode: true,
        showThemeSwitch: true,
        showLyric: false,
        playModeTipVisible: false, // ???????????????????????????
        autoPlay: true,
        defaultVolume: 1,
        showProgressLoadBar: true, // ?????????????????????
        seeked: true,
        playModeShowTime: 600, // ?????????????????? ????????????,
        bounds: 'body', // mini ??????????????????????????????
        showMiniProcessBar: false, // ????????????????????? ???????????????
        loadAudioErrorPlayNext: true, // ????????????????????? ???????????????????????????
        preload: false, // ??????????????????????????????????????????
        glassBg: false, // ????????????????????????
        remember: false, // ??????????????????????????????
        remove: true, // ????????????????????????
        defaultPlayIndex: 0, // ??????????????????
        getContainer: () => document.body, // ????????????????????????
        autoHiddenCover: false, // ???????????????????????????????????????????????????
        onBeforeAudioDownload: () => {}, // ??????????????????????????????
        spaceBar: false, // ??????????????????????????? ??????????????????
        showDestroy: false,
        showMediaSession: false,
        locale: LOCALE.en_US,
        responsive: true,
        icon: DEFAULT_ICON,
        quietUpdate: false, // ???????????????????????????????????????????????????????????????????????????????????????
        mobileMediaQuery: MEDIA_QUERY.MOBILE,
        // ?????????????????? ????????????
        volumeFade: {
            fadeIn: 0,
            fadeOut: 0,
        },
        restartCurrentOnPrev: false,
        // https://github.com/SortableJS/Sortable#options
        sortableOptions: {},
        playListMode : PLAY_LIST_MODE.list,
        playListName : '',
        isAddPlayList : false,
        defaultLyric : '',
    }

    static propTypes = PROP_TYPES;

    get locale() {
        const { locale } = this.props
        if (typeof locale === 'string') {
            return LOCALE_CONFIG[this.props.locale]
        }
        return locale ? { ...LOCALE_CONFIG[LOCALE.en_US], ...locale } : {}
    }

    get audioDuration() {
        const { audioLists, playId } = this.state
        if (!audioLists.length || !this.audio) {
            return 0
        }
        const { duration } =
        audioLists.find((audio) => audio[PLAYER_KEY] === playId) || {}

        return Math.max(Number(duration) || this.audio.duration || 0, 0)
    }

    get isAudioCanPlay() {
        const { autoPlay } = this.props
        const { isInitAutoPlay, isAutoPlayWhenUserClicked, canPlay } = this.state
        return canPlay && (isInitAutoPlay || autoPlay || isAutoPlayWhenUserClicked)
    }

    get iconMap() {
        const Spin = () => (
            <span className="loading group">{this.props.icon.loading}</span>
        )
        return { ...DEFAULT_ICON, ...this.props.icon, loading: <Spin /> }
    }

    render() {
        const {
            className,
            drag,
            style,
            showDownload,
            showPlay,
            showReload,
            showPlayMode,
            showLikeMode,
            showThemeSwitch,
            toggleMode,
            showMiniModeCover,
            extendsContent,
            defaultPlayMode,
            seeked,
            showProgressLoadBar,
            bounds,
            defaultPosition,
            showMiniProcessBar,
            preload,
            glassBg,
            remove,
            lyricClassName,
            showLyric,
            getContainer,
            autoHiddenCover,
            showDestroy,
            responsive,
        } = this.props

        const { locale } = this

        const {
            toggle,
            playing,
            currentTime,
            soundValue,
            moveX,
            moveY,
            loading,
            audioListsPanelVisible,
            theme,
            lyric,
            cover,
            musicSrc,
            playId,
            isMobile,
            playMode,
            playModeTipVisible,
            playModelNameVisible,
            initAnimate,
            loadedProgress,
            audioLists,
            removeId,
            currentLyric,
            defaultLyric,
            audioLyricVisible,
            isPlayDestroyed,
            isResetCoverRotate,
            playListName,
            addPlayListName,
            renamePlayListName,
            likeMode,
            isAddPlayList,
        } = this.state;

        const preloadState =
            preload === false || preload === 'none'
                ? {}
                : preload === true
                ? { preload: 'auto' }
                : { preload };

        const panelToggleAnimate = initAnimate
            ? { show: audioListsPanelVisible, hide: !audioListsPanelVisible }
            : { show: audioListsPanelVisible };

        const currentPlayMode =
            PLAY_MODE[playMode || defaultPlayMode] || PLAY_MODE.order;

        const currentPlayModeName = locale.playModeText[currentPlayMode];

        const miniModeCoverConfig =
            (showMiniModeCover && !autoHiddenCover) || (autoHiddenCover && cover)
                ? {
                    style: {
                        backgroundImage: `url(${cover})`,
                    },
                }
                : {};

        const formattedCurrentTime = formatTime(currentTime);
        const formattedAudioDuration = formatTime(this.audioDuration);

        const progressHandler = seeked
            ? {
                onChange: this.onProgressChange,
                onAfterChange: this.onAudioSeeked,
            }
            : {};



        // ?????? ?????? ?????? ??? ??????
        const ProgressBar = (
            <>
                {showProgressLoadBar && (
                    <div
                        className="progress-load-bar"
                        style={{ width: `${Math.min(loadedProgress, 100)}%` }}
                    />
                )}
                <Slider
                    max={Math.ceil(this.audioDuration)}
                    defaultValue={0}
                    value={Math.ceil(currentTime)}
                    {...progressHandler}
                    {...PROGRESS_BAR_SLIDER_OPTIONS}
                />
            </>
        );

        // ?????? ???????????? ??????
        const DownloadComponent = showDownload && (
            <span
                className="group audio-download"
                onClick={this.onAudioDownload}
                title={locale.downloadText}
            >
        {this.iconMap.download}
      </span>
        );

        // ?????? ?????? ????????? ??????
        const ThemeSwitchComponent = showThemeSwitch && (
            <span className="group theme-switch">
        <Switch
            className="theme-switch-container"
            onChange={this.themeChange}
            checkedChildren={locale.lightThemeText}
            unCheckedChildren={locale.darkThemeText}
            checked={theme === THEME.LIGHT}
            title={locale.switchThemeText}
        />
      </span>
        );

        // ?????? ?????? ?????? ??????
        const ReloadComponent = showReload && (
            <span
                className="group reload-btn"
                onClick={this.onAudioReload}
                title={locale.reloadText}
            >
        {this.iconMap.reload}
      </span>
        );

        // ?????? ?????? ?????? ??????
        const LyricComponent = showLyric && (
            <span
                className={cls('group lyric-btn', {
                    'lyric-btn-active': audioLyricVisible,
                })}
                onClick={this.toggleAudioLyric}
                title={locale.toggleLyricText}
            >
        {this.iconMap.lyric}
      </span>
        );

        // ?????? ?????? ??????
        const PlayModeComponent = showPlayMode && (
            <span
                className={cls('group loop-btn')}
                onClick={this.togglePlayMode}
                title={locale.playModeText[currentPlayMode]}
            >
        {this.renderPlayModeIcon(currentPlayMode)}
      </span>
        );

        // LIKE ?????? ?????? ??????
        const LikeModeComponent = showLikeMode && (
            <span
                id = {"likeModeSpan"}
                className={"group loop-btn-dis"}
                onClick={this.onLikeModeChange}
                title={locale.likeModeText[currentPlayMode]}
            >
          {this.state.likeMode? this.iconMap.like : this.iconMap.dislike}
      </span>
        )

        const miniProcessBarR = isMobile ? 30 : 40

        // music-player ?????? ??????
        const DestroyComponent = showDestroy && (
            <span
                title={locale.destroyText}
                className="group destroy-btn"
                ref={this.destroyBtn}
                onClick={!drag || toggle ? this.onDestroyPlayer : undefined}
            >
        {this.iconMap.destroy}
      </span>
        )

        // seek controller
        const AudioController = (
            <div
                className={cls('react-jinke-music-player')}
                style={defaultPosition}
                tabIndex="-1"
            >
                <div className={cls('music-player')}>
                    {showMiniProcessBar && (
                        <CircleProcessBar
                            progress={currentTime / this.audioDuration}
                            r={miniProcessBarR}
                        />
                    )}
                    <div
                        id={this.targetId}
                        className={cls('scale', 'music-player-controller', {
                            'music-player-playing': playing,
                        })}
                        {...miniModeCoverConfig}
                        onClick={!drag ? this.onOpenPanel : undefined}
                    >
                        {loading ? (
                            this.iconMap.loading
                        ) : (
                            <>
                <span className="controller-title">
                  {locale.controllerTitle}
                </span>
                                <div className="music-player-controller-setting">
                                    {toggle ? locale.closeText : locale.openText}
                                </div>
                            </>
                        )}
                    </div>
                    {DestroyComponent}
                </div>
            </div>
        )



        const container = getContainer() || document.body
        const audioTitle = this.getAudioTitle()

        if (isPlayDestroyed) {
            return null
        }

        const shouldShowPlayIcon =
            !playing || this.state.currentVolumeFade === VOLUME_FADE.OUT;


        /*music-player ?????????*/
        return createPortal(
            <div
                className={cls(
                    'react-jinke-music-player-main',
                    {
                        'light-theme': theme === THEME.LIGHT,
                        'dark-theme': theme === THEME.DARK,
                    },
                    className,
                )}
                style={style}
                ref={this.player}
                tabIndex="-1"
            >
                <div>
                    <h2>wavesurfer</h2>
                <Waveform
                    wave={this.wavesurfer}
                    url={this.state.musicSrc}
                    onSeek={this.onWaveSeek}
                />
                </div>
                <br/>
                <span style={{display:"flex"}}>
                    <div className={cls('lyrics-')}>
                        <h2>lyrics - all</h2>
                        <DefaultLyrics
                            lyrics={this.state.defaultLyric}
                            currentMillisecond={this.state.currentTime * 1000}
                        />
                    </div>
                    <p/>
                    <div className="lyrics-editable">
                        <h2>lyrics - editable</h2>
                        <TextField id="outlined-basic"
                                onChange = {this.onChangeEditLyrics}
                                value={this.state.lyric}
                                multiline
                                rows="10"
                                style={{width : 400}}

                        />
                    </div>
                </span>
                {toggle ? undefined : drag ? (
                    <Draggable
                        bounds={bounds}
                        position={{ x: moveX, y: moveY }}
                        onDrag={this.onControllerDrag}
                        onStop={this.onControllerDragStop}
                        onStart={this.onControllerDragStart}
                    >
                        {AudioController}
                    </Draggable>
                ) : (
                    AudioController
                )}
                {toggle && (!isMobile || !responsive) && (
                    <div
                        className={cls('music-player-panel', 'translate', {
                            'glass-bg': glassBg,
                        })}
                    >
                        <section className="panel-content">
                            {/* lgtm [js/trivial-conditional] */}
                            {(!autoHiddenCover || (autoHiddenCover && cover)) && (
                                <div
                                    className={cls('img-content', 'img-rotate', {
                                        'img-rotate-pause': !playing || !cover,
                                        'img-rotate-reset': isResetCoverRotate,
                                    })}
                                    style={{ backgroundImage: `url(${cover})` }}
                                    onClick={() => this.onCoverClick()}
                                />
                            )}
                            <div className="audio-title">
                <span title={audioTitle}>
                    {this.renderAudioTitle()}
                </span>
                                <div className="title">{this.getOnlyAudioTitle()}</div>
                            </div>
                            <div className="progress-bar-content">

                                <section className="audio-main">
                  <span className="current-time" title={formattedCurrentTime}>
                    {loading ? '--' : formattedCurrentTime}
                  </span>
                                    <div className="progress-bar">{ProgressBar}</div>
                                    <span className="duration" title={formattedAudioDuration}>
                    {loading ? '--' : formattedAudioDuration}
                  </span>
                                </section>
                            </div>
                            <div className="player-content">
                                {ReloadComponent}

                                {!showPlay ? (
                                    loading && this.iconMap.loading
                                ) : (
                                    <span className="group">
                    <span
                        className="group prev-audio"
                        title={locale.previousTrackText}
                        onClick={this.onPlayPrevAudio}
                    >
                      {this.iconMap.prev}
                    </span>
                                        {loading ? (
                                            <span
                                                className="group loading-icon"
                                                title={locale.loadingText}
                                            >
                        {this.iconMap.loading}
                      </span>
                                        ) : (
                                            <span
                                                className="group play-btn"
                                                onClick={this.onTogglePlay}
                                                title={
                                                    shouldShowPlayIcon
                                                        ? locale.clickToPlayText
                                                        : locale.clickToPauseText
                                                }
                                            >
                        {shouldShowPlayIcon
                            ? this.iconMap.play
                            : this.iconMap.pause}
                      </span>
                                        )}
                                        <span
                                            className="group next-audio"
                                            title={locale.nextTrackText}
                                            onClick={this.onPlayNextAudio}
                                        >
                      {this.iconMap.next}
                    </span>
                  </span>
                                )}

                                {DownloadComponent}
                                {ThemeSwitchComponent}
                                {extendsContent || null}

                                {PlayModeComponent}

                                {/* ???????????? */}
                                <span className="group play-sounds" title={locale.volumeText}>
                  {soundValue === 0 ? (
                      <span className="sounds-icon" onClick={this.onResetVolume}>
                      {this.iconMap.mute}
                    </span>
                  ) : (
                      <span className="sounds-icon" onClick={this.onAudioMute}>
                      {this.iconMap.volume}
                    </span>
                  )}
                                    <Slider
                                        value={soundValue}
                                        onChange={this.onAudioSoundChange}
                                        className="sound-operation"
                                        {...VOLUME_BAR_SLIDER_OPTIONS}
                                    />
                </span>

                                {LyricComponent}

                                <span
                                    className="group audio-lists-btn"
                                    title={locale.playListsText}
                                    onClick={this.openAudioListsPanel}
                                >
                  <span className="audio-lists-icon">
                    {this.iconMap.playLists}
                  </span>
                  <span className="audio-lists-num">{audioLists.length}</span>
                </span>

                                {toggleMode && (
                                    <span
                                        className="group hide-panel"
                                        title={locale.toggleMiniModeText}
                                        onClick={this.onHidePanel}
                                    >
                    {this.iconMap.toggle}
                  </span>
                                )}

                                {/*{DestroyComponent}*/}

                                {LikeModeComponent}

                            </div>
                        </section>
                    </div>
                )}
                {/* ?????????????????? */}
                <AudioListsPanel
                    playing={playing}
                    playId={playId}
                    loading={loading}
                    visible={audioListsPanelVisible}
                    audioLists={audioLists}
                    onPlay={this.audioListsPlay}
                    onClosePanel={this.closeAudioListsPanel}
                    icon={this.iconMap}
                    isMobile={isMobile}
                    panelToggleAnimate={panelToggleAnimate}
                    glassBg={glassBg}
                    cover={cover}
                    remove={remove}
                    onDelete={this.onDeleteAudioLists}
                    removeId={removeId}
                    locale={locale}
                    onLikeModeChange={this.onLikeModeChange}
                    likeMode={likeMode}
                    listMode = {this.state.playListMode}
                    playLists = {this.state.myPlayLists}
                    onPlayListClick = {this.onPlayListClick}
                    playListName = {playListName}
                    onBackClick = {this.onBackClick}
                    onAddPlayListConfirm = {this.onAddPlayListConfirm}
                    onAddPlayList = {this.onAddPlayList}
                    onChangeAddPlayListName = {this.onChangeAddPlayListName}
                    isAddPlayList = {isAddPlayList}
                    addPlayListName = {addPlayListName}
                    onPlayListRename={this.onPlayListRename}
                    onPlayListDuplicate={this.onPlayListDuplicate}
                    onPlayListDelete={this.onPlayListDelete}
                    playListRenameInput = {this.playListRenameInput}
                />
                {/* ????????????????????? */}
                {!isMobile && (
                    <PlayModel
                        visible={playModelNameVisible}
                        value={currentPlayModeName}
                    />
                )}
                {/* ?????? */}
                {audioLyricVisible && (
                    <Draggable>
                        <div className={cls('music-player-lyric', lyricClassName)}>
                            {currentLyric || locale.emptyLyricText}
                        </div>
                    </Draggable>
                )}
                <audio
                    className="music-player-audio"
                    title={audioTitle}
                    {...preloadState}
                    src={musicSrc}
                    ref={(node) => {
                        this.audio = node
                    }}
                />
            </div>,
            container,
        )
    }

    getPlayIndex = (
        playIndex = this.state.playIndex,
        audioLists = this.state.audioLists,
    ) => {
        return Math.max(
            DEFAULT_PLAY_INDEX,
            Math.min(audioLists.length - 1, playIndex),
        )
    }

    onCoverClick = (mode = MODE.FULL) => {
        const { showMiniModeCover } = this.props
        const { cover } = this.state
        if (!showMiniModeCover && mode === MODE.MINI) {
            return
        }
        if (this.props.onCoverClick && cover) {
            this.props.onCoverClick(
                mode,
                this.state.audioLists,
                this.getBaseAudioInfo(),
            )
        }
    }

    getAudioTitle = () => {
        const { audioTitle } = this.locale || {}
        const { name, singer } = this.state
        if (typeof audioTitle === 'function' && this.audio) {
            return audioTitle(this.getBaseAudioInfo())
        }
        return audioTitle || `${name}${singer ? ` - ${singer}` : ''}`
    }

    getOnlyAudioTitle = () => {
        const { audioTitle } = this.locale || {}
        const { name } = this.state
        if (typeof audioTitle === 'function' && this.audio) {
            return audioTitle(this.getBaseAudioInfo())
        }
        return audioTitle || `${name}`
    }

    renderAudioTitle = () => {
        const { isMobile, name } = this.state
        if (this.props.renderAudioTitle) {
            return this.props.renderAudioTitle(this.getBaseAudioInfo(), isMobile)
        }
        return isMobile ? name : this.getAudioTitle()
    }

    toggleAudioLyric = () => {
        this.setState({
            audioLyricVisible: !this.state.audioLyricVisible,
        })
    }

    // ??????????????????
    togglePlayMode = () => {
        let index = this._PLAY_MODE_.findIndex(
            (mode) => mode === this.state.playMode,
        )
        const playMode =
            index === this._PLAY_MODE_LENGTH_ - 1
                ? this._PLAY_MODE_[0]
                : this._PLAY_MODE_[++index]
        this.setState({
            playMode,
            playModelNameVisible: true,
            playModeTipVisible: true,
        })
        this.props.onPlayModeChange && this.props.onPlayModeChange(playMode)

        clearTimeout(this.playModelTimer)
        this.playModelTimer = setTimeout(() => {
            this.setState({ playModelNameVisible: false, playModeTipVisible: false })
        }, this.props.playModeShowTime)
    }

    // ?????????????????? ????????????
    renderPlayModeIcon = (playMode) => {
        const animateProps = {
            className: 'react-jinke-music-player-mode-icon',
        }
        let IconNode = null
        switch (playMode) {
            case PLAY_MODE.order:
                IconNode = cloneElement(this.iconMap.order, animateProps)
                break
            case PLAY_MODE.orderLoop:
                IconNode = cloneElement(this.iconMap.orderLoop, animateProps)
                break
            case PLAY_MODE.singleLoop:
                IconNode = cloneElement(this.iconMap.loop, animateProps)
                break
            case PLAY_MODE.shufflePlay:
                IconNode = cloneElement(this.iconMap.shuffle, animateProps)
                break
            default:
                IconNode = cloneElement(this.iconMap.order, animateProps)
        }
        return IconNode
    }

    // LIKE ????????? ??????
    renderLikeModeIcon = (likeMode) => {
        const animateProps = {
            className: 'react-jinke-music-player-mode-icon'
        }

        let IconNode = null;

        switch (likeMode) {
            case true:
                IconNode = cloneElement(this.iconMap.like, animateProps);
                break;
            case false:
                IconNode = cloneElement(this.iconMap.dislike, animateProps);
                break;
            default:
                IconNode = cloneElement(this.iconMap.dislike, animateProps);
        }

        return IconNode;
    }

    /**
     * ??????????????????????????????
     * ????????? ?????????
     * ????????????
     * ????????????
     * @description: ignore ?????? ??? true playId?????????????????? ????????? ????????????,?????????????????????
     */
    audioListsPlay = (playId, ignore = false, state = this.state) => {
        const {
            playId: currentPlayId,
            playing,
            audioLists,
            loading,
            canPlay,
        } = state;

        if (Array.isArray(audioLists) && audioLists.length === 0) {
            // eslint-disable-next-line no-console
            return console.warn(
                'Warning: Your playlist has no songs. and cannot play !',
            )
        }
        if (loading && playId === currentPlayId) {
            return
        }
        const playIndex = audioLists.findIndex(
            (audio) => audio[PLAYER_KEY] === playId,
        )
        const { name, cover, musicSrc, singer, lyric} =
        audioLists[playIndex] || {}

        const loadAudio = (originMusicSrc) => {

            this.setState(
                {
                    name,
                    cover,
                    musicSrc: originMusicSrc,
                    singer,
                    playId,
                    lyric,
                    currentTime: 0,
                    playing: false,
                    loading: true,
                    canPlay: false,
                    loadedProgress: 0,
                    playIndex,
                    isAutoPlayWhenUserClicked: true,
                },
                () => {
                    this.lyric && this.lyric.stop();
                    this.audio.load();
                    this.updateMediaSessionMetadata()
                    setTimeout(() => {
                        this.initLyricParser()
                    }, 0)
                },
            )
        }
        // ????????????????????? ????????? ????????????
        if (playId === currentPlayId && !ignore) {
            this.setState({ playing: !playing })
            if (!playing) {
                if (canPlay) {
                    this.play()
                    return
                }
                return loadAudio(musicSrc)
            }
            return this.audio.pause()
        }

        this.props.onAudioPlayTrackChange &&
        this.props.onAudioPlayTrackChange(
            playId,
            audioLists,
            this.getBaseAudioInfo(),
        );
        this.props.onPlayIndexChange && this.props.onPlayIndexChange(playIndex)

        switch (typeof musicSrc) {
            case 'function':
                musicSrc().then(loadAudio, this.onAudioError)
                break
            default:
                loadAudio(musicSrc)
        }
    }

    resetAudioStatus = () => {
        this.audio.pause()
        this.lyric && this.lyric.stop()
        this.initPlayInfo([])
        this.resetAudioPlayStatus()
        this.resetAudioPlayId()
    }

    resetAudioPlayId = () => {
        this.setState({ playId: this.initPlayId })
    }

    clearAudioLists = () => {
        this.props.onAudioListsChange && this.props.onAudioListsChange('', [], {})
        this.resetAudioStatus()
    }

    onDeleteAudioLists = (audioId) => (e) => {
        e.stopPropagation()
        // ????????? ??? id  ????????????
        const { audioLists, playId } = this.state
        if (audioLists.length < 1) {
            return
        }
        this.lyric && this.lyric.stop()
        if (!audioId) {
            this.clearAudioLists()
            return
        }
        const newAudioLists = [...audioLists].filter(
            (audio) => audio[PLAYER_KEY] !== audioId,
        )
        // ??????????????????,??????????????? ????????????
        this.setState({ removeId: audioId })
        setTimeout(() => {
            this.setState(
                {
                    audioLists: newAudioLists,
                    removeId: -1,
                },
                () => {
                    if (!newAudioLists.length) {
                        return this.resetAudioStatus()
                    }
                    // ??????????????????????????????????????? ?????????????????????
                    if (audioId === playId) {
                        this.handlePlay(PLAY_MODE.orderLoop)
                    }
                },
            )
        }, AUDIO_LIST_REMOVE_ANIMATE_TIME)

        this.props.onAudioListsChange &&
        this.props.onAudioListsChange(
            playId,
            newAudioLists,
            this.getBaseAudioInfo(),
        )
    }

    openAudioListsPanel = () => {
        this.setState(({ audioListsPanelVisible }) => ({
            initAnimate: true,
            audioListsPanelVisible: !audioListsPanelVisible,
        }))
        this.props.onAudioListsPanelChange &&
        this.props.onAudioListsPanelChange(!this.state.audioListsPanelVisible)
    }

    closeAudioListsPanel = (e) => {
        e.stopPropagation()
        this._closeAudioListsPanel()
    }

    _closeAudioListsPanel = () => {
        const { audioListsPanelVisible } = this.state
        this.setState({ audioListsPanelVisible: false })
        if (audioListsPanelVisible) {
            this.props.onAudioListsPanelChange &&
            this.props.onAudioListsPanelChange(false)
        }
    }

    themeChange = (isLight) => {
        const theme = isLight ? THEME.LIGHT : THEME.DARK
        this.setState({
            theme,
        })
        this.props.onThemeChange && this.props.onThemeChange(theme)
    }

    onAudioDownload = () => {
        const { musicSrc } = this.state
        if (this.state.musicSrc) {
            const { customDownloader } = this.props
            const baseAudioInfo = this.getBaseAudioInfo()
            const onBeforeAudioDownload = this.props.onBeforeAudioDownload(
                baseAudioInfo,
            )
            let transformedDownloadAudioInfo = {}
            if (onBeforeAudioDownload && onBeforeAudioDownload.then) {
                onBeforeAudioDownload.then((info) => {
                    const { src, filename, mimeType } = info
                    transformedDownloadAudioInfo = info
                    if (customDownloader) {
                        customDownloader(info)
                    } else {
                        download(src, filename, mimeType)
                    }
                })
            } else {
                customDownloader
                    ? customDownloader({ src: musicSrc })
                    : download(musicSrc)
            }
            this.props.onAudioDownload &&
            this.props.onAudioDownload(baseAudioInfo, transformedDownloadAudioInfo)
        }
    }

    onControllerDrag = (e, { x, y }) => {
        const { moveX, moveY } = this.state
        this.isDrag = true

        // mousedown will trigger drag event on android devices (react-draggable) :(
        if (moveX === x && moveY === y) {
            this.isDrag = false
        }
    }

    onControllerDragStart = (e, { x, y }) => {
        this.isDrag = false
        this.setState({ moveX: x, moveY: y })
    }

    onControllerDragStop = (e, { x, y }) => {
        if (
            this.props.showDestroy &&
            this.destroyBtn &&
            this.destroyBtn.current &&
            this.destroyBtn.current.contains(e.target)
        ) {
            this.onDestroyPlayer()
            return
        }

        if (!this.isDrag) {
            if (this.state.isNeedMobileHack) {
                this.loadAndPlayAudio()
                this.setState({ isNeedMobileHack: false })
            }
            this.onOpenPanel()
        }
        this.setState({ moveX: x, moveY: y })
    }

    onResetVolume = () => {
        const { currentAudioVolume } = this.state
        this.setAudioVolume(this.getVolumeBarValue(currentAudioVolume || 0.1))
    }

    setAudioVolume = (volumeBarValue) => {
        this.audio.volume = this.getListeningVolume(volumeBarValue)
        this.setState({
            currentAudioVolume: volumeBarValue,
            soundValue: volumeBarValue,
        })

        // Update fade-in interval to transition to new volume
        if (this.state.currentVolumeFade === VOLUME_FADE.IN) {
            this.state.updateIntervalEndVolume &&
            this.state.updateIntervalEndVolume(volumeBarValue)
        }
    }

    stopAll = (target) => {
        target.stopPropagation()
        target.preventDefault()
    }

    getBoundingClientRect = (ele) => {
        const { left, top } = ele.getBoundingClientRect()
        return {
            left,
            top,
        }
    }

    getListeningVolume = (volumeBarValue) => {
        return volumeBarValue ** 2
    }

    getVolumeBarValue = (listeningVolume) => {
        return Math.sqrt(listeningVolume)
    }

    /*
    * audio reload ??????
    */
    onAudioReload = () => {
        if (this.props.audioLists.length) {
            this.handlePlay(PLAY_MODE.singleLoop);
            this.props.onAudioReload &&
            this.props.onAudioReload(this.getBaseAudioInfo());
            this.onWavePositionChange(this.audio.currentTime);
            if(!this.wavesurfer.current.isPlaying()){
                this.wavesurfer.current.playPause();
            }
        }
    }

    /*
    * music list?????? like mode ??????
    */
    onLikeModeChange = () => {
        let newList = this.state.audioLists;

        if(this.state.likeMode){
            newList[0].likeMode = false;
            this.setState({likeMode: false,
                audioLists : newList});
        }else {
            newList[0].likeMode = true;
            this.setState({likeMode: true,
                audioLists : newList});
        }

    }

    /*
    * play list ??? ???????????? play list ?????? ??????(onChange)
    */
    onChangeAddPlayListName = (e) => {
        this.setState({addPlayListName : e.target.value});
    }

    /*
    * play list ?????? ?????? ?????? ??????
    */
    onAddPlayListConfirm = () => {
        const newPlayListName = this.state.addPlayListName;
        const newPlayListOrder = this.state.myPlayLists.length+1;
        const newPlayListID = ('PL_' + (this.state.myPlayLists.length+1));

        this.setState({ myPlayLists: [
                ...this.state.myPlayLists,
                {
                    PL_ID : newPlayListID,
                    name: newPlayListName,
                    order : newPlayListOrder,
                    musicCnt : 0
                },
            ]});

        this.setState({
            isAddPlayList:false,
            addPlayListName:''
        });
    }

    /*
    * play list?????? play list ?????? ?????? ??????
    */
    onAddPlayList = () => {
        if(this.state.isAddPlayList){
            this.setState({isAddPlayList: false,
                addPlayListName:''
            });
        }else
        {
            this.setState({isAddPlayList: true});
        }
    }

    onChangeRenamePlayListName = (e) => {
        this.setState({renamePlayListName : e.target.value});
    }

    onRenamePlayListConfirm = () => {
        //DB??????
        this.setState({renamePlayListName : ''});
    }

    onRenamePlayListCancel = (PL_ID) => {
        //DB??????
        this.setState({renamePlayListName : ''});
    }

    playListRenameInput = (PL_ID, name) => {

        return (
            <span>
        <input type={"text"} value={this.state.renamePlayListName} onChange={this.onChangeRenamePlayListName}/>
        <span onClick={() => this.onRenamePlayListConfirm(PL_ID, name)}>
          {this.iconMap.confirmIcon}
        </span>
        <span onClick={() => this.onRenamePlayListCancel(PL_ID)}>
          {this.iconMap.close}
        </span>
      </span>
        )
    }

    onPlayListRename = (PL_ID, name) => {
        let newArray = this.state.myPlayLists;

        newArray.forEach(function(element){
            if(element.PL_ID === PL_ID){
                element.isRename = true;
            }
        });

        this.setState({myPlayLists : newArray,
            renamePlayListName : name});
    }

    onPlayListDuplicate = (PL_ID, name) => {

        //DB ??????
        console.log("onPlayListDuplicate");
    }

    onPlayListDelete = (PL_ID, name) => {
        //DB ??????
        console.log("onPlayListDelete");
    }

    /*audioList ??????*/
    onAudioListSort = (audioList) =>{
        audioList.sort(function (a,b){
            return a.order - b.order
        })

        return audioList
    }

    onFind = (arr, playListName) => {
        /*

            let index = arr.indexOf(playListName);
            while (index != -1) {
              searchResult.push(index);
              index = arr.indexOf(playListName, index + 1);
            }
        */

        let searchResult = [];
        for(var i = 0; i < arr.length; i++){
            if(arr[i].PL_ID === playListName){
                searchResult.push(arr[i]);
            }
        }
        return searchResult;
    }

    /*
    * play list ???????????? ?????? play list ??? ???????????? ???
    */
    onPlayListClick = (playlist) => {
        console.log(playlist);
        console.log(playlist.PL_ID);

        /*    let new_array = [];
            new_array = this.onFind(this.state.audioLists, playlist.PL_ID);

            console.log(new_array);

            this.updateAudioLists(new_array);*/

        console.log(this.audioLists);
        this.setState({
            /*audioLists : new_array,*/
            playListName : playlist.name,
            playListMode : PLAY_LIST_MODE.music
        });
    }

    /*
    * music list ?????? play list ???????????? ????????????
    */
    onBackClick = () => {
        this.setState({playListMode : PLAY_LIST_MODE.list});
    }

    onOpenPanel = () => {
        const { toggleMode, spaceBar } = this.props
        if (toggleMode) {
            this.setState({ toggle: true })
            this.props.onModeChange && this.props.onModeChange(MODE.FULL)
            if (spaceBar && this.player.current) {
                this.player.current.focus({ preventScroll: true })
            }
        }
        this.onCoverClick(MODE.MINI)
    }

    onHidePanel = () => {
        this.setState({ toggle: false, audioListsPanelVisible: false })
        this.props.onModeChange && this.props.onModeChange(MODE.MINI)
    }

    onDestroyPlayer = () => {
        if (this.props.onBeforeDestroy) {
            const onBeforeDestroy = Promise.resolve(
                this.props.onBeforeDestroy(
                    this.state.playId,
                    this.state.audioLists,
                    this.getBaseAudioInfo(),
                ),
            )

            if (onBeforeDestroy && onBeforeDestroy.then) {
                onBeforeDestroy
                    .then(() => {
                        this._onDestroyPlayer()
                    })
                    // ignore unhandledrejection handler
                    .catch(() => {})
            }
            return
        }
        this._onDestroyPlayer()
    }

    _onDestroyPlayer = () => {
        this.unInstallPlayer()
    }

    _onDestroyed = () => {
        this.setState({ isPlayDestroyed: true })
        if (this.props.onDestroyed) {
            this.props.onDestroyed(
                this.state.playId,
                this.state.audioLists,
                this.getBaseAudioInfo(),
            )
        }
    }

    getCurrentPlayIndex = () => {
        return this.state.audioLists.findIndex(
            (audio) => audio[PLAYER_KEY] === this.state.playId,
        )
    }

    resetAudioPlayStatus = () => {
        return new Promise((res) => {
            this.setState(
                {
                    currentTime: 0,
                    loading: false,
                    playing: false,
                    canPlay: false,
                    lyric: '',
                    currentLyric: '',
                    defaultLyric : '',
                    loadedProgress: 0,
                    playIndex: DEFAULT_PLAY_INDEX,
                },
                res,
            )
        })
    }

    // ????????????????????? ????????????
    getBaseAudioInfo() {
        const {
            cover,
            name,
            likeMode,
            musicSrc,
            soundValue,
            lyric,
            audioLists,
            currentLyric,
            defaultLyric,
        } = this.state

        const {
            currentTime,
            muted,
            networkState,
            readyState,
            played,
            paused,
            ended,
            startDate,
        } = this.audio || {}

        const currentPlayIndex = this.getCurrentPlayIndex()
        const currentAudioListInfo = audioLists[currentPlayIndex] || {}

        return {
            ...currentAudioListInfo,
            cover,
            name,
            likeMode,
            musicSrc,
            volume: soundValue,
            currentTime,
            duration: this.audioDuration,
            muted,
            networkState,
            readyState,
            played,
            paused,
            ended,
            startDate,
            lyric,
            currentLyric,
            defaultLyric,
            playIndex: currentPlayIndex,
        }
    }

    onTogglePlay = () => {
        this.setState({ isAudioSeeking: false })




        if (this.state.audioLists.length >= 1) {
            const { fadeIn, fadeOut } = this.props.volumeFade || {}
            const { currentVolumeFade, currentVolumeFadeInterval } = this.state
            const isCurrentlyFading =
                currentVolumeFade === VOLUME_FADE.IN ||
                currentVolumeFade === VOLUME_FADE.OUT

            /**
             * Currently in middle of fading in/out, so need to cancel the current interval and do the opposite action.
             * E.g. if currently fading out, then we need to cancel the fade-out and do a fade-in starting at current volume.
             */
            if (isCurrentlyFading) {
                // Clear current fade-in/out
                clearInterval(currentVolumeFadeInterval)
                this.setState({
                    currentVolumeFadeInterval: undefined,
                    updateIntervalEndVolume: undefined,
                })
            }

            // Currently playing track or in the middle of fading in
            if (
                (!isCurrentlyFading && this.state.playing) ||
                currentVolumeFade === VOLUME_FADE.IN
            ) {
                this.setState({ currentVolumeFade: VOLUME_FADE.OUT })
                // Fade in from current volume to 0
                const {
                    fadeInterval: fadeOutInterval,
                    updateIntervalEndVolume,
                } = adjustVolume(
                    this.audio,
                    this.audio.volume,
                    0,
                    {
                        duration: fadeOut,
                    },
                    () => {
                        this.audio.pause()
                        this.setState({
                            currentVolumeFade: VOLUME_FADE.NONE,
                            currentVolumeFadeInterval: undefined,
                            playing: false,
                            updateIntervalEndVolume: undefined,
                        })
                        // Restore volume so slider does not reset to zero
                        this.audio.volume = this.getListeningVolume(this.state.soundValue)
                    },
                )

                this.setState({
                    currentVolumeFadeInterval: fadeOutInterval,
                    updateIntervalEndVolume,
                })
            } else {
                this.setState({ currentVolumeFade: VOLUME_FADE.IN })
                // Start volume may not be 0 if interrupting a fade-out
                const startVolume = isCurrentlyFading ? this.audio.volume : 0
                const endVolume = this.getListeningVolume(this.state.soundValue)
                const {
                    fadeInterval: fadeInInterval,
                    updateIntervalEndVolume,
                } = adjustVolume(
                    this.audio,
                    startVolume,
                    endVolume,
                    {
                        duration: fadeIn,
                    },
                    () => {
                        this.setState({
                            currentVolumeFade: VOLUME_FADE.NONE,
                            currentVolumeFadeInterval: undefined,
                            updateIntervalEndVolume: undefined,
                        })
                        // It's possible that the volume level in the UI has changed since beginning of fade
                        this.audio.volume = this.getListeningVolume(this.state.soundValue)
                    },
                )



                this.setState(
                    {
                        currentVolumeFadeInterval: fadeInInterval,
                        updateIntervalEndVolume,
                        isAutoPlayWhenUserClicked: true,
                    },
                    () => {
                        if (fadeInInterval) {
                            this.audio.volume = startVolume
                        }
                        this.loadAndPlayAudio()
                    },
                )
            }
            this.wavesurfer.current.playPause();
        }
    }

    playAudio = (isLoaded = false) => {
        if (this.isAudioCanPlay || isLoaded) {
            if (isLoaded) {
                this.setAudioLoaded()
            }
            this.loadAndPlayAudio(isLoaded)
        }
    }

    setAudioLoaded = () => {
        this.setState({
            loading: false,
            playing: false,
        })
    }

    onAudioPause = () => {
        this.setState({ playing: false })
        this.props.onAudioPause && this.props.onAudioPause(this.getBaseAudioInfo())
        if (this.state.lyric && this.lyric) {
            this.lyric.togglePlay()
        }
    }

    onAudioPlay = () => {
        // Audio currentTime changed will be trigger audio playing event
        if (this.state.isAudioSeeking) {
            return
        }
        this.setState({ playing: true, loading: false })
        this.props.onAudioPlay && this.props.onAudioPlay(this.getBaseAudioInfo())
        if (this.state.lyric && this.lyric) {
            this.lyric.togglePlay()
        }
    }

    onSetAudioLoadedProgress = () => {
        const { buffered: timeRanges, duration } = this.audio
        if (timeRanges.length && timeRanges.end) {
            const loadedProgress =
                (timeRanges.end(timeRanges.length - 1) / duration) * 100

            this.setState({ loadedProgress })
        }
    }

    loadAndPlayAudio = (isLoaded = false) => {
        const { remember } = this.props
        const { isInitRemember, musicSrc } = this.state
        const { networkState, readyState } = this.audio

        if (!musicSrc) {
            return
        }

        if (
            networkState === AUDIO_NETWORK_STATE.NETWORK_NO_SOURCE ||
            networkState === AUDIO_NETWORK_STATE.NETWORK_EMPTY
        ) {
            return this.onAudioError({
                reason: `
          [loadAndPlayAudio]: Failed to load because no supported source was found.
          current network status is ${networkState}.
        `,
            })
        }

        this.setState({
            playing: false,
            loading: true,
            isAudioSeeking: false,
            isResetCoverRotate: false,
        })

        if (isLoaded || readyState >= AUDIO_READY_STATE.HAVE_FUTURE_DATA) {
            const { playing } = this.getLastPlayStatus()
            const isLastPause = remember && !isInitRemember && !playing
            const canPlay = remember ? !isLastPause : this.isAudioCanPlay
            this.setState(
                {
                    playing: canPlay,
                    loading: false,
                },
                () => {
                    if (canPlay) {
                        this.play()
                    }
                    this.setState({
                        isInitAutoPlay: true,
                        isInitRemember: true,
                        isAutoPlayWhenUserClicked: false,
                    })
                },
            )
        } else {

            this.audio.load()
        }
    }

    onAudioError = (error) => {
        const { playMode, audioLists, playId, musicSrc } = this.state
        const { loadAudioErrorPlayNext } = this.props
        const isSingleLoop = playMode === PLAY_MODE.singleLoop
        const currentPlayMode = isSingleLoop ? PLAY_MODE.order : playMode

        this.lyric && this.lyric.stop()

        // ??????????????????????????????????????????????????????
        // ?????????????????? https://developer.mozilla.org/en-US/docs/Web/API/MediaError
        if (musicSrc) {
            // ?????????????????????????????? ?????????????????????
            if (loadAudioErrorPlayNext && audioLists.length) {
                const isLastAudio =
                    (playMode === PLAY_MODE.order || playMode === PLAY_MODE.orderLoop) &&
                    playId === audioLists[audioLists.length - 1][PLAYER_KEY]
                if (!isLastAudio) {
                    this.handlePlay(currentPlayMode, true)
                }
            }

            this.props.onAudioError &&
            this.props.onAudioError(
                this.audio.error || (error && error.reason) || null,
                playId,
                audioLists,
                this.getBaseAudioInfo(),
            )
        }
    }

    // isNext true ?????????  false
    handlePlay = (playMode, isNext = true) => {
        const { playId, audioLists } = this.state
        const audioListsLen = audioLists.length
        if (!audioListsLen) {
            return
        }
        const currentPlayIndex = this.getCurrentPlayIndex()

        switch (playMode) {
            // ????????????
            case PLAY_MODE.order:
                // ??????????????? ?????? ???????????? ?????????????????? ?????????
                if (currentPlayIndex === audioListsLen - 1) {
                    this.audio.pause()
                    return
                }

                this.audioListsPlay(
                    isNext
                        ? audioLists[currentPlayIndex + 1][PLAYER_KEY]
                        : audioLists[currentPlayIndex - 1][PLAYER_KEY],
                )
                break

            // ????????????
            case PLAY_MODE.orderLoop:
                if (isNext) {
                    if (currentPlayIndex === audioListsLen - 1) {
                        return this.audioListsPlay(audioLists[0][PLAYER_KEY])
                    }
                    this.audioListsPlay(audioLists[currentPlayIndex + 1][PLAYER_KEY])
                } else {
                    if (currentPlayIndex === 0) {
                        return this.audioListsPlay(
                            audioLists[audioListsLen - 1][PLAYER_KEY],
                        )
                    }
                    this.audioListsPlay(audioLists[currentPlayIndex - 1][PLAYER_KEY])
                }
                break

            // ????????????
            case PLAY_MODE.singleLoop:
                this.audio.currentTime = 0
                this.audioListsPlay(playId, true)
                break

            // ????????????
            case PLAY_MODE.shufflePlay:
            {
                let randomIndex = createRandomNum(0, audioListsLen - 1)
                if (randomIndex === this.getCurrentPlayIndex()) {
                    randomIndex = this.getPlayIndex(randomIndex + 1)
                }
                const randomPlayId = (audioLists[randomIndex] || {})[PLAYER_KEY]
                this.audioListsPlay(randomPlayId, true)
            }
                break
            default:
                break
        }

    }

    onAudioEnd = () => {
        this.props.onAudioEnded &&
        this.props.onAudioEnded(
            this.state.playId,
            this.state.audioLists,
            this.getBaseAudioInfo(),
        )
        this.handlePlay(this.state.playMode)
    }

    /**
     * ????????? ????????? ????????????
     * ????????????????????? ??????  ????????????????????????????????? ??????????????????????????? ?????????????????????
     * ??????????????????????????????
     */
    audioPrevAndNextBasePlayHandle = (isNext = true) => {
        const { playMode } = this.state
        let _playMode = ''
        switch (playMode) {
            case PLAY_MODE.shufflePlay:
                _playMode = playMode
                break
            default:
                _playMode = PLAY_MODE.orderLoop
                break
        }
        this.handlePlay(_playMode, isNext)
    }

    onPlayPrevAudio = () => {
        const { restartCurrentOnPrev } = this.props
        if (restartCurrentOnPrev && this.audio.currentTime > 1) {
            this.audio.currentTime = 0
            return
        }

        this.audioPrevAndNextBasePlayHandle(false);

        this.onWaveSeek();
    }

    onPlayNextAudio = () => {
        this.audioPrevAndNextBasePlayHandle(true);

        this.onWavePositionChange(0);
    }

    audioTimeUpdate = () => {
        const { currentTime } = this.audio
        this.setState({ currentTime })
        if (this.props.remember) {
            this.saveLastPlayStatus()
        }
        this.props.onAudioProgress &&
        this.props.onAudioProgress(this.getBaseAudioInfo())
    }

    onAudioSoundChange = (value) => {
        this.setAudioVolume(value)
    }

    onAudioVolumeChange = () => {
        const { volume } = this.audio
        const { currentVolumeFade, currentAudioVolume } = this.state
        if (
            currentVolumeFade !== VOLUME_FADE.NONE ||
            currentAudioVolume === volume
        ) {
            return
        }
        const volumeBarValue = this.getVolumeBarValue(volume)
        this.setState({
            soundValue: volumeBarValue,
        })
        if (this.props.onAudioVolumeChange) {
            const formattedVolume = parseFloat(volume.toFixed(4))
            this.props.onAudioVolumeChange(formattedVolume)
        }
    }

    onProgressChange = (currentTime) => {
        if (this.audio) {
            this.audio.currentTime = currentTime
        }

        this.setState({ currentTime, isAudioSeeking: true })
    }

    onAudioSeeked = (currentTime) => {
        this.setState({ isAudioSeeking: true })
        if (!this.state.audioLists.length) {
            return
        }
        this.lyric && this.lyric.seek(currentTime * 1000)

        if (!this.state.playing) {
            this.lyric && this.lyric.stop()
        }
        if (this.audio) {
            this.audio.currentTime = currentTime
            this.onWavePositionChange(currentTime);
        }

        this.props.onAudioSeeked &&
        this.props.onAudioSeeked(this.getBaseAudioInfo())

        setTimeout(() => {
            this.setState({ isAudioSeeking: false })
        }, 500)
    }

    onAudioMute = () => {
        this.setState(
            {
                soundValue: 0,
                currentAudioVolume: this.audio.volume,
            },
            () => {
                this.audio.volume = 0
            },
        )
    }

    onAudioAbort = (e) => {
        const { audioLists, playId } = this.state
        const audioInfo = this.getBaseAudioInfo()
        const mergedAudioInfo = { ...e, ...audioInfo }
        this.props.onAudioAbort &&
        this.props.onAudioAbort(playId, audioLists, mergedAudioInfo)
    }

    toggleMode = (mode) => {
        if (mode === MODE.FULL) {
            this.setState({ toggle: true })
        }
    }

    toggleTheme = (theme) => {
        this.setState({ theme })
    }

    onAudioListsSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) {
            return
        }

        const { playId, audioLists } = this.state
        const _audioLists = [...audioLists]
        const item = _audioLists.splice(oldIndex, 1)[0]
        _audioLists.splice(newIndex, 0, item)

        // ????????????????????????????????? ??????Id ?????? ????????????index
        const _playId = oldIndex === playId ? newIndex : playId

        this.setState({ audioLists: _audioLists, playId: _playId })

        this.props.onAudioListsSortEnd &&
        this.props.onAudioListsSortEnd(oldIndex, newIndex)

        this.props.onAudioListsChange &&
        this.props.onAudioListsChange(
            _playId,
            _audioLists,
            this.getBaseAudioInfo(),
        )

        // TODO: remove
        if (this.props.onAudioListsDragEnd) {
            // eslint-disable-next-line no-console
            console.warn(
                '[Deprecated] onAudioListsDragEnd is deprecated. please use onAudioListsSortEnd(oldIndex, newIndex){}',
            )
            this.props.onAudioListsDragEnd(oldIndex, newIndex)
        }
    }

    saveLastPlayStatus = () => {
        const {
            currentTime,
            playId,
            theme,
            soundValue,
            playMode,
            name,
            likeMode,
            cover,
            singer,
            musicSrc,
        } = this.state
        const lastPlayStatus = JSON.stringify({
            currentTime,
            playId,
            theme,
            playMode,
            soundValue,
            name,
            likeMode,
            cover,
            singer,
            musicSrc,
        })
        localStorage.setItem('lastPlayStatus', lastPlayStatus)
    }

    //remeber ??????
    getLastPlayStatus = () => {
        const {
            theme,
            defaultPlayMode,
            playMode,
            defaultPlayIndex,
            playIndex,
        } = this.props

        const status = {
            currentTime: 0,
            playMode: playMode || defaultPlayMode || PLAY_MODE.order,
            name: '',
            likeMode: '',
            cover: '',
            singer: '',
            musicSrc: '',
            lyric: '',
            playId: this.getDefaultPlayId(),
            theme,
            playing: true,
            playIndex: playIndex || defaultPlayIndex || 0,
        }
        try {
            return JSON.parse(localStorage.getItem('lastPlayStatus')) || status
        } catch (error) {
            return status
        }
    }

    checkCurrentPlayingAudioIsInUpdatedAudioLists = (nextProps = this.props) => {
        const { playId, musicSrc } = this.state
        if (!nextProps.quietUpdate || !Array.isArray(nextProps.audioLists)) {
            return false
        }
        return (
            playId &&
            nextProps.audioLists.some(
                (newAudioInfo) =>
                    newAudioInfo[PLAYER_KEY] === playId ||
                    newAudioInfo.musicSrc === musicSrc,
            )
        )
    }

    play = () => {
        // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
        const playPromise = this.audio.play()
        if (playPromise && playPromise.then) {
            playPromise
                .then(() => {
                    this.setState({ loading: false, playing: true })
                })
                .catch(() => {
                    this.setState({ loading: false, playing: false })
                })
        }
    }

    mockAutoPlayForMobile = () => {
        if (this.props.autoPlay && !this.state.playing) {
            this.audio.load()
            this.play()
        }
    }

    bindMobileAutoPlayEvents = () => {
        document.addEventListener(
            'touchstart',
            () => {
                this.mockAutoPlayForMobile()
            },
            { once: true },
        )
        // ??????????????????????????????
        document.addEventListener('WeixinJSBridgeReady', () => {
            this.mockAutoPlayForMobile()
        })
    }

    bindSafariAutoPlayEvents = () => {
        document.addEventListener(
            'click',
            () => {
                this.mockAutoPlayForMobile()
            },
            { once: true },
        )
    }

    unBindEvents = (...options) => {
        this.bindEvents(...options)
    }

    /**
     * ?????? audio ?????? ??????
     */
    bindEvents = (
        target = this.audio,
        eventsNames = {
            waiting: this.loadAndPlayAudio,
            canplay: this.onAudioCanPlay,
            error: this.onAudioError,
            ended: this.onAudioEnd,
            pause: this.onAudioPause,
            play: this.onAudioPlay,
            timeupdate: this.audioTimeUpdate,
            volumechange: this.onAudioVolumeChange,
            abort: this.onAudioAbort,
            progress: this.onSetAudioLoadedProgress,
        },
        bind = true,
    ) => {
        const { once } = this.props
        for (const name in eventsNames) {
            const _events = eventsNames[name]
            if (target) {
                bind
                    ? target.addEventListener(name, _events, {
                        once: !!(once && name === 'play'),
                    })
                    : target.removeEventListener(name, _events)
            }
        }
    }

    getPlayId = (audioLists = this.state.audioLists) => {
        const playIndex = this.getPlayIndex(undefined, audioLists)
        const playId =
            this.state.playId ||
            (audioLists[playIndex] && audioLists[playIndex][PLAYER_KEY])
        return playId
    }

    _getPlayInfo = (audioLists = []) => {

        const playId = this.getPlayId(audioLists)

        const { name = '', cover = '', singer = '', musicSrc = '', lyric = '', likeMode = true} =
        audioLists.find((audio) => audio[PLAYER_KEY] === playId) || {}

        return {
            name,
            likeMode,
            cover,
            singer,
            musicSrc,
            lyric,
            audioLists,
            playId,
        }
    }

    getPlayInfo = (audioLists = []) => {
        const newAudioLists = audioLists.filter((audio) => !audio[PLAYER_KEY])
        const lastAudioLists = audioLists.filter((audio) => audio[PLAYER_KEY])
        const mergedAudioLists = [
            ...lastAudioLists,
            ...newAudioLists.map((info) => {
                return {
                    ...info,
                    [PLAYER_KEY]: uuId(),
                }
            }),
        ]
        return this._getPlayInfo(mergedAudioLists)
    }

    // I change the name of getPlayInfo to getPlayInfoOfNewList because i didn't want to change the prior changes
    // the only thing this function does is to add id to audiolist elements.
    getPlayInfoOfNewList = (nextProps) => {
        const { audioLists = [] } = nextProps
        const _audioLists = audioLists.map((info) => {
            const prevAudioBeforeUpdate =
                (nextProps.quietUpdate &&
                    this.state.audioLists.find(
                        ({ musicSrc }) => musicSrc === info.musicSrc,
                    )) ||
                {}
            return {
                ...info,
                [PLAYER_KEY]: prevAudioBeforeUpdate[PLAYER_KEY] || uuId(),
            }
        })

        return this._getPlayInfo(_audioLists)
    }

    initPlayInfo = (audioLists, cb) => {
        const info = this.getPlayInfo(audioLists)

        switch (typeof info.musicSrc) {
            case 'function':
                info.musicSrc().then((originMusicSrc) => {
                    this.setState({ ...info, musicSrc: originMusicSrc }, cb)
                }, this.onAudioError)
                break
            default:
                this.setState(info, cb)
        }
    }

    addMatchMediaListener = (query, handler) => {
        const media = window.matchMedia(query)
        handler(media)
        if ('addEventListener' in media) {
            media.addEventListener('change', handler)
        } else {
            media.addListener(handler)
        }
        return media
    }

    removeMatchMediaListener = (media, handler) => {
        if (media) {
            if ('removeEventListener' in media) {
                media.removeEventListener('change', handler)
            } else {
                media.removeListener && media.removeListener(handler)
            }
        }
    }

    addMobileListener = () => {
        this.mobileMedia = this.addMatchMediaListener(
            this.props.mobileMediaQuery,
            this.mobileMediaHandler,
        )
    }

    removeMobileListener = () => {
        this.removeMatchMediaListener(this.mobileMedia, this.mobileMediaHandler)
    }

    addSystemThemeListener = () => {
        this.systemThemeMedia = this.addMatchMediaListener(
            MEDIA_QUERY.DARK_THEME,
            this.systemThemeMediaHandler,
        )
    }

    removeSystemThemeListener = () => {
        this.removeMatchMediaListener(
            this.systemThemeMedia,
            this.systemThemeMediaHandler,
        )
    }

    mobileMediaHandler = ({ matches }) => {
        this.setState({
            isMobile: !!matches,
        })
    }

    systemThemeMediaHandler = ({ matches }) => {
        if (this.props.theme === THEME.AUTO) {
            const theme = matches ? THEME.DARK : THEME.LIGHT
            this.updateTheme(theme)
        }
    }

    setDefaultAudioVolume = () => {
        const { defaultVolume, remember } = this.props
        // ?????? [0-1]
        this.defaultVolume = Math.max(0, Math.min(defaultVolume, 1))
        const { soundValue = this.defaultVolume } = this.getLastPlayStatus()
        this.setAudioVolume(remember ? soundValue : this.defaultVolume)
    }

    getDefaultPlayId = (audioLists = this.props.audioLists) => {
        const playIndex = this.getPlayIndex()
        return audioLists[playIndex] && audioLists[playIndex][PLAYER_KEY]
    }

    initLyricParser = () => {
        this.lyric = new Lyric(this.state.lyric, this.onLyricChange)
        this.setState({
            currentLyric: this.lyric.lines[0] && this.lyric.lines[0].txt,
            defaultLyric : this.lyric.lrc,
        })
    }

    onLyricChange = ({ lineNum, txt }) => {

        this.setState({
            currentLyric: txt,
        })
        this.props.onAudioLyricChange && this.props.onAudioLyricChange(lineNum, txt)
    }

    /*
    * ?????? ?????? ????????? ?????? ??????
    */
    onChangeEditLyrics = (e) => {
        const newLyric = e.target.value;

        this.lyric.lrc = newLyric;
        this.lyric._init();
        if(newLyric === ''){
            this.setState({
                lyric : newLyric,
                defaultLyric:newLyric,
                currentLyric:newLyric
            });
        }else
        {
            this.setState({
                lyric : newLyric,
                defaultLyric:newLyric
            });
        }
        this.lyric && this.lyric.seek(this.state.currentTime * 1000);

    }

    /*
    * Waveform ?????? ?????? ?????? onChange
    * (?????? ?????? ?????? ????????? ??????)
    */
    onWavePositionChange(seconds){
        if (seconds >= this.wavesurfer.current.getDuration()) {
            this.wavesurfer.current.seekTo(1);
        } else {
            this.wavesurfer.current.seekTo(seconds / this.wavesurfer.current.getDuration());
        }
    }

    /*
 * Waveform ?????? ?????? ?????? onChange
 */
    onWaveSeek = () => {

        this.onProgressChange(this.wavesurfer.current.getCurrentTime());

        this.setState({ isAudioSeeking: true })
        if (!this.state.audioLists.length) {
            return
        }
        this.lyric && this.lyric.seek(this.wavesurfer.current.getCurrentTime() * 1000)

        if (!this.state.playing) {
            this.lyric && this.lyric.stop()
        }
        if (this.audio) {
            this.audio.currentTime = this.wavesurfer.current.getCurrentTime();
            //this.onWavePositionChange(this.wavesurfer.current.getCurrentTime());
        }

        this.props.onAudioSeeked &&
        this.props.onAudioSeeked(this.getBaseAudioInfo())

        setTimeout(() => {
            this.setState({ isAudioSeeking: false })
        }, 500)
    }



    updateTheme = (theme) => {
        if (
            theme &&
            theme !== this.props.theme &&
            Object.values(THEME).includes(theme)
        ) {
            this.setState({ theme })
        }
    }

    updateMode = (mode) => {
        if (
            mode &&
            mode !== this.props.mode &&
            Object.values(MODE).includes(mode)
        ) {
            this.setState({ toggle: mode === MODE.FULL })
            if (mode === MODE.MINI) {
                this._closeAudioListsPanel()
            }
        }
    }

    updatePlayMode = (playMode) => {
        if (!Object.values(PLAY_MODE).includes(playMode)) {
            return
        }
        if (playMode !== this.props.playMode) {
            this.setState({ playMode })
        }
    }

    updateAudioLists = (audioLists) => {
        const newAudioLists = [
            ...this.state.audioLists,
            ...audioLists.filter(
                (audio) =>
                    this.state.audioLists.findIndex(
                        (v) => v.musicSrc === audio.musicSrc,
                    ) === -1,
            ),
        ]
        this.initPlayInfo(newAudioLists)
        this.bindEvents(this.audio)
        this.props.onAudioListsChange &&
        this.props.onAudioListsChange(
            this.state.playId,
            audioLists,
            this.getBaseAudioInfo(),
        )
    }

    loadNewAudioLists = (nextProps) => {
        const {
            audioLists,
            remember,
            playMode,
            theme,
            autoPlayInitLoadPlayList,
            playIndex,
        } = nextProps
        if (!Array.isArray(audioLists) || !audioLists.length) {
            return
        }
        const info = this.getPlayInfoOfNewList(nextProps)
        const lastPlayStatus = remember
            ? this.getLastPlayStatus()
            : {
                playMode: playMode || PLAY_MODE.order,
                playIndex: playIndex || DEFAULT_PLAY_INDEX,
            }

        if (theme !== THEME.AUTO) {
            lastPlayStatus.theme = theme
        }

        const audioInfo = {
            ...info,
            ...lastPlayStatus,
            isInitAutoPlay: autoPlayInitLoadPlayList,
            playing: this.isAudioCanPlay,
        }

        if (this.checkCurrentPlayingAudioIsInUpdatedAudioLists(nextProps)) {
            this.setState({ audioLists: info.audioLists })
            return
        }

        switch (typeof info.musicSrc) {
            case 'function':
                info.musicSrc().then((musicSrc) => {
                    this.setState({
                        ...audioInfo,
                        musicSrc,
                    })
                }, this.onAudioError)
                break
            default:
                this.setState(audioInfo)
        }
    }

    resetPlayId = () => {
        return new Promise((res) => {
            this.setState({ playId: this.initPlayId }, res)
        })
    }

    changeAudioLists = (nextProps) => {
        if (!this.checkCurrentPlayingAudioIsInUpdatedAudioLists(nextProps)) {
            this.resetAudioStatus()
        }
        this.resetPlayId().then(() => {
            this.loadNewAudioLists(nextProps)
            this.props.onAudioListsChange &&
            this.props.onAudioListsChange(
                this.state.playId,
                nextProps.audioLists,
                this.getBaseAudioInfo(),
            )
        })
    }

    updatePlayIndex = (playIndex) => {
        const currentPlayIndex = this.getCurrentPlayIndex()
        if (playIndex !== undefined && currentPlayIndex !== playIndex) {
            this.resetAudioPlayStatus().then(() => {
                const currentPlayAudio = this.state.audioLists[
                    this.getPlayIndex(playIndex)
                    ]
                if (currentPlayAudio && currentPlayAudio[PLAYER_KEY]) {
                    this.audioListsPlay(currentPlayAudio[PLAYER_KEY], true)
                }
            })
        }
    }

    playByIndex = (index) => {
        this.updatePlayIndex(index)
    }

    getEnhanceAudio = () => {
        const { audio } = this
        ;[
            {
                name: 'destroy',
                value: this.onDestroyPlayer,
            },
            {
                name: 'updatePlayIndex',
                value: this.updatePlayIndex,
            },
            {
                name: 'playByIndex',
                value: this.playByIndex,
            },
            {
                name: 'playNext',
                value: this.onPlayNextAudio,
            },
            {
                name: 'playPrev',
                value: this.onPlayPrevAudio,
            },
            {
                name: 'togglePlay',
                value: this.onTogglePlay,
            },
            {
                name: 'clear',
                value: this.clearAudioLists,
            },
            {
                name: 'sortable',
                value: this.sortable,
            },
        ].forEach(({ name, value }) => {
            Object.defineProperty(audio, name, {
                value,
                writable: false,
            })
        })
        return audio
    }

    onGetAudioInstance = () => {
        if (this.props.getAudioInstance) {
            this.props.getAudioInstance(this.getEnhanceAudio())
        }
    }

    updateMediaSessionMetadata = () => {
        if ('mediaSession' in navigator && this.props.showMediaSession) {
            const { name, cover, singer } = this.state
            const mediaMetaDataConfig = {
                title: name,
                artist: singer,
                album: name,
            }
            if (cover) {
                mediaMetaDataConfig.artwork = [
                    '96x96',
                    '128x128',
                    '192x192',
                    '256x256',
                    '384x384',
                    '512x512',
                ].map((size) => ({
                    src: cover,
                    sizes: size,
                    type: 'image/png',
                }))
            }
            //navigator.mediaSession.metadata = new MediaMetadata(mediaMetaDataConfig)
            this.updateMediaSessionPositionState()
        }
    }

    updateMediaSessionPositionState = () => {
        if ('setPositionState' in navigator.mediaSession) {
            try {
                const { audio } = this
                navigator.mediaSession.setPositionState({
                    duration: this.audioDuration,
                    playbackRate: audio.playbackRate || 1,
                    position: audio.currentTime || 0,
                })
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Update media session position state failed: ', error)
            }
        }
    }

    onAddMediaSession = () => {
        if ('mediaSession' in navigator && this.props.showMediaSession) {
            const defaultSkipTime = 10
            navigator.mediaSession.setActionHandler('play', this.onTogglePlay)
            navigator.mediaSession.setActionHandler('pause', this.onTogglePlay)
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const skipTime = details.seekOffset || defaultSkipTime
                this.audio.currentTime = Math.max(this.audio.currentTime - skipTime, 0)
                this.props.onAudioSeeked &&
                this.props.onAudioSeeked(this.getBaseAudioInfo())
            })
            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const skipTime = details.seekOffset || defaultSkipTime
                this.audio.currentTime = Math.min(
                    this.audio.currentTime + skipTime,
                    this.audioDuration,
                )
                this.props.onAudioSeeked &&
                this.props.onAudioSeeked(this.getBaseAudioInfo())
            })
            navigator.mediaSession.setActionHandler(
                'previoustrack',
                this.onPlayPrevAudio,
            )
            navigator.mediaSession.setActionHandler('nexttrack', this.onPlayNextAudio)

            setTimeout(() => {
                this.updateMediaSessionMetadata()
            }, 0)

            try {
                navigator.mediaSession.setActionHandler('seekto', (event) => {
                    if (event.fastSeek && 'fastSeek' in this.audio) {
                        this.audio.fastSeek(event.seekTime)
                        return
                    }
                    this.audio.currentTime = event.seekTime
                    this.updateMediaSessionPositionState()
                })
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(
                    'Warning! The "seekto" media session action is not supported.',
                )
            }
        }
    }

    bindUnhandledRejection = () => {
        window.addEventListener('unhandledrejection', this.onAudioError)
    }

    unBindUnhandledRejection = () => {
        window.removeEventListener('unhandledrejection', this.onAudioError)
    }

    bindKeyDownEvents = () => {
        if (this.props.spaceBar && this.player.current) {
            this.player.current.addEventListener('keydown', this.onKeyDown, false)
            this.player.current.focus({ preventScroll: true })
        }
    }

    unBindKeyDownEvents = () => {
        if (this.player.current) {
            this.player.current.removeEventListener('keydown', this.onKeyDown, false)
        }
    }

    onKeyDown = (e) => {
        const { spaceBar } = this.props
        if (spaceBar && e.keyCode === SPACE_BAR_KEYCODE) {
            this.onTogglePlay()
        }
    }

    initPlayer = (
        audioLists = this.props.audioLists,
        isBindKeyDownEvents = true,
        resetAudioVolume = true,
    ) => {
        if (!Array.isArray(audioLists) || !audioLists.length) {
            return
        }
        if (resetAudioVolume) {
            this.setDefaultAudioVolume()
        }
        this.bindUnhandledRejection()
        this.bindEvents(this.audio)
        this.initLyricParser()
        this.onAddMediaSession()
        if (IS_MOBILE) {
            this.bindMobileAutoPlayEvents()
        } else {
            if (isBindKeyDownEvents) {
                this.bindKeyDownEvents()
            }
            if (isSafari()) {
                this.bindSafariAutoPlayEvents()
            }
        }
    }

    removeLyric = () => {
        if (this.lyric) {
            this.lyric.stop()
            this.lyric = undefined
        }
    }

    unInstallPlayer = () => {
        this.unBindEvents(this.audio, undefined, false)
        this.unBindUnhandledRejection()
        this.unBindKeyDownEvents()
        this.removeMobileListener()
        this.removeLyric()
        this._onDestroyed()
        this.sortable && this.sortable.destroy()
    }

    onAudioCanPlay = () => {
        if (this.state.isAudioSeeking) {
            return
        }
        this.setState({ canPlay: true }, () => {
            this.playAudio(true)
        })
    }

    initSortableAudioLists = () => {
        const { audioLists, sortableOptions } = this.props
        const { selector, ...defaultOptions } = SORTABLE_CONFIG
        const container = document.querySelector(`.${selector}`)
        if ((Array.isArray(audioLists) && !audioLists.length) || !container) {
            return
        }

        if (this.sortable) {
            this.sortable.destroy()
        }
        this.sortable = new Sortable(container, {
            onEnd: this.onAudioListsSortEnd,
            ...defaultOptions,
            ...sortableOptions,
        })
    }

    componentDidUpdate(_, prevState) {
        if (prevState.musicSrc !== this.state.musicSrc) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ isResetCoverRotate: true })
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            audioLists,
            playIndex,
            theme,
            mode,
            playMode,
            clearPriorAudioLists,
        } = nextProps
        const isEqualAudioLists = arrayEqual(audioLists)(this.props.audioLists)
        if (!isEqualAudioLists) {
            if (clearPriorAudioLists) {
                this.changeAudioLists(nextProps)
            } else {
                this.updateAudioLists(audioLists)
            }
            if (!this.checkCurrentPlayingAudioIsInUpdatedAudioLists(nextProps)) {
                this.initPlayer(audioLists, false, false)
            }
            setTimeout(() => this.initSortableAudioLists(), 200)
        }
        this.updatePlayIndex(
            !isEqualAudioLists && clearPriorAudioLists
                ? DEFAULT_PLAY_INDEX
                : playIndex,
        )
        this.updateTheme(theme)
        this.updateMode(mode)
        this.updatePlayMode(playMode)
    }

    // eslint-disable-next-line camelcase
    // load ??? state ??????
    UNSAFE_componentWillMount() {
        console.log("UNSAFE_componentWillMount");
        const { audioLists, remember, myPlayLists, playListMode } = this.props

        if (Array.isArray(myPlayLists) && myPlayLists.length >= 1) {
            myPlayLists.forEach(function (element){
                element.isRename = false;
            });
        }

        if (Array.isArray(audioLists) && audioLists.length >= 1) {
            const playInfo = this.getPlayInfo(audioLists)

            const lastPlayStatus = remember ? this.getLastPlayStatus() : {}

            switch (typeof playInfo.musicSrc) {
                case 'function':
                    playInfo.musicSrc().then((val) => {
                        this.setState({
                            ...playInfo,
                            myPlayLists,
                            playListMode,
                            musicSrc: val,
                            ...lastPlayStatus,
                        })
                    }, this.onAudioError)
                    break
                default:
                    this.setState({
                        ...playInfo,
                        myPlayLists,
                        playListMode,
                        ...lastPlayStatus,
                    })
            }
        }

    }

    componentWillUnmount() {
        this.unInstallPlayer()
    }

    componentDidMount() {
        this.addMobileListener()
        this.addSystemThemeListener()
        this.initPlayer()
        this.initSortableAudioLists()
        this.onGetAudioInstance()
    }
}
