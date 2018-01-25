// -----------------------------------------------------------------------
// <copyright file="index.tsx" company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import * as React from 'react';
import { FileUpload } from 'react-md/lib/FileInputs';
import { TextField } from 'react-md/lib/TextFields';
import { Button } from 'react-md/lib/Buttons';
import { LinearProgress } from 'react-md/lib/Progress';

import './indexStyle.css';

interface FileUploaderProps {
    fileUploaderClassName?: string;
    textFieldClassName?: string;
    installButtonClassName?: string;
}

interface FileUploaderState {
    fileName: string;
    progress?: number;
    fileSize: number; 
    isSending: boolean;
}

/**
 * This component represents the file uploader.
 */
export default class FileUploader extends React.Component<FileUploaderProps, FileUploaderState> {
    constructor(props: FileUploaderProps) {
        super(props);

        this.state = {
            fileName: '',
            fileSize: 0,
            isSending: false,
            progress: undefined

        } as FileUploaderState;
    }

    public render() {
        const { fileName, progress } = this.state;
      
        let progressBar;
        if (typeof progress === 'number') {
            progressBar = (
                <span className="file-inputs__upload-form__progress">
                    <LinearProgress id="file-upload-status" value={progress} />
                </span>
            );
        }

        return (
            <div>
                <form
                    id="server-upload-form"
                    onSubmit={this.handleSubmit}
                    onReset={this.handleReset}
                    name="server-upload-form"
                    className="upload-file-input-form"
                >
                    {progressBar}
                    <FileUpload
                        id="server-upload-file"
                        label="Choose file"
                        accept="image/*,video/*"
                        onLoad={this.handleLoad}
                        onLoadStart={this.handleLoadStart}
                        onProgress={this.handleProgress}
                        onChange={this.onChange}
                        name="file"
                        className={this.props.fileUploaderClassName}
                        primary
                        iconBefore
                    />
                    <TextField
                        id="server-upload-file-field"
                        placeholder="No file chosen"
                        value={fileName}
                        className={this.props.textFieldClassName}
                        fullWidth={false}
                    />
                    <Button type="submit" flat primary className={this.props.installButtonClassName}>Install</Button>
                </form>
            </div>
        );
    }

    private onChange = (files: File | Array<File> | null) => {
        // do thing
    }

    private handleReset = () => {
        this.setState({ fileName: '' });
    }

    private handleLoadStart = () => {
        this.setState({ progress: 0 });
    }

    private handleLoad = (file: File, result: ArrayBuffer, event: Event) => {
        this.setState({ fileName: name, fileSize: result.byteLength });
    }

    private handleProgress = (file: File, progress: number, event: Event) => {
        this.setState({ progress });
    }

    private handleSubmit = () => {
        // do thing
    }
}