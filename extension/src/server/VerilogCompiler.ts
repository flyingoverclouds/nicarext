'use strict';

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    Diagnostic, DiagnosticSeverity
} from 'vscode-languageserver';

import { INicarextSettings } from './ISettings'


export namespace Compilers {
    /*
     * This class encapsulate run of IcarusServer
    */
    export class Compiler {
        private settings: INicarextSettings;

        /**
         * Constructor of IcarusServer instance. Initialize mandatory settings
         */
        constructor(settings: INicarextSettings) {
            this.settings=settings;
        }

        public CheckSyntax(uri:string,fileToCompile: string, sendDiag: (d: Diagnostic[]) => void ) :void {
            if (!fs.existsSync(this.settings.iverilogCompilerExePath)){
                throw new Error("Verilog compiler not found. Missing  " + this.settings.iverilogCompilerExePath);
            }
            if (!fs.existsSync(fileToCompile)){
                throw new Error("Invalid file name. Not found " + fileToCompile);
            }

            // iverilog outputfile set to  NUL because we only want syntax check and stderr retieving without a buil file 
            // TODO : check/add unix OS support 
            let ivParams = ["-o","NUL",fileToCompile];

            //calling iverilog.exe to retrieve stderr (syntaxt or compilation error)
            let iverilogProcess = child_process.execFile(this.settings.iverilogCompilerExePath,ivParams,
                (error,stdout,stderr)=>{
                    if (error) { 
                        // splitting stderr and removing filename
                        let lines :string[] = stderr.split("\n").map( l=> l.replace(fileToCompile,""));
                        let diagnostics = this.GetDiagnostics(lines);
                        //this.connection.sendDiagnostics( { uri: uri, diagnostics} );
                        sendDiag(diagnostics);
                    }
                    else{
                        // no error -> return empty dignostics to clear the list in vscode
                        sendDiag( [] );
                        
                    }
                });
        }

        private GetDiagnostics(lines: string[]): Diagnostic[] {
            let diagnostics: Diagnostic[] = [];
            let lastLineNumber:number=1;

            for(let l of lines) {
                if(l.trim()=="")
                    continue;
                if (l.includes("error(s) during elaboration")) // removing iverilog summary line
                    continue;

                let diagseverity:DiagnosticSeverity=DiagnosticSeverity.Error;

                let message:string="";
                let lineNumber:number=1;
                // normally, error line looks like ':LINENUM: message'
                if (l.startsWith(":")) {
                    let pos = l.indexOf(":",1);
                    lineNumber = Number(l.substring(1,pos))-1; // because vscode diagnostic line numbering start a 0
                    message = l.substring(pos+1).trim();
                    if (message.startsWith("error:")) { // clean message text
                        message=message.substring(6);
                    }
                }
                else {
                    message= l;
                    lineNumber=lastLineNumber; // unable to detect line number -> use the last detected
                    diagseverity=DiagnosticSeverity.Warning; // but as warning
                }
                diagnostics.push({
                    severity: diagseverity,
                    range: { 
                        start: {line: lineNumber, character:0 },
                        end: { line: lineNumber, character: Number.MAX_VALUE}
                    },
                    message: `${message}`,
                    source:''
                });
                lastLineNumber=lineNumber;
            };
            return diagnostics;
        }
    }
}