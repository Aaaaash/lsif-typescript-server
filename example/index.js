const websocket = new WebSocket("ws://localhost:8088");

websocket.onopen = () => {
    const msg = JSON.stringify({
        type: "request",
        method: "initialize",
        id: 0,
        arguments: {
            projectName: "lsif-typescript-server",
            url: "git@github.com:theia-ide/dugite-extra.git",
        }
    });
    websocket.send(msg);

    websocket.addEventListener('message', (ev) => {
        const response = JSON.parse(ev.data);
        if (response.result) {

            console.log(response.result);
            switch(response.method) {
                case 'initialize':
                    const documentSymbolRequest = JSON.stringify({
                        type: 'request',
                        method: 'documentSymbol',
                        id: 1,
                        arguments: {
                            textDocument: {
                                uri: '/Users/baoxubing/Documents/work/lsif-project/lsif-typescript-server/.gitrepo/theia-ide/dugite-extra/src/model/commit-identity.ts'
                            }
                        }
                    });

                    websocket.send(documentSymbolRequest);
                    break;
            }
        }
    });
};
