// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  INotebookTracker,
  NotebookPanel,
  NotebookTracker
} from '@jupyterlab/notebook';

import { CodeCell } from '@jupyterlab/cells';

import { IDisposable } from '@phosphor/disposable';

import { Signal } from '@phosphor/signaling';

import { Breakpoints } from '../breakpoints';

import { Debugger } from '../debugger';

import { IDebugger } from '../tokens';

import { Callstack } from '../callstack';

import { EditorHandler } from './editor';

export class NotebookHandler implements IDisposable {
  constructor(options: NotebookHandler.IOptions) {
    this.debuggerModel = options.debuggerService.model as Debugger.Model;
    this.debuggerService = options.debuggerService;
    this.notebookTracker = options.tracker;
    this.notebookPanel = this.notebookTracker.currentWidget;

    this.id = options.id;
    this.breakpoints = this.debuggerModel.breakpointsModel;

    this.editorHandler = new EditorHandler({
      breakpointsModel: this.breakpoints,
      debuggerModel: this.debuggerModel,
      debuggerService: this.debuggerService,
      activeCell: this.notebookTracker.activeCell as CodeCell
    });

    this.notebookTracker.activeCellChanged.connect(
      this.onActiveCellChanged,
      this
    );

    this.debuggerModel.callstackModel.currentFrameChanged.connect(
      this.onCurrentFrameChanged,
      this
    );
  }

  isDisposed: boolean;

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.cleanAllCells();
    this.editorHandler.dispose();
    Signal.clearData(this);
  }

  protected cleanAllCells() {
    const cells = this.notebookPanel.content.widgets;
    cells.forEach(cell => {
      EditorHandler.clearHighlight(cell);
      EditorHandler.clearGutter(cell);
    });
  }

  protected onActiveCellChanged(
    notebookTracker: NotebookTracker,
    codeCell: CodeCell
  ) {
    if (notebookTracker.currentWidget.id !== this.id) {
      return;
    }
    this.editorHandler.activeCell = codeCell;
  }

  private onCurrentFrameChanged(
    callstackModel: Callstack.Model,
    frame: Callstack.IFrame
  ) {
    const notebook = this.notebookTracker.currentWidget;
    if (!notebook) {
      return;
    }

    const cells = notebook.content.widgets;
    cells.forEach(cell => EditorHandler.clearHighlight(cell));

    if (!frame) {
      return;
    }

    cells.forEach((cell, i) => {
      // check the event is for the correct cell
      const code = cell.model.value.text;
      const cellId = this.debuggerService.getCellId(code);
      if (frame.source.path !== cellId) {
        return;
      }
      notebook.content.activeCellIndex = i;
      EditorHandler.showCurrentLine(cell, frame);
    });
  }

  private notebookTracker: INotebookTracker;
  private debuggerModel: Debugger.Model;
  private debuggerService: IDebugger;
  private breakpoints: Breakpoints.Model;
  private notebookPanel: NotebookPanel;
  private editorHandler: EditorHandler;
  private id: string;
}

export namespace NotebookHandler {
  export interface IOptions {
    debuggerService: IDebugger;
    tracker: INotebookTracker;
    id?: string;
  }
}
