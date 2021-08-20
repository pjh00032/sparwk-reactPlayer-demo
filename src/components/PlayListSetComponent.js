import React, {memo} from "react";
import {Menu, MenuItem} from "@material-ui/core";


const PlayListSetComponent = ({
PL_ID,
name,
icon,
locale,
onPlayListRename,
onPlayListDuplicate,
onPlayListDelete
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    return (
        <span>
            <span className="player-icons" onClick={event => setAnchorEl(event.currentTarget)}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  variant="contained">
                {icon.folderSet}
            </span>
            <Menu
                elevation={0}
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    onPlayListRename(PL_ID, name);
                    }}>{locale.playListRename}</MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    onPlayListDuplicate(PL_ID, name);
                }}>{locale.playListDuplicate}</MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    onPlayListDelete(PL_ID, name);
                }}>{locale.playListDelete}</MenuItem>
            </Menu>
        </span>

    )
}
export default memo(PlayListSetComponent);