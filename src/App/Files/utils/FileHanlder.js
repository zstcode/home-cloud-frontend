import { message, Modal } from "antd";
import axios from "axios";

const { confirm } = Modal;

const UploadHandler = async (files, path, callback) => {
    for (const file of files) {
        let formData = new FormData();
        formData.append("dir", path);
        formData.append("file", file);
        try {
            let res = await axios.post("/api/file/upload", formData);
            if (res.data.success !== 0) {
                message.error(res.data.message);
            } else {
                if (res.data.files[file.name].result) {
                    message.info(`Upload ${file.name} success`);
                } else {
                    message.error(`Upload ${file.name} error`);
                }
            }
            await callback();
        } catch (error) {
            message.error(error.response.data.message);
        }
    }
};

// FetchInfo: Get the current folder infomation based on the matched URL path
const FetchInfo = async (
    path,
    setFolder,
    setFileList,
    setCurrentFile,
    setPreviewVisable
) => {
    try {
        let folderPath = "/";
        if (path.length > 0 && path[path.length - 1] === "/") {
            folderPath += path.slice(0, path.length - 1);
        } else {
            folderPath += path;
        }
        let formData = new URLSearchParams();
        formData.append("dir", folderPath);
        const pathData = await axios.post("/api/file/get_info", formData);
        // If it is a file, will set the current folder as its parent and open the preview dialog
        // The backend will return the parent folder info if it is a file
        if (pathData.data.type === "folder") {
            setFolder({
                name: pathData.data.info.Name,
                root: pathData.data.root,
                path: pathData.data.info.Position,
                encryption: false,
            });
            setPreviewVisable(false);
        } else {
            folderPath = pathData.data.parent_info.Position;
            setFolder({
                name: pathData.data.parent_info.Name,
                root: pathData.data.parent_root,
                path: pathData.data.parent_info.Position,
                encryption: false,
            });
            setCurrentFile({
                name: pathData.data.info.Name,
                position: pathData.data.info.Position,
                size: pathData.data.info.Size,
                type: pathData.data.info.FileType,
                updateTime:
                    pathData.data.info.UpdatedAt.slice(0, 10) +
                    " " +
                    pathData.data.info.UpdatedAt.slice(11, 19),
                createTime:
                    pathData.data.info.CreatedAt.slice(0, 10) +
                    " " +
                    pathData.data.info.CreatedAt.slice(11, 19),
                creator: pathData.data.info.CreatorId,
                owner: pathData.data.info.OwnerId,
                shared: false,
                favorite: pathData.data.info.Favorite,
            });
            setPreviewVisable(true);
        }
        formData = new URLSearchParams();
        formData.append("dir", folderPath);
        const fileData = await axios.post("/api/file/list_dir", formData);
        const files = fileData.data.children.map((v, idx) => {
            return {
                key: idx,
                dir: v.IsDir,
                name: v.Name,
                size: v.Size,
                type: v.FileType,
                updateTime:
                    v.UpdatedAt.slice(0, 10) + " " + v.UpdatedAt.slice(11, 19),
                createTime:
                    v.CreatedAt.slice(0, 10) + " " + v.CreatedAt.slice(11, 19),
                creator: v.CreatorId,
                owner: v.OwnerId,
                favorite: v.Favorite,
                position: v.Position,
            };
        });
        setFileList(files);
    } catch (error) {
        console.log(error);
        message.error(error.response.data.message);
    }
};

// HandleDelete: Delete file based what the paths
const HandleDelete = (paths, syncFolder, setSelectedRows) => {
    const title =
        paths.length === 1
            ? `"Do you want to delete ${paths[0]}?"`
            : "Do you want to delete these items?";
    confirm({
        title,
        onOk() {
            const deleteFile = async (paths) => {
                await Promise.all(
                    paths.map(async (v) => {
                        let formData = new URLSearchParams();
                        formData.append("dir", v);
                        try {
                            const res = await axios.post(
                                "/api/file/delete",
                                formData
                            );
                            if (res.data.success === 0) {
                                message.info(`Delete ${v} success! `);
                            } else {
                                message.error(
                                    `Delete ${v} error: ${res.data.message}! `
                                );
                            }
                        } catch (error) {
                            message.error(
                                `Delete ${v} error: ${error.response.data.message}! `
                            );
                        }
                    })
                );
                setSelectedRows([]);
                await syncFolder();
            };
            deleteFile(paths);
        },
        onCancel() {
            return;
        },
    });
};

// HandleFavorite: Toggle Favorite settings
const HandleFavorite = (paths, syncFolder, setSelectedRows) => {
    const toogleFavortite = async (paths) => {
        await Promise.all(
            paths.map(async (v) => {
                let formData = new URLSearchParams();
                formData.append("dir", v);
                try {
                    const res = await axios.put(
                        "/api/file/favorite",
                        formData
                    );
                    if (res.data.success !== 0) {
                        message.error(
                            `Change Favorite for ${v} error: ${res.data.message}! `
                        );
                    }
                } catch (error) {
                    message.error(
                        `Change Favorite for ${v} error: ${error.response.data.message}! `
                    );
                }
            })
        )
        setSelectedRows([]);
        syncFolder();
    }
    toogleFavortite(paths);
}

export { UploadHandler, FetchInfo, HandleDelete, HandleFavorite };