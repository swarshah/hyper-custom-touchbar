# Hyper Custom Touch Bar

**hyper-custom-touchbar is a Touch Bar plugin for [Hyper.app](https://hyper.is/)**. It replaces the Touch Bar area with user-defined executable commands.

## Install

To install, edit `~/.hyper.js` and add `'hyper-custom-touchbar'` to `plugins`:

```javascript
module.exports = {
  ...
  plugins: ['hyper-custom-touchbar']
  ...
}
```


## Custom Touch Bar Buttons

Following is what my shortcuts look like but feel free to change them as you like to better suit your development needs.

Add the following to `~/.hyper.js`

```javascript
module.exports = {
  config: {
    ...
      hyperCustomTouchbar: [
      // if you just need a single button then don't add options array
      { label: 'clear', command: 'clear', backgroundColor: '#d13232' },
      { label: 'man', command: 'man ', prompt: true },
      {
        label: 'git',
        options: [
          { label: 'diff', command: 'git diff' },          
          { label: 'status', command: 'git status' },  
          { label: 'log', command: 'git log' },
          { label: 'add .', command: 'git add .', icon: '/tmp/icons8-add-file-44.png', iconPosition: 'right' },
          { label: 'clone', command: 'git clone ', prompt: true },
        ]
      },
      {
        icon: '/tmp/icons8-folder-44.png',
        options: [
          { command: 'cd /usr/local/etc/nginx', icon: '/tmp/icons8-database-44.png', backgroundColor: '#000' },
          { command: 'cd /usr/local/var/log', icon: '/tmp/icons8-binary-file-44.png', backgroundColor: '#000' },
          { command: 'cd ~/Dropbox/', icon: '/tmp/icons8-dropbox-44.png', backgroundColor: '#000' },
          { command: 'cd ~/Downloads/', icon: '/tmp/icons8-downloading-updates-44.png', backgroundColor: '#000' }
        ]
      },
      {
        label: 'vim',
        options: [
          { label: 'quit', command: ':q!', esc: true },
          { label: 'save & quit', command: ':x', esc: true },
        ]
      },
    ]
    ...
  }
}
```

Please note that `command` is always mandatory. The optional keys are:
- `label` (default is `''`): label for the button.
- `icon` (default is `''`): full path of the image file. According to Apple, ideal icon size is `36px × 36px` and maximum icon size is `44px × 44px`.
- `iconPosition` (default is `left`): possible values are `left`, `right` and `overlay`. **Note**: this is not supported for main level popover buttons but will work for single button like `man` from example.
- `backgroundColor` (default is `#363636`): string hex code representing the button's background color. **Note**: this is not supported for main level popover buttons but will work for single button like `man` from example.
- `esc` (default is `false`): setting `esc` to `true` will be like pressing the `Escape` key before your command runs, instead of the classic `Ctrl`+`C`, which is useful in contexts (e.g. _VIM_) where the running operation can’t be stopped by `Ctrl`+`C`.
- `prompt`(default is `false`): by setting `prompt` to `true`, the plugin won’t press the `Enter` key after writing the command, so that the user can complete the command by a custom input (see example with `git clone `; notice the space ending the `command`).


And now restart your Hyper terminal and you should see populated Touch Bar.

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotMain.png)

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotGit.png)

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotCD.png)

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotVIM.png)

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/SwarShah/hyper-custom-touchbar/blob/master/LICENSE) file for details
