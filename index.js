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
    const { TouchBarPopover } = TouchBar;
    const popovers = [];
    const mainButtons = [];

    if (currentWindow && options) {
        // static clear button
        const clearBtn = createTouchBarButton({
            label: 'clear',
            backgroundColor: '#d13232',
            command: 'clear'
        });
        mainButtons.push(clearBtn);

        for (const [index, module] of Object.entries(options)) {
            // if there is options array create popover and buttons
            if (module.options) {
                const buttons = [];
                // create buttons for child
                for (const [key, btn] of Object.entries(module.options)) {
                    buttons.push(createTouchBarButton(btn));
                }
                // create popover for each parent
                const popover = new TouchBarPopover({
                    label: module.label || '',
                    icon: module.icon ? nativeImage.createFromPath(module.icon) : '',
                    items: new TouchBar([
                        ...buttons
                    ])
                });
                popovers.push(popover);
            }
            // if not array then consider as a button
            else {
                mainButtons.push(createTouchBarButton(module));
            }
        }

        // main touchbar
        const touchBar = new TouchBar([
            ...mainButtons,
            ...popovers
        ]);

        currentWindow.setTouchBar(touchBar);
    }
}

function createTouchBarButton(options = {}) {
    const { TouchBarButton } = TouchBar;
    const label = options.label || '';
    const icon = options.icon ? nativeImage.createFromPath(options.icon) : '';
    const backgroundColor = options.backgroundColor ? options.backgroundColor : '#363636';
    let iconPosition = options.iconPosition ? options.iconPosition : 'left';
    // if no icon position and no label then center the icon
    if (options.iconPosition === undefined && options.label === undefined)
        iconPosition = 'overlay';
    const command = options.command || '';
    // for vim
    const esc = options.esc || false;
    // to wait for user input
    const promptUser = options.prompt || false;

    const button = new TouchBarButton({
        label: label,
        icon: icon,
        backgroundColor: backgroundColor,
        iconPosition: iconPosition,
        click: () => {
            writeToTerminal(command, {
                esc: esc,
                promptUser: promptUser,
            });
        }
    });

    return button;
}

function writeToTerminal(command, options = {}) {
    // \x1B ESC char
    // \x03 ETX char for ^C
    // \x0D CR char for enter
    let esc = options.esc ? `\x1B` : `\x03`
    let enter = options.promptUser ? `` : `\x0D`

    currentWindow.sessions.get(currentUid).write(`${esc} ${command}${enter}`);
}