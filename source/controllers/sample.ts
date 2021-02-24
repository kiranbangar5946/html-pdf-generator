/**
 * Dependencies
 */
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import pdf from 'html-pdf'; 

/**
 * Constants
 */
const filePath = `${process.cwd()}/view/invoice.html`
const pdfPath = './invoice.pdf'

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

        const options: object = { format: 'Letter' };

        //reads html file with fs module
        const html = fs.readFileSync(filePath, 'utf8');

        //creates pdf using 'html-pdf' module
        // pdf.create(html, options).toFile('./invoice.pdf', (err: Error, res: any) => {
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
