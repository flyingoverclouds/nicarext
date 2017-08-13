'use strict';

import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} 
    from 'vscode';

export namespace Nicorext {

    export class VerilogHelper {
        constructor(parameters) 
        {
            
        }
        
        private _statusBarItem: StatusBarItem;


        /**
         * UpdateSB : update status bar
         */
        public UpdateSB(msg :string) 
        {
            // Create as needed
            if (!this._statusBarItem) {
                this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            }

            // Get the current text editor
            let editor = window.activeTextEditor;
            if (!editor) {
                this._statusBarItem.hide();
                return;
            }

            let doc = editor.document;

            // Only update status if an Markdown file
            if (doc.languageId === "markdown") {
                // Update the status bar
                this._statusBarItem.text = 'Nouveau message de l\'extension';
                this._statusBarItem.show();
            } else { 
                this._statusBarItem.hide();
            }
        }

        dispose() {
            this._statusBarItem.dispose();
        }

    }
}