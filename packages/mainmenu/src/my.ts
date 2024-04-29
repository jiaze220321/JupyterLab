// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IRankedMenu, RankedMenu } from '@jupyterlab/ui-components';
import { SemanticCommand } from '@jupyterlab/apputils';

/**
 * An interface for a My menu.
 */
export interface IMyMenu extends IRankedMenu {
  /**
   * A semantic command to get the kernel for the help menu.
   * This is used to populate additional help
   * links provided by the kernel of a widget.
   *
   * #### Note
   * The command must return a Kernel.IKernelConnection object
   */
  readonly getKernel: SemanticCommand;
}

/**
 * An extensible My menu for the application.
 */
export class MyMenu extends RankedMenu implements IMyMenu {
  /**
   * Construct the help menu.
   */
  constructor(options: IRankedMenu.IOptions) {
    super(options);
    this.getKernel = new SemanticCommand();
  }

  /**
   * A semantic command to get the kernel for the help menu.
   * This is used to populate additional help
   * links provided by the kernel of a widget.
   *
   * #### Note
   * The command must return a Kernel.IKernelConnection object
   */
  readonly getKernel: SemanticCommand;
}
