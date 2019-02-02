const { TouchBar } = require('electron');

let currentUid, options;

exports.onWindow = win => {
    win.rpc.on('uid set', uid => { currentUid = uid });

    const { TouchBarButton, TouchBarPopover } = TouchBar;
    const buttons = [];
    const popovers = [];

    if (options) {
        for (const [index, module] of Object.entries(options)) {
            // create buttons for each child
            buttons[module.label] = [];
            for (const [key, btn] of Object.entries(module.options)) {
                const b = new TouchBarButton({
                    label: `${btn.label}`,
                    click: () => {
                        writeToTerminal(win, btn.command, {
                            esc: btn.esc || false,
                            promptUser: btn.prompt || false,
                        })
                    }
                });
                buttons[module.label].push(b);
            }

            // create popover for each parent
            const pop = new TouchBarPopover({
                label: module.label,
                items: new TouchBar([
                    ...buttons[module.label]
                ])
            });
            popovers.push(pop);
        }
    }

    // static clear button
    const clearBtn = new TouchBarButton({
        label: 'clear',
        backgroundColor: '#d13232',
        click: () => {
            writeToTerminal(win, 'clear');
        }
    });

    // main touchbar
    const touchBar = new TouchBar([
        clearBtn,
        ...popovers
    ]);

    win.setTouchBar(touchBar);
};

exports.middleware = () => next => action => {
    switch (action.type) {
      case 'SESSION_SET_ACTIVE':
      case 'SESSION_ADD': {
        window.rpc.emit('uid set', action.uid);
        break;
      }
      default: {
        break;
      }
    }
    return next(action);
};

exports.decorateConfig = (config) => {
    options = config.hyperCustomTouchbar;
    return config;
};

function writeToTerminal(win, command, options = {}) {
    // \x1B ESC char
    // \x03 ETX char for ^C
    // \x0D CR char for enter
    let esc = options.esc ? `\x1B` : `\x03`
    let enter = options.promptUser ? `` : `\x0D`

    win.sessions.get(currentUid).write(`${esc}${command}${enter}`);
}