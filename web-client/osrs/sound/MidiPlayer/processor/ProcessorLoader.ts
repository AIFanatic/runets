// @ts-ignore
import AudioWorkletProcessor from "./processor.file.js"

export class ProcessorLoader {
    public static async Load(): Promise<string> {
        const blob = new Blob([AudioWorkletProcessor], {type: 'application/javascript'});
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        return await new Promise<string>(result => {
            reader.onloadend = function () {
                result(reader.result.toString());
            }
        });
    }
}