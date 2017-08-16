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
                        console.log("## ERRORS :")
                        console.log(stderr);
                        console.log("## ----------------------")
                        // splitting stderr and removing filename
                        let lines :string[] = stderr.split("\n"); //.map( l=> l.replace(fileToCompile,""));
                        console.log(lines.length + " line(s) after split");
                        let diagnostics = this.GetDiagnostics(fileToCompile, lines);
                        sendDiag(diagnostics);
                    }
                    else{
                        console.log("No error.");
                        // no error -> return empty dignostics to clear the list in vscode
                        sendDiag( [] );
                        
                    }
                });
        }

        private GetDiagnostics(filename:string, lines: string[]): Diagnostic[] {
            let diagnostics: Diagnostic[] = [];
            let lastLineNumber:number=1;
            let lastDiagnostic: Diagnostic = null;

            for(let l of lines) {
                if(l.trim()=="")
                    continue;
                if (l.includes("error(s) during elaboration")) // removing iverilog summary line
                    continue;

                let diagseverity:DiagnosticSeverity=DiagnosticSeverity.Error;

                let message:string="";
                let lineNumber:number=1;
                if (lastDiagnostic && !l.startsWith(filename)) { // line that does not start with the filename -> add to previous diag
                    lastDiagnostic.message+= (" " + l);
                }
                else {
                    let l2 = l.replace(filename,"");
                    // normally, error line looks like ':LINENUM: message'
                    if (l2.startsWith(":")) {
                        let pos = l2.indexOf(":",1);
                        lineNumber = Number(l2.substring(1,pos))-1; // because vscode diagnostic line numbering start a 0
                        message = l2.substring(pos+1).trim();
                        if (message.startsWith("error:")) { // clean message text
                            message=message.substring(6);
                        }
                    }
                    else {
                        message= l2;
                        lineNumber=lastLineNumber; // unable to detect line number -> use the last detected
                        //diagseverity=DiagnosticSeverity.Warning; // but as warning
                    }
                    lastDiagnostic={
                        severity: diagseverity,
                        range: { 
                            start: {line: lineNumber, character:0 },
                            end: { line: lineNumber, character: Number.MAX_VALUE}
                        },
                        message: `${message}`,
                        source:''
                    };
                    diagnostics.push(lastDiagnostic);
                    lastLineNumber=lineNumber;
                }
            };
            return diagnostics;
        }
    }
}