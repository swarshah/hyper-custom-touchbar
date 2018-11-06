const { TouchBar } = require('electron');

let currentUid, options;

exports.onWindow = win => {
    win.rpc.on('uid set', uid => { currentUid = uid });

    const { TouchBarButton, TouchBarPopover } = TouchBar;
    const buttons = [];
    const popovers = [];

    for (const [index, module] of Object.entries(options)) { 
        // create buttons for each child
        buttons[module.label] = [];
        for (const [key, btn] of Object.entries(module.options)) {
            const b = new TouchBarButton({
                label: `${btn.label}`,
                click: () => {
                    const esc = btn.esc || false;
                    writeToTerminal(win, btn.command, esc)
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
    options = config.customTouchbar;
    return config;
};

function writeToTerminal(win, command, esc = false) {
    // \x1B ESC char
    // \x03 ETX char for ^C
    // \x0D CR char for enter
    if(esc === true)
        win.sessions.get(currentUid).write(`\x1B${command}\x0D`);
    else
        win.sessions.get(currentUid).write(`\x03${command}\x0D`);
}