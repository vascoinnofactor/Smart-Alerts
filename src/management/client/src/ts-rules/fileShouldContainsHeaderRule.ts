// -----------------------------------------------------------------------
// <copyright file="fileShouldContainsHeaderRule.ts" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as fs from 'fs';

class NoFileWithoutCopyrightHeader extends Lint.RuleWalker {
    private static FAILURE_STRING = 'File should contains header: ';

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

            // Create a fix - add the header to the start of the file
            const fix = new Lint.Replacement(1, 1, copyrightHeaderTemplate);

            this.addFailure(this.createFailure(1, 1,
                                               NoFileWithoutCopyrightHeader.FAILURE_STRING +
                                               '\n' + 
                                               copyrightHeaderTemplate,
                                               fix));
               
            return super.visitSourceFile(sourceFile);
        }
        
        super.visitSourceFile(sourceFile);
    }
}

export class Rule extends Lint.Rules.AbstractRule {  
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFileWithoutCopyrightHeader(sourceFile, this.getOptions()));
    }
}
