import html2canvas from 'html2canvas';
import  jsPdf  from "jspdf";
import html2pdf from "html2pdf.js"


export const htmlPDFNewTab = async(string, fileName) => {
    const options = {
        filename: fileName
    }
    const worker = html2pdf().set(options).from(string).toPdf().get('pdf').then(function (pdf) {
        window.open(pdf.output('bloburl'), '_blank')});
}

export const htmlPDFSaveFile = async(string, fileName) => {
    const options = {
        filename: fileName
    }
    const worker = html2pdf().set(options).from(string).save()
}

export const htmlPDFBase64 = async(string, fileName) => {
    const options = {
        filename: fileName
    }
    // const worker = html2pdf().from(string).outputPdf('datauristring').then((pdfAsString)=>{
    //     let arr = pdfAsString.split(',');
    //     return pdfAsString= arr[1];  
    // })
    const worker = html2pdf().from(string).outputPdf().then((pdf)=>{
        console.log("typeof worker:    ", typeof worker)
        const base64 = btoa(pdf)
        // const base64 = Buffer.from(pdf,'base64')
        console.log("base64:   ", base64)
        return base64
    })
    return worker
}

