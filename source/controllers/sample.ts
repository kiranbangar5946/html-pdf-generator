/**
 * Dependencies
 */
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import pdf from 'html-pdf'; 

// @ts-ignore
// import signer from 'node-signpdf';
// console.log('signer',signer)


/**
 * Constants
 */
const filePath = `${process.cwd()}/view/Rendered.html`
const pdfPath = './rendered.pdf'

/**
 * Health check
 * @param req 
 * @param res 
 * @param next 
 */
const serverHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'pong'
    });
};

/**
 * Reads html file and generates pdf
 * @param req 
 * @param res 
 * @param next 
 */
const generatePdf = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const options: object = {
            format: "Legal",
             orientation:'landscape',
            //  "border": {
            //     "top": "1in",            // default is 0, units: mm, cm, in, px
            //     "right": "1in",
            //     // "bottom": "2in",
            //     "left": "1.5in"
            //   }
            };

        //reads html file with fs module
        const html = fs.readFileSync(filePath, 'utf8');

        //creates pdf using 'html-pdf' module
        // pdf.create(html, options).toFile(pdfPath, (err: Error, res: any) => {
        //     if (err) return console.log(err);
        //     console.log(res); // { filename: '/app/invoice.pdf' }
        // });

        //For files with large data we can use streaming
        pdf.create(html,options).toStream((err:Error, stream)=>{
            if (err) return console.log(err);
            stream.pipe(fs.createWriteStream(pdfPath));
          });

        return res.status(200).json({
            message: 'I will generate it now!'
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export default {
    serverHealthCheck,
    generatePdf
};
