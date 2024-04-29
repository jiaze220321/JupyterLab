// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module my-extension
 */

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

/**
 * 插件激活函数
 */
function activate(app: JupyterFrontEnd, mainMenu: IMainMenu): void {
  const { commands } = app;

  // 添加一个命令
  const commandId = 'example:open-dialog';
  commands.addCommand(commandId, {
    label: 'Say Hello',
    execute: () => alert('Hello, Jupyter!')
  });

  // 添加菜单项
  mainMenu.fileMenu.newMenu.addGroup([{ command: commandId }]);
}

/**
 * 插件定义
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'my-extension',
  autoStart: true,
  requires: [IMainMenu],
  activate: activate
};

export default extension;
