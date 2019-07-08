const websocket = new WebSocket("ws://localhost:8088");

websocket.onopen = () => {
    const msg = JSON.stringify({
        type: "request",
        method: "initialize",
        id: 0,
        arguments: {
            projectName: "lsif-typescript-server",
            gitRepourl: "git@github.com/ash/github.git",
        }
    });
    websocket.send(msg);
};
