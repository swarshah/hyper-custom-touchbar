const { TouchBar, nativeImage } = require('electron');

let currentUid, options, currentWindow;

exports.onWindow = win => {
    win.rpc.on('uid set', uid => { currentUid = uid });
    currentWindow = win;
    populateTouchBar();
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
    const isSame = JSON.stringify(config.hyperCustomTouchbar) === JSON.stringify(options);
    if (!isSame) {
        options = config.hyperCustomTouchbar;
        populateTouchBar();
    }
    return config;
};

function populateTouchBar() {
    const { TouchBarButton, TouchBarPopover } = TouchBar;
    const buttons = [];
    const popovers = [];

    if (currentWindow && options) {
        for (const [index, module] of Object.entries(options)) {
            // create buttons for each child
            buttons[module.label] = [];
            for (const [key, btn] of Object.entries(module.options)) {
                const icon = btn.icon ? nativeImage.createFromPath(btn.icon) : '';
                const backgroundColor = btn.backgroundColor ? btn.backgroundColor : '#363636';
                let iconPosition = btn.iconPosition ? btn.iconPosition : 'left';
                if (btn.iconPosition === undefined && btn.label === undefined)
                    iconPosition = 'overlay';
                const b = new TouchBarButton({
                    label: btn.label || '',
                    icon: icon,
                    backgroundColor: backgroundColor,
                    iconPosition: iconPosition,
                    click: () => {
                        writeToTerminal(btn.command, {
                            esc: btn.esc || false,
                            promptUser: btn.prompt || false,
                        })
                    }
                });
                buttons[module.label].push(b);
            }

            // create popover for each parent
            const pop = new TouchBarPopover({
                label: module.label || '',
                icon: module.icon ? nativeImage.createFromPath(module.icon) : '',
                items: new TouchBar([
                    ...buttons[module.label]
                ])
            });
            popovers.push(pop);
        }

        // static clear button
        const clearBtn = new TouchBarButton({
            label: 'clear',
            backgroundColor: '#d13232',
            click: () => {
                writeToTerminal('clear');
            }
        });

        // main touchbar
        const touchBar = new TouchBar([
            clearBtn,
            ...popovers
        ]);

        currentWindow.setTouchBar(touchBar);
    }
}

function writeToTerminal(command, options = {}) {
    // \x1B ESC char
    // \x03 ETX char for ^C
    // \x0D CR char for enter
    let esc = options.esc ? `\x1B` : `\x03`
    let enter = options.promptUser ? `` : `\x0D`

    currentWindow.sessions.get(currentUid).write(`${esc} ${command}${enter}`);
}