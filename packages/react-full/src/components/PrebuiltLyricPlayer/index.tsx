/**
 * @fileoverview
 * 已经部署好所有组件的歌词播放器组件，在正确设置所有的 Jotai 状态后可以开箱即用
 */

import { LyricPlayer, BackgroundRender } from "@applemusic-like-lyrics/react";
import { AutoLyricLayout } from "../../layout/auto";
import { ControlThumb } from "../ControlThumb";
import { Cover } from "../Cover";
import styles from "./index.module.css";
import "@applemusic-like-lyrics/core/style.css";
import { useAtomValue } from "jotai";
import {
	AudioQualityType,
	hideVerticalLyricViewAtom,
	musicAlbumNameAtom,
	musicArtistsAtom,
	musicCoverAtom,
	musicCoverIsVideoAtom,
	musicLyricLinesAtom,
	musicNameAtom,
	musicPlayingAtom,
} from "../../states/music";
import { onRequestOpenMenuAtom } from "../../states/callback";
import type { FC, HTMLProps } from "react";
import { MusicInfo } from "../MusicInfo";
import { BouncingSlider } from "../BouncingSlider";
import { VolumeControl } from "../VolumeControlSlider";

import IconRewind from "./icon_rewind.svg?react";
import IconForward from "./icon_forward.svg?react";
import IconPause from "./icon_pause.svg?react";
import IconPlay from "./icon_play.svg?react";
import { MediaButton } from "../MediaButton";
import { AudioQualityTag } from "../AudioQualityTag";
import classNames from "classnames";

const PrebuiltMusicInfo: FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className, style }) => {
	const musicName = useAtomValue(musicNameAtom);
	const musicArtists = useAtomValue(musicArtistsAtom);
	const musicAlbum = useAtomValue(musicAlbumNameAtom);
	const onMenuClicked = useAtomValue(onRequestOpenMenuAtom);
	return (
		<MusicInfo
			className={className}
			style={style}
			name={musicName}
			artists={musicArtists.map((v) => v.name)}
			album={musicAlbum}
			onMenuButtonClicked={onMenuClicked.onEmit}
		/>
	);
};

const PrebuiltMediaButtons: FC = () => {
	const musicIsPlaying = useAtomValue(musicPlayingAtom);
	return (
		<>
			<MediaButton>
				<IconRewind color="#FFFFFF" />
			</MediaButton>
			<MediaButton>
				{musicIsPlaying ? (
					<IconPause color="#FFFFFF" />
				) : (
					<IconPlay color="#FFFFFF" />
				)}
			</MediaButton>
			<MediaButton>
				<IconForward color="#FFFFFF" />
			</MediaButton>
		</>
	);
};

const PrebuiltProgressBar: FC = () => {
	return (
		<>
			<BouncingSlider value={0.5} min={0} max={1} />
			<div className={styles.progressBarLabels}>
				<div>0:00</div>
				<div>
					<AudioQualityTag quality={AudioQualityType.HiRes} />
				</div>
				<div>0:00</div>
			</div>
		</>
	);
};

const PrebuiltVolumeControl: FC<{
	style?: React.CSSProperties;
}> = ({ style }) => {
	return <VolumeControl value={0.5} min={0} max={1} style={style} />;
};

/**
 * 已经部署好所有组件的歌词播放器组件，在正确设置所有的 Jotai 状态后可以开箱即用
 */
export const PrebuiltLyricPlayer: FC<HTMLProps<HTMLDivElement>> = ({
	...rest
}) => {
	const lyricLines = useAtomValue(musicLyricLinesAtom);
	const hideVerticalLyricView = useAtomValue(hideVerticalLyricViewAtom);
	const musicCover = useAtomValue(musicCoverAtom);
	const musicCoverIsVideo = useAtomValue(musicCoverIsVideoAtom);

	return (
		<AutoLyricLayout
			coverSlot={<Cover coverUrl={musicCover} />}
			thumbSlot={<ControlThumb />}
			smallControlsSlot={
				<PrebuiltMusicInfo
					className={classNames(
						styles.smallMusicInfo,
						hideVerticalLyricView && styles.hideLyric,
					)}
				/>
			}
			backgroundSlot={
				<BackgroundRender
					album={musicCover}
					albumIsVideo={musicCoverIsVideo}
					renderScale={1}
					style={{
						zIndex: -1,
					}}
				/>
			}
			bigControlsSlot={
				<>
					<PrebuiltMusicInfo
						className={classNames(
							styles.bigMusicInfo,
							hideVerticalLyricView && styles.hideLyric,
						)}
						style={{
							padding: "2em 0",
						}}
					/>
					<PrebuiltProgressBar />
					<div className={styles.bigControls}>
						<PrebuiltMediaButtons />
					</div>
					<PrebuiltVolumeControl style={{ paddingBottom: "4em" }} />
				</>
			}
			controlsSlot={
				<>
					<PrebuiltMusicInfo className={styles.horizontalControls} />
					<PrebuiltProgressBar />
					<div className={styles.controls}>
						<PrebuiltMediaButtons />
					</div>
					<PrebuiltVolumeControl />
				</>
			}
			lyricSlot={
				<LyricPlayer
					style={{ width: "100%", height: "100%" }}
					lyricLines={lyricLines}
				/>
			}
			hideLyric={hideVerticalLyricView}
			{...rest}
		/>
	);
};
