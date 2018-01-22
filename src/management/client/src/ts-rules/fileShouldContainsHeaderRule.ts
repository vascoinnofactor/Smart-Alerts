// -----------------------------------------------------------------------
// <copyright file="fileShouldContainsHeaderRule.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from 'fs';

export class Rule extends Lint.Rules.AbstractRule {  
    public static FAILURE_STRING = 'File should contains header: ';
    
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFileWithoutCopyrightHeader(sourceFile, this.getOptions()));
    }
}

class NoFileWithoutCopyrightHeader extends Lint.RuleWalker {
    public visitSourceFile(sourceFile: ts.SourceFile) {
        if (sourceFile && sourceFile.fileName && sourceFile.getFullText()) {
            // tslint:disable-next-line:no-console
            let copyrightHeaderTemplate = fs.readFileSync('./src/ts-rules/copyrightHeader.txt').toString();
            
            // Create the copyright header based on the file name
            copyrightHeaderTemplate = copyrightHeaderTemplate.replace('{fileName}',
                                                                      sourceFile.fileName.substring(
                                                                      sourceFile.fileName.lastIndexOf('/') + 1));

            // Check if file is starting with it - if so, no need to continue
            if (sourceFile.getFullText().startsWith(copyrightHeaderTemplate)) {
                return super.visitSourceFile(sourceFile);
            }

            this.addFailure(this.createFailure(1, 1,
                                               Rule.FAILURE_STRING +
                                               '\n' + 
                                               copyrightHeaderTemplate));
               
            return super.visitSourceFile(sourceFile);
        }
        
        super.visitSourceFile(sourceFile);
    }
}
