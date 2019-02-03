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
      {
        label: 'git',
        options: [
          { label: 'diff',  command: 'git diff' },
          { label: 'status',  command: 'git status' },
          { label: 'log',  command: 'git log' },
          { label: 'add .',  command: 'git add .' },
          { label: 'clone',  command: 'git clone ', prompt: true },
        ]
      },
      {
        label: 'cd',
        options: [
          { label: 'nginx', command: 'cd /usr/local/etc/nginx' },
          { label: 'log', command: 'cd /usr/local/var/log' },
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

Please note that `label` and `command` are always mandatory. The optional keys are:
- `esc` (default is `false`): setting `esc` to `true` will be like pressing the `Escape` key before your command runs, instead of the classic `Ctrl`+`C`, which is useful in contexts (e.g. _VIM_) where the running operation can’t be stopped by `Ctrl`+`C`.
- `prompt`(default is `false`): by setting `prompt` to `true`, the plugin won’t press the `Enter` key after writing the command, so that the user can complete the command by a custom input (see example with `git clone `; notice the space ending the `command`).


And now restart your Hyper terminal and you should see populated Touch Bar.

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotMain.png)

![Screenshot](https://raw.githubusercontent.com/SwarShah/hyper-custom-touchbar/master/ScreenshotGit.png)

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/SwarShah/hyper-custom-touchbar/blob/master/LICENSE) file for details
